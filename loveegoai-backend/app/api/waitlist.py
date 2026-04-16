"""
候补名单 API
收集对落地页感兴趣但还未注册的用户邮箱
用于正式开放前的定向通知
"""
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from app.core.database import get_database

router = APIRouter()


class WaitlistEntry(BaseModel):
    email: EmailStr


class WaitlistResponse(BaseModel):
    success: bool
    message: str


@router.post("", response_model=WaitlistResponse)
async def join_waitlist(entry: WaitlistEntry):
    """加入候补名单"""
    db = get_database()
    if db is None:
        # 数据库不可用时静默成功，不阻断用户体验
        return WaitlistResponse(success=True, message="已加入候补名单")

    waitlist = db["waitlist"]

    # 重复提交不报错，直接返回成功
    existing = await waitlist.find_one({"email": entry.email})
    if existing:
        return WaitlistResponse(success=True, message="已在候补名单中")

    await waitlist.insert_one({
        "email": entry.email,
        "created_at": datetime.utcnow(),
        "source": "landing_page",
    })

    return WaitlistResponse(success=True, message="已加入候补名单")


@router.get("/count")
async def get_waitlist_count():
    """查看候补名单数量（内部用）"""
    db = get_database()
    if db is None:
        return {"count": 0}
    waitlist = db["waitlist"]
    count = await waitlist.count_documents({})
    return {"count": count}
