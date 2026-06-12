from fastapi import APIRouter, Depends
from ..database.instantdb import query
from ..core.dependencies import get_current_user

router = APIRouter(prefix="/api/health-records", tags=["health-records"])


@router.get("")
async def get_health_records(current_user: dict = Depends(get_current_user)):
    uid = current_user["id"]
    data = await query({
        "healthRecords": {"$": {"where": {"userId": uid}}},
        "healthMetrics":  {"$": {"where": {"userId": uid}}},
    })

    records = sorted(data.get("healthRecords", []), key=lambda r: r.get("recordDate", ""), reverse=True)
    raw_metrics = data.get("healthMetrics", [])

    metrics = [
        {"name": m.get("metricName"), "value": m.get("value"), "unit": m.get("unit"), "trend": m.get("trend")}
        for m in raw_metrics
    ]

    return {"timeline": records, "metrics": metrics, "aiSummary": None}
