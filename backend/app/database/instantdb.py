"""
InstantDB Admin HTTP client for MediAI backend.

Docs: https://www.instantdb.com/docs/backend
All reads  → POST /admin/query
All writes → POST /admin/transact
"""
import uuid
import httpx
from typing import Any
from ..core.config import settings

_BASE = "https://api.instantdb.com"


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {settings.INSTANTDB_ADMIN_TOKEN}",
        "Content-Type": "application/json",
    }


def _body(payload: dict) -> dict:
    return {"app_id": settings.INSTANTDB_APP_ID, **payload}


# ── Query ────────────────────────────────────────────────────────────────────

async def query(q: dict) -> dict:
    """Run an InstaQL read query. Returns the `data` dict."""
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(f"{_BASE}/admin/query", headers=_headers(), json=_body({"query": q}))
        r.raise_for_status()
        return r.json().get("data", {})


# ── Transact ─────────────────────────────────────────────────────────────────

async def transact(steps: list[list]) -> dict:
    """
    Run InstaDB write steps.
    Each step is one of:
      ["update", namespace, id, {attrs}]
      ["merge",  namespace, id, {attrs}]   ← deep-merge (won't clear missing keys)
      ["delete", namespace, id]
      ["link",   namespace, id, {refNs: [refId, ...]}]
      ["unlink", namespace, id, {refNs: [refId, ...]}]
    """
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(f"{_BASE}/admin/transact", headers=_headers(), json=_body({"steps": steps}))
        r.raise_for_status()
        return r.json()


# ── Helpers ───────────────────────────────────────────────────────────────────

def new_id() -> str:
    """Generate a fresh UUID string for use as an InstantDB entity id."""
    return str(uuid.uuid4())


async def get_one(namespace: str, entity_id: str) -> dict | None:
    """Fetch a single entity by id. Returns the entity dict or None."""
    data = await query({namespace: {"$": {"where": {"id": entity_id}}}})
    items = data.get(namespace, [])
    return items[0] if items else None


async def get_where(namespace: str, where: dict) -> list[dict]:
    """Fetch entities matching a where clause."""
    data = await query({namespace: {"$": {"where": where}}})
    return data.get(namespace, [])


async def upsert(namespace: str, attrs: dict, entity_id: str | None = None) -> str:
    """
    Create or update an entity. If entity_id is None a new one is generated.
    Returns the entity id.
    """
    eid = entity_id or new_id()
    await transact([["update", namespace, eid, attrs]])
    return eid


async def delete(namespace: str, entity_id: str) -> None:
    await transact([["delete", namespace, entity_id]])
