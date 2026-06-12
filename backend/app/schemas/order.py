from pydantic import BaseModel
from typing import Optional, List


class CartItemInput(BaseModel):
    id:       str
    name:     str
    price:    float
    quantity: int


class CreateOrderRequest(BaseModel):
    items:          List[CartItemInput]
    pharmacy_id:    str
    payment_method: str = "cod"
    delivery_address: Optional[str]
    coupon_code:    Optional[str]


class OrderItemResponse(BaseModel):
    id:          str
    name:        str
    price:       float
    quantity:    int

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id:              str
    status:          str
    payment_method:  str
    payment_status:  str
    subtotal:        float
    delivery_fee:    float
    tax:             float
    discount:        float
    total:           float
    items:           List[OrderItemResponse]
    created_at:      str

    class Config:
        from_attributes = True


class PaymentInitiateRequest(BaseModel):
    order_id: str
    amount:   float


class PaymentVerifyRequest(BaseModel):
    order_id:               str
    razorpay_order_id:      str
    razorpay_payment_id:    str
    razorpay_signature:     str
