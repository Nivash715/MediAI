from fastapi import APIRouter, Depends, HTTPException
from ..database.instantdb import get_one, upsert
from ..core.dependencies import get_current_user

router = APIRouter(prefix="/api/delivery", tags=["delivery"])


@router.get("/{order_id}/track")
async def track_delivery(order_id: str, current_user: dict = Depends(get_current_user)):
    order = await get_one("orders", order_id)
    if not order or order.get("userId") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check if a delivery record exists in InstantDB
    delivery = await get_one("deliveries", order_id)

    return {
        "orderId": order_id,
        "status":  order.get("status", "placed"),
        "eta":     delivery.get("eta", "25–35 min") if delivery else "25–35 min",
        "partner": delivery.get("partner") if delivery else {
            "name":    "Ravi Kumar",
            "phone":   "+91-9876543210",
            "vehicle": "Honda Activa · MH 01 AB 1234",
            "avatar":  "🛵",
            "lat":     18.5204,
            "lng":     73.8567,
        },
    }
