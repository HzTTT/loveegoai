"""
Chat schemas
"""
from pydantic import BaseModel
from typing import List, Optional


class ChatMessage(BaseModel):
    """Chat message schema"""
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    """Chat request"""
    message: str
    mode: Optional[str] = "changemind"  # changemind | meditation
    history: Optional[List[ChatMessage]] = None
    language: Optional[str] = "en"  # en | zh | ja | ko


class ChatResponse(BaseModel):
    """Chat response"""
    message: str
    mode: str
