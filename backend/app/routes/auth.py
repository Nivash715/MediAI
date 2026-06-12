from fastapi import APIRouter, HTTPException, status, Depends
from ..database.instantdb import get_where, upsert, new_id
from ..schemas.auth import (
    RegisterRequest, LoginRequest, OtpSendRequest, OtpVerifyRequest,
    AuthResponse, TokenResponse, UserResponse,
)
from ..core.security import hash_password, verify_password, create_access_token, create_refresh_token
from ..core.dependencies import get_current_user
from datetime import datetime, timezone
import random, string

router = APIRouter(prefix="/api/auth", tags=["auth"])

# In-memory OTP store (use Redis in production)
_otp_store: dict = {}


@router.post("/register", response_model=AuthResponse, status_code=201)
async def register(req: RegisterRequest):
    existing = await get_where("users", {"email": req.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    uid = new_id()
    await upsert("users", {
        "name": req.name,
        "email": req.email,
        "mobile": req.mobile,
        "password": hash_password(req.password),
        "role": "user",
        "isActive": True,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }, entity_id=uid)
    user = {"id": uid, "name": req.name, "email": req.email, "mobile": req.mobile, "role": "user"}
    return _build_auth_response(user)


@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest):
    users = await get_where("users", {"email": req.email})
    if not users:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = users[0]
    if not verify_password(req.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return _build_auth_response(user)


@router.post("/otp/send")
async def send_otp(req: OtpSendRequest):
    otp = "".join(random.choices(string.digits, k=6))
    _otp_store[req.mobile] = otp
    # TODO: send via SMS (MSG91 / Twilio)
    return {"message": "OTP sent", "debug_otp": otp}


@router.post("/otp/verify", response_model=AuthResponse)
async def verify_otp(req: OtpVerifyRequest):
    if _otp_store.get(req.mobile) != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    _otp_store.pop(req.mobile, None)
    users = await get_where("users", {"mobile": req.mobile})
    if users:
        user = users[0]
    else:
        uid = new_id()
        await upsert("users", {
            "name": "User",
            "email": f"{req.mobile}@mediai.app",
            "mobile": req.mobile,
            "role": "user",
            "isActive": True,
            "createdAt": datetime.now(timezone.utc).isoformat(),
        }, entity_id=uid)
        user = {"id": uid, "name": "User", "email": f"{req.mobile}@mediai.app", "mobile": req.mobile, "role": "user"}
    return _build_auth_response(user)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.patch("/me")
async def update_me(data: dict, current_user: dict = Depends(get_current_user)):
    safe = {k: v for k, v in data.items() if k not in ("id", "password", "role")}
    await upsert("users", safe, entity_id=current_user["id"])
    return {**current_user, **safe}


def _build_auth_response(user: dict) -> AuthResponse:
    return AuthResponse(
        user=UserResponse(**{k: user.get(k) for k in ["id","name","email","mobile","role","avatarUrl"] if k in user or k == "role"}),
        token=TokenResponse(
            access_token=create_access_token(user["id"]),
            refresh_token=create_refresh_token(user["id"]),
        ),
    )
