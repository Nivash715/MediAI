from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from ..database.instantdb import query, get_one
import math

router = APIRouter(prefix="/api/pharmacies", tags=["pharmacies"])


@router.get("")
async def list_pharmacies(
    q:    Optional[str]   = Query(None),
    sort: str             = Query("distance"),
    lat:  Optional[float] = Query(None),
    lng:  Optional[float] = Query(None),
):
    data = await query({"pharmacies": {}})
    pharmacies = data.get("pharmacies", [])

    if q:
        ql = q.lower()
        pharmacies = [p for p in pharmacies if ql in p.get("name", "").lower()]

    # attach distance if coords provided
    if lat and lng:
        for p in pharmacies:
            if p.get("lat") and p.get("lng"):
                p["distanceKm"] = _haversine(lat, lng, p["lat"], p["lng"])
                p["distance"] = f"{p['distanceKm']:.1f} km"

    if sort == "rating":
        pharmacies.sort(key=lambda p: p.get("rating", 0), reverse=True)
    elif sort == "distance" and lat and lng:
        pharmacies.sort(key=lambda p: p.get("distanceKm", 999))
    elif sort == "delivery":
        pharmacies.sort(key=lambda p: int(p.get("deliveryTime", "99").split("–")[0].replace("min","").strip() or 99))

    return pharmacies


@router.get("/nearby")
async def nearby_pharmacies(
    lat:    float = Query(...),
    lng:    float = Query(...),
    radius: float = Query(5.0),
):
    data = await query({"pharmacies": {}})
    return [
        p for p in data.get("pharmacies", [])
        if p.get("lat") and _haversine(lat, lng, p["lat"], p["lng"]) <= radius
    ]


@router.get("/{id}")
async def get_pharmacy(id: str):
    p = await get_one("pharmacies", id)
    if not p:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    return p


def _haversine(lat1, lng1, lat2, lng2) -> float:
    R = 6371
    dlat, dlng = math.radians(lat2-lat1), math.radians(lng2-lng1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
    return R * 2 * math.asin(math.sqrt(a))
