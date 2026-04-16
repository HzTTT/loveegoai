"""
FastAPI 主应用
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
import uuid
from datetime import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from app.config import settings
from app.core.database import connect_db, close_db, get_letters_collection
from app.core.logger import logger
from app.services.rag_service import rag_service
from app.api import auth, chat, meditation, letters, waitlist

# 全局调度器
scheduler = AsyncIOScheduler()


SUPPORTED_LANGUAGES = ["en", "zh", "ja", "ko"]


async def generate_daily_letter_task():
    """定时任务：每日为所有语言生成信件"""
    today = datetime.now().strftime("%Y-%m-%d")
    logger.info(f"Scheduled task: generating daily letters for {today}")

    try:
        letters_col = get_letters_collection()
        if letters_col is None:
            logger.warning("Scheduled task skipped: database not available")
            return

        # 封面图循环
        day_of_year = datetime.now().timetuple().tm_yday
        cover_index = (day_of_year % 100) + 1
        cover_image = f"/static/letter_covers/{cover_index:03d}.png"

        for lang in SUPPORTED_LANGUAGES:
            try:
                # 检查该语言今天是否已有信件
                existing = await letters_col.find_one({"date": today, "language": lang})
                if existing:
                    logger.info(f"Daily letter already exists for {today} [{lang}], skipping")
                    continue

                # 生成信件内容
                content = await rag_service.generate_daily_letter(language=lang)

                letter_id = str(uuid.uuid4())

                # 保存到数据库
                await letters_col.insert_one({
                    "letter_id": letter_id,
                    "date": today,
                    "language": lang,
                    "cover_image": cover_image,
                    "content": content,
                    "created_at": datetime.utcnow()
                })

                logger.info(f"Daily letter generated: {today} [{lang}]")

            except Exception as e:
                logger.error(f"Failed to generate letter for {lang}: {e}")

        logger.info(f"Daily letter task completed for {today}")

    except Exception as e:
        logger.error(f"Scheduled task failed: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")

    # 连接数据库
    try:
        await connect_db()
        logger.info("MongoDB connected")
    except Exception as e:
        logger.warning(f"MongoDB connection failed: {e}")
        logger.warning("Application will continue without database")

    # 创建静态文件目录
    os.makedirs(settings.AUDIO_DIR, exist_ok=True)
    os.makedirs(settings.COVER_DIR, exist_ok=True)
    os.makedirs("logs", exist_ok=True)

    # 启动定时任务
    scheduler.add_job(
        generate_daily_letter_task,
        CronTrigger(hour=0, minute=0),  # 每天00:00执行
        id="daily_letter",
        name="Generate daily letter",
        replace_existing=True
    )
    scheduler.start()
    logger.info("Scheduler started: daily letter at 00:00")

    logger.info("Application started successfully!")

    yield

    # 关闭时执行
    logger.info("Shutting down application...")
    scheduler.shutdown(wait=False)
    logger.info("Scheduler stopped")
    await close_db()
    logger.info("Application shutdown complete!")


# 创建FastAPI应用
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Love Ego AI Backend API",
    lifespan=lifespan
)


# 全局异常处理
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {request.method} {request.url} - {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载静态文件
app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")


# ==================== 路由注册 ====================
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(meditation.router, prefix="/api/v1/meditation", tags=["Meditation"])
app.include_router(letters.router, prefix="/api/v1/letters", tags=["Letters"])
app.include_router(waitlist.router, prefix="/api/waitlist", tags=["Waitlist"])


@app.get("/")
async def root():
    """根路径"""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "message": "Welcome to Love Ego AI Backend API!"
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
