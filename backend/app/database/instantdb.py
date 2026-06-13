"""
PyInstantDB — Pure Python InstantDB-compatible database for MediAI.

Stores data as JSON on disk (mediai_data.json) so it persists across restarts.
Falls back to the real InstantDB HTTP API when credentials are configured.

Public API:
    new_id()                              → str
    await upsert(ns, attrs, id?)          → str
    await get_one(ns, id)                 → dict | None
    await get_where(ns, {field: value})   → list[dict]
    await delete(ns, id)                  → None
    await transact(steps)                 → dict
    await query(q)                        → dict
    db_mode()                             → str
"""

import uuid, json, asyncio, logging, httpx, threading
from pathlib import Path
from ..core.config import settings

logger = logging.getLogger("mediai.db")

# ─────────────────────────────────────────────────────────────────────────────
#  PyInstantDB  —  in-process, JSON-backed, thread-safe
# ─────────────────────────────────────────────────────────────────────────────

_DATA_FILE = Path(__file__).parent.parent.parent / "mediai_data.json"
_lock = threading.Lock()

# In-memory store: { namespace: { id: { ...attrs } } }
_store: dict[str, dict[str, dict]] = {}


def _load() -> None:
    """Load persisted data from disk into _store."""
    global _store
    if _DATA_FILE.exists():
        try:
            with open(_DATA_FILE, "r", encoding="utf-8") as f:
                _store = json.load(f)
            logger.info(f"PyInstantDB: loaded {_DATA_FILE}")
        except Exception as e:
            logger.warning(f"PyInstantDB: could not load data file — {e}")
            _store = {}
    else:
        _store = {}


def _save() -> None:
    """Persist _store to disk."""
    try:
        with open(_DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(_store, f, ensure_ascii=False, indent=2)
    except Exception as e:
        logger.error(f"PyInstantDB: save failed — {e}")


# Boot-time load
_load()


class PyInstantDB:
    """Synchronous core — all methods run inside a thread executor."""

    @staticmethod
    def apply_steps(steps: list) -> None:
        with _lock:
            for step in steps:
                op = step[0]
                if op in ("update", "merge"):
                    ns, eid, attrs = step[1], step[2], dict(step[3])
                    if ns not in _store:
                        _store[ns] = {}
                    existing = dict(_store[ns].get(eid, {}))
                    existing.update(attrs)
                    existing["id"] = eid
                    _store[ns][eid] = existing
                elif op == "delete":
                    ns, eid = step[1], step[2]
                    if ns in _store:
                        _store[ns].pop(eid, None)
            _save()

    @staticmethod
    def fetch_all(namespace: str) -> list[dict]:
        with _lock:
            return list(_store.get(namespace, {}).values())

    @staticmethod
    def fetch_where(namespace: str, where: dict) -> list[dict]:
        with _lock:
            return [
                e for e in _store.get(namespace, {}).values()
                if all(e.get(k) == v for k, v in where.items())
            ]

    @staticmethod
    def fetch_one(namespace: str, eid: str) -> dict | None:
        with _lock:
            return _store.get(namespace, {}).get(eid)


_pydb = PyInstantDB()


def _run(fn, *args):
    """Run a sync function in the thread pool without blocking the event loop."""
    loop = asyncio.get_event_loop()
    return loop.run_in_executor(None, fn, *args)


# ─────────────────────────────────────────────────────────────────────────────
#  Remote InstantDB HTTP API  (used only when real credentials exist)
# ─────────────────────────────────────────────────────────────────────────────

_REMOTE = "https://api.instantdb.com"


def _is_placeholder(v: str) -> bool:
    return not v or "your-" in v


def use_remote() -> bool:
    return (
        not _is_placeholder(settings.INSTANTDB_APP_ID)
        and not _is_placeholder(settings.INSTANTDB_ADMIN_TOKEN)
    )


def _http() -> httpx.AsyncClient:
    return httpx.AsyncClient(timeout=15, trust_env=False)


def _rh() -> dict:
    return {"Authorization": f"Bearer {settings.INSTANTDB_ADMIN_TOKEN}",
            "Content-Type": "application/json"}


def _rb(payload: dict) -> dict:
    return {"app_id": settings.INSTANTDB_APP_ID, **payload}


# ─────────────────────────────────────────────────────────────────────────────
#  Public async API
# ─────────────────────────────────────────────────────────────────────────────

def new_id() -> str:
    return str(uuid.uuid4())


def db_mode() -> str:
    if use_remote():
        return f"InstantDB (app_id={settings.INSTANTDB_APP_ID[:8]}…)"
    return f"PyInstantDB  →  {_DATA_FILE}"


async def transact(steps: list) -> dict:
    if use_remote():
        async with _http() as c:
            r = await c.post(f"{_REMOTE}/admin/transact", headers=_rh(), json=_rb({"steps": steps}))
            r.raise_for_status()
            return r.json()
    await _run(_pydb.apply_steps, steps)
    return {"status": "ok"}


async def query(q: dict) -> dict:
    if use_remote():
        async with _http() as c:
            r = await c.post(f"{_REMOTE}/admin/query", headers=_rh(), json=_rb({"query": q}))
            r.raise_for_status()
            return r.json().get("data", {})
    result = {}
    for ns in q:
        result[ns] = await _run(_pydb.fetch_all, ns)
    return result


async def get_one(namespace: str, entity_id: str) -> dict | None:
    if use_remote():
        data = await query({namespace: {"$": {"where": {"id": entity_id}}}})
        items = data.get(namespace, [])
        return items[0] if items else None
    return await _run(_pydb.fetch_one, namespace, entity_id)


async def get_where(namespace: str, where: dict) -> list[dict]:
    if use_remote():
        data = await query({namespace: {"$": {"where": where}}})
        return data.get(namespace, [])
    return await _run(_pydb.fetch_where, namespace, where)


async def upsert(namespace: str, attrs: dict, entity_id: str | None = None) -> str:
    eid = entity_id or new_id()
    await transact([["update", namespace, eid, attrs]])
    return eid


async def delete(namespace: str, entity_id: str) -> None:
    await transact([["delete", namespace, entity_id]])
