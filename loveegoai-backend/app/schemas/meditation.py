"""
Meditation schemas
"""
from pydantic import BaseModel
from typing import Optional, List


class ChatMessage(BaseModel):
    role: str
    content: str


class MeditationRequest(BaseModel):
    """Request to generate meditation audio"""
    user_input: str
    duration: int = 10  # minutes
    language: Optional[str] = "en"  # en | zh | ja | ko
    chat_history: Optional[List[ChatMessage]] = None  # 聊天上下文


class MeditationResponse(BaseModel):
    """Meditation audio response"""
    id: str
    title: str
    text: str
    audio_url: str
    duration: int
