from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from ..database.instantdb import query, get_one

router = APIRouter(prefix="/api/medicines", tags=["medicines"])


@router.get("")
async def list_medicines(
    q:        Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    pharmacy: Optional[str] = Query(None),
):
    where: dict = {"inStock": True}
    if category: where["category"] = category
    if pharmacy: where["pharmacyId"] = pharmacy

    data = await query({"medicines": {"$": {"where": where}}})
    medicines = data.get("medicines", [])

    # client-side name filter (InstantDB free tier doesn't support LIKE)
    if q:
        ql = q.lower()
        medicines = [m for m in medicines if ql in m.get("name", "").lower() or ql in m.get("brand", "").lower()]

    return medicines


@router.get("/categories")
async def get_categories():
    data = await query({"medicines": {"$": {"fields": ["category"]}}})
    cats = {m["category"] for m in data.get("medicines", []) if m.get("category")}
    return sorted(cats)


@router.get("/{id}")
async def get_medicine(id: str):
    m = await get_one("medicines", id)
    if not m:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return m
