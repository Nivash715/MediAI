from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class RegisterRequest(BaseModel):
    name:     str   = Field(min_length=2, max_length=100)
    email:    EmailStr
    mobile:   str   = Field(pattern=r"^[6-9]\d{9}$")
    password: str   = Field(min_length=8)


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class OtpSendRequest(BaseModel):
    mobile: str = Field(pattern=r"^[6-9]\d{9}$")


class OtpVerifyRequest(BaseModel):
    mobile: str
    otp:    str = Field(min_length=6, max_length=6)


class TokenResponse(BaseModel):
    access_token:  str
    refresh_token: str
    token_type:    str = "bearer"


class UserResponse(BaseModel):
    id:        str
    name:      str
    email:     str
    mobile:    Optional[str] = None
    role:      str = "user"
    avatarUrl: Optional[str] = None  # camelCase to match frontend

    class Config:
        populate_by_name = True


class AuthResponse(BaseModel):
    user:  UserResponse
    token: TokenResponse
