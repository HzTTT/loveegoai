"""
Letters API routes
"""
from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
import uuid
from app.schemas.letter import LetterResponse
from app.services.rag_service import rag_service
from app.core.database import get_letters_collection
from app.core.logger import logger

router = APIRouter()


@router.get("/today", response_model=LetterResponse)
async def get_today_letter(language: str = Query(default="en", description="Language code: en/zh/ja/ko")):
    """
    Get today's letter

    Priority: database cache -> generate new
    """
    today = datetime.now().strftime("%Y-%m-%d")

    try:
        # 优先从数据库读取今天的信件
        letters = get_letters_collection()
        if letters is not None:
            cached = await letters.find_one({"date": today, "language": language})
            if cached:
                logger.info(f"Letter cache hit: {today}, language={language}")
                return LetterResponse(
                    id=cached.get("letter_id", str(uuid.uuid4())),
                    date=today,
                    cover_image=cached["cover_image"],
                    content=cached["content"]
                )

        # 没有缓存，实时生成
        logger.info(f"Generating letter for {today}, language={language}")
        content = await rag_service.generate_daily_letter(language=language)

        # 封面图循环
        day_of_year = datetime.now().timetuple().tm_yday
        cover_index = (day_of_year % 100) + 1
        cover_image = f"/static/letter_covers/{cover_index:03d}.png"

        letter_id = str(uuid.uuid4())

        # 保存到数据库
        if letters is not None:
            await letters.insert_one({
                "letter_id": letter_id,
                "date": today,
                "language": language,
                "cover_image": cover_image,
                "content": content,
                "created_at": datetime.utcnow()
            })
            logger.info(f"Letter saved to database: {today}, language={language}")

        return LetterResponse(
            id=letter_id,
            date=today,
            cover_image=cover_image,
            content=content
        )

    except Exception as e:
        logger.error(f"Letter error: {e}")
        raise HTTPException(status_code=500, detail="Letter generation failed")


@router.get("/test")
async def test_letters():
    """Test letters endpoint"""
    return {
        "status": "ok",
        "message": "Letters API is working",
        "today": datetime.now().strftime("%Y-%m-%d")
    }
