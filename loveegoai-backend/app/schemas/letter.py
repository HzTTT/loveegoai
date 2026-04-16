"""
Letter schemas
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class LetterResponse(BaseModel):
    """Letter response"""
    id: str
    date: str
    cover_image: str
    content: str


class LetterListResponse(BaseModel):
    """List of letters"""
    letters: list[LetterResponse]
    total: int
