"""
应用配置管理
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """应用配置"""

    # 应用基础配置
    APP_NAME: str = "Love Ego AI Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # 安全配置
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7天

    # MongoDB配置
    MONGODB_URL: str
    MONGODB_DB_NAME: str = "loveegoai"

    # 通义千问配置
    QWEN_API_KEY: str
    QWEN_MODEL: str = "qwen-plus"
    QWEN_BASE_URL: str = "https://dashscope.aliyuncs.com/compatible-mode/v1"

    # Pinecone配置
    PINECONE_API_KEY: str
    PINECONE_ENVIRONMENT: str = "gcp-starter"
    PINECONE_INDEX_NAME: str = "loveegoai-knowledge"

    # TTS配置
    TENCENT_SECRET_ID: str
    TENCENT_SECRET_KEY: str
    TTS_VOICE: str = "101002"

    # MiniMax TTS配置
    MINIMAX_API_KEY: str
    MINIMAX_GROUP_ID: str

    # CORS配置
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175,http://127.0.0.1:5176"

    # 文件存储
    STATIC_DIR: str = "./static"
    AUDIO_DIR: str = "./static/audios"
    COVER_DIR: str = "./static/letter_covers"

    # 信件生成
    LETTER_GENERATION_TIME: str = "00:00"

    @property
    def cors_origins(self) -> List[str]:
        """解析CORS允许的源"""
        configured = [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
        local_defaults = [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:5176",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://127.0.0.1:5175",
            "http://127.0.0.1:5176",
            "http://127.0.0.1:3000",
        ]

        origins: List[str] = []
        for origin in configured + local_defaults:
            if origin not in origins:
                origins.append(origin)

        return origins

    class Config:
        env_file = ".env"
        case_sensitive = True


# 创建全局配置实例
settings = Settings()
