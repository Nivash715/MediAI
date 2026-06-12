from fastapi import APIRouter, HTTPException
from ..database.instantdb import get_where

router = APIRouter(prefix="/api/instantdb", tags=["instantdb"])


@router.get("/ping")
async def instantdb_ping():
    """Quick check that the InstantDB Admin API is reachable and returns data."""
    try:
        # Try a lightweight query against the `users` namespace (may be empty).
        items = await get_where("users", {})
        return {"ok": True, "users_count": len(items)}
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"InstantDB unavailable: {exc}")



@router.post("/query")
async def instantdb_query(payload: dict):
    """Proxy an InstaQL query from the frontend to the InstantDB Admin API.

    Body: { "query": { ... } }
    Returns: { data }
    """
    q = payload.get("query")
    if q is None:
        raise HTTPException(status_code=400, detail="Missing 'query' in body")
    try:
        data = await __import__("..database.instantdb", fromlist=["query"]).query(q)
        return {"data": data}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"InstantDB query error: {exc}")


@router.post("/transact")
async def instantdb_transact(payload: dict):
    """Proxy transaction steps to InstantDB Admin API.

    Body: { "steps": [ [...], ... ] }
    Returns: InstantDB transact response
    """
    steps = payload.get("steps")
    if not isinstance(steps, list):
        raise HTTPException(status_code=400, detail="Missing or invalid 'steps' list in body")
    try:
        resp = await __import__("..database.instantdb", fromlist=["transact"]).transact(steps)
        return resp
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"InstantDB transact error: {exc}")
