"""
Authentication schemas
"""
from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    """User registration"""
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    """User login"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """JWT Token"""
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """User response"""
    email: str
    name: str
    avatar: str = ""
