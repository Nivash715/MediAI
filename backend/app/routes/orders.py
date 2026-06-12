from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from datetime import datetime, timezone
from ..database.instantdb import query, get_one, upsert, new_id, transact, get_where
from ..schemas.order import CreateOrderRequest, PaymentInitiateRequest, PaymentVerifyRequest
from ..core.dependencies import get_current_user
from ..core.config import settings
import razorpay, hmac, hashlib

router = APIRouter(prefix="/api/orders", tags=["orders"])

ACTIVE_STATUSES  = {"placed", "confirmed", "preparing", "picked_up"}
PAST_STATUSES    = {"delivered", "cancelled"}


@router.get("")
async def list_orders(
    status: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
):
    data = await query({"orders": {
        "$": {"where": {"userId": current_user["id"]}},
        "items": {},
    }})
    orders = data.get("orders", [])
    if status == "active":
        orders = [o for o in orders if o.get("status") in ACTIVE_STATUSES]
    elif status == "past":
        orders = [o for o in orders if o.get("status") in PAST_STATUSES]
    orders.sort(key=lambda o: o.get("createdAt", ""), reverse=True)
    return orders


@router.post("", status_code=201)
async def create_order(
    req: CreateOrderRequest,
    current_user: dict = Depends(get_current_user),
):
    subtotal     = sum(i.price * i.quantity for i in req.items)
    delivery_fee = 0.0 if subtotal >= 299 else 40.0
    tax          = round(subtotal * 0.05, 2)
    total        = subtotal + delivery_fee + tax

    order_id = new_id()
    steps = [["update", "orders", order_id, {
        "userId":          current_user["id"],
        "pharmacyId":      req.pharmacy_id,
        "paymentMethod":   req.payment_method,
        "paymentStatus":   "pending",
        "status":          "placed",
        "subtotal":        subtotal,
        "deliveryFee":     delivery_fee,
        "tax":             tax,
        "discount":        0.0,
        "total":           total,
        "deliveryAddress": req.delivery_address or "",
        "createdAt":       datetime.now(timezone.utc).isoformat(),
    }]]

    item_ids = []
    for item in req.items:
        iid = new_id()
        item_ids.append(iid)
        steps.append(["update", "orderItems", iid, {
            "orderId":    order_id,
            "medicineId": item.id,
            "name":       item.name,
            "price":      item.price,
            "quantity":   item.quantity,
        }])

    # link items to order
    steps.append(["link", "orders", order_id, {"items": item_ids}])

    await transact(steps)
    return await get_one("orders", order_id)


@router.get("/{id}")
async def get_order(id: str, current_user: dict = Depends(get_current_user)):
    order = await get_one("orders", id)
    if not order or order.get("userId") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/{id}/cancel")
async def cancel_order(id: str, current_user: dict = Depends(get_current_user)):
    order = await get_one("orders", id)
    if not order or order.get("userId") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.get("status") not in ("placed", "confirmed"):
        raise HTTPException(status_code=400, detail="Cannot cancel at this stage")
    await upsert("orders", {"status": "cancelled"}, entity_id=id)
    return {"message": "Order cancelled"}


# ── Payments ──────────────────────────────────────────────────────────────────

@router.post("/payment/initiate")
async def initiate_payment(req: PaymentInitiateRequest, current_user: dict = Depends(get_current_user)):
    rz = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    rz_order = rz.order.create({"amount": int(req.amount * 100), "currency": "INR", "receipt": req.order_id})
    return {"razorpayOrderId": rz_order["id"]}


@router.post("/payment/verify")
async def verify_payment(req: PaymentVerifyRequest, current_user: dict = Depends(get_current_user)):
    expected = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        f"{req.razorpay_order_id}|{req.razorpay_payment_id}".encode(),
        hashlib.sha256,
    ).hexdigest()
    if expected != req.razorpay_signature:
        raise HTTPException(status_code=400, detail="Payment verification failed")
    await upsert("orders", {
        "paymentStatus":    "paid",
        "razorpayPaymentId": req.razorpay_payment_id,
        "status":           "confirmed",
    }, entity_id=req.order_id)
    return {"message": "Payment verified"}
