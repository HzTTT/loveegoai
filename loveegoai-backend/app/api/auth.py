"""
Authentication API routes
"""
from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import UserRegister, UserLogin, Token, UserResponse
from app.core.security import hash_password, verify_password, create_access_token
from app.core.database import get_users_collection

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(user: UserRegister):
    """Register a new user"""
    users = get_users_collection()

    # 检查数据库是否可用
    if users is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not available"
        )

    # 检查邮箱是否已注册
    existing = await users.find_one({"email": user.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # 保存用户
    user_doc = {
        "email": user.email,
        "name": user.name,
        "password": hash_password(user.password),
        "avatar": "",
        "created_at": datetime.utcnow(),
    }
    await users.insert_one(user_doc)

    return UserResponse(
        email=user.email,
        name=user.name,
        avatar=""
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """User login"""
    users = get_users_collection()

    if users is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not available"
        )

    # 查询用户
    user = await users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # 验证密码
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # 生成Token
    token = create_access_token({"sub": user["email"], "name": user["name"]})

    return Token(access_token=token)


@router.get("/test")
async def test_auth():
    """Test auth endpoint"""
    users = get_users_collection()
    db_status = "connected" if users is not None else "disconnected"

    return {
        "status": "ok",
        "message": "Auth API is working",
        "database": db_status
    }
