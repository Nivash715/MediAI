from pydantic import BaseModel
from typing import Optional


class MedicineResponse(BaseModel):
    id:                    str
    pharmacy_id:           str
    name:                  str
    brand:                 Optional[str]
    generic_name:          Optional[str]
    category:              Optional[str]
    description:           Optional[str]
    price:                 float
    mrp:                   Optional[float]
    discount_pct:          int
    image_url:             Optional[str]
    requires_prescription: bool
    in_stock:              bool
    dosage_form:           Optional[str]
    strength:              Optional[str]

    class Config:
        from_attributes = True
