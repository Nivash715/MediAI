from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from datetime import datetime, timezone
from ..database.instantdb import query, upsert, new_id
from ..core.dependencies import get_current_user
import os, aiofiles, uuid

router = APIRouter(prefix="/api/prescriptions", tags=["prescriptions"])
UPLOAD_DIR = "uploads/prescriptions"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("")
async def list_prescriptions(current_user: dict = Depends(get_current_user)):
    data = await query({"prescriptions": {"$": {"where": {"userId": current_user["id"]}}}})
    items = data.get("prescriptions", [])
    items.sort(key=lambda p: p.get("uploadedAt", ""), reverse=True)
    return items


@router.post("", status_code=201)
async def upload_prescription(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    allowed = {"image/jpeg", "image/png", "application/pdf"}
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, or PDF allowed")

    filename = f"{uuid.uuid4()}{os.path.splitext(file.filename)[1]}"
    path = os.path.join(UPLOAD_DIR, filename)
    async with aiofiles.open(path, "wb") as f:
        await f.write(await file.read())

    pid = new_id()
    await upsert("prescriptions", {
        "userId":     current_user["id"],
        "fileUrl":    f"/uploads/prescriptions/{filename}",
        "fileName":   file.filename,
        "status":     "pending",
        "uploadedAt": datetime.now(timezone.utc).isoformat(),
    }, entity_id=pid)
    return {"id": pid, "fileName": file.filename, "status": "pending"}
