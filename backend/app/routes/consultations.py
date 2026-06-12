from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional
from ..core.dependencies import get_current_user
from ..database.instantdb import query, upsert, new_id
from datetime import datetime, timezone

router = APIRouter(prefix="/api/consultations", tags=["consultations"])


class BookConsultationRequest(BaseModel):
    doctor_id:    str
    type:         str = "video"
    scheduled_at: Optional[str] = None


# Seed doctors in InstantDB via admin panel; mock used as fallback
MOCK_DOCTORS = [
    {"id": "d1", "name": "Dr. Priya Sharma",  "specialization": "General",      "experience": 8,  "rating": 4.8, "consultationFee": 299, "isAvailable": True,  "avatar": "👩‍⚕️"},
    {"id": "d2", "name": "Dr. Rahul Mehta",   "specialization": "Cardiologist",  "experience": 15, "rating": 4.9, "consultationFee": 599, "isAvailable": True,  "avatar": "👨‍⚕️"},
    {"id": "d3", "name": "Dr. Anjali Singh",  "specialization": "Dermatologist", "experience": 6,  "rating": 4.7, "consultationFee": 399, "isAvailable": False, "avatar": "👩‍⚕️"},
    {"id": "d4", "name": "Dr. Vikram Reddy",  "specialization": "Pediatrician",  "experience": 12, "rating": 4.8, "consultationFee": 349, "isAvailable": True,  "avatar": "👨‍⚕️"},
    {"id": "d5", "name": "Dr. Meera Patel",   "specialization": "Neurologist",   "experience": 10, "rating": 4.6, "consultationFee": 549, "isAvailable": True,  "avatar": "👩‍⚕️"},
    {"id": "d6", "name": "Dr. Arjun Kapoor",  "specialization": "Orthopedic",    "experience": 9,  "rating": 4.7, "consultationFee": 449, "isAvailable": True,  "avatar": "👨‍⚕️"},
]


@router.get("")
async def list_doctors(specialization: Optional[str] = Query(None)):
    # Try InstantDB first, fall back to mock
    try:
        where = {}
        if specialization:
            where["specialization"] = specialization
        data = await query({"doctors": {"$": {"where": where}} if where else {}})
        doctors = data.get("doctors", [])
        if doctors:
            return doctors
    except Exception:
        pass

    # fallback to mock
    docs = MOCK_DOCTORS
    if specialization:
        docs = [d for d in docs if d["specialization"] == specialization]
    return docs


@router.post("", status_code=201)
async def book_consultation(req: BookConsultationRequest, current_user: dict = Depends(get_current_user)):
    cid = new_id()
    await upsert("consultations", {
        "userId":      current_user["id"],
        "doctorId":    req.doctor_id,
        "type":        req.type,
        "status":      "booked",
        "scheduledAt": req.scheduled_at or datetime.now(timezone.utc).isoformat(),
        "createdAt":   datetime.now(timezone.utc).isoformat(),
    }, entity_id=cid)
    return {"message": "Consultation booked", "consultationId": cid}
