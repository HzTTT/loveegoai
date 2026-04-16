"""
Chat API routes
"""
import asyncio
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag_service import rag_service
from app.services.profile_service import profile_service
from app.core.security import decode_access_token
from app.core.logger import logger
import json

router = APIRouter()


def _get_user_id_from_request(request: Request) -> str | None:
    """从请求头提取用户ID（不强制认证）"""
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        try:
            payload = decode_access_token(auth[7:])
            return payload.get("sub")
        except Exception:
            pass
    return None


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """
    Send a chat message and get AI response

    - **message**: User message
    - **mode**: Knowledge base mode (changemind/meditation)
    - **history**: Chat history (optional, max 10 recent messages)
    """
    try:
        # Convert history to dict format
        history = None
        if request.history:
            history = [{"role": msg.role, "content": msg.content} for msg in request.history]

        # Detect meditation intent
        mode = request.mode
        msg_lower = request.message.lower()
        meditation_keywords = [
            "meditation", "meditate",
            "冥想", "放松", "减压", "解压", "焦虑", "压力大",
            "静心", "深呼吸", "正念", "mindful", "relax", "calm",
            "anxious", "anxiety", "stress", "breathe",
        ]
        if any(kw in msg_lower for kw in meditation_keywords):
            mode = "meditation"

        logger.info(f"Chat request: mode={mode}, history_len={len(history) if history else 0}")

        # Get AI response
        response = await rag_service.chat_with_knowledge(
            user_message=request.message,
            knowledge_base=mode,
            chat_history=history,
            top_k=3,
            language=request.language
        )

        return ChatResponse(
            message=response,
            mode=mode
        )

    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="AI service temporarily unavailable")


@router.post("/message/stream")
async def send_message_stream(request: ChatRequest, raw_request: Request):
    """
    流式聊天 - SSE (Server-Sent Events)
    支持智能RAG + 用户画像 + qwen-turbo
    """
    try:
        history = None
        if request.history:
            history = [{"role": msg.role, "content": msg.content} for msg in request.history]

        mode = request.mode
        msg_lower = request.message.lower()
        meditation_keywords = [
            "meditation", "meditate",
            "冥想", "放松", "减压", "解压", "焦虑", "压力大",
            "静心", "深呼吸", "正念", "mindful", "relax", "calm",
            "anxious", "anxiety", "stress", "breathe",
        ]
        if any(kw in msg_lower for kw in meditation_keywords):
            mode = "meditation"

        # 获取用户ID和画像
        user_id = _get_user_id_from_request(raw_request)
        user_profile = None
        if user_id:
            user_profile = await profile_service.get_profile(user_id)

        logger.info(f"Stream chat request: mode={mode}, history_len={len(history) if history else 0}, has_profile={user_profile is not None}")

        async def event_generator():
            # 先发送 mode 信息
            yield f"data: {json.dumps({'type': 'mode', 'mode': mode})}\n\n"

            # 收集完整回复（用于后台画像提取）
            full_response = ""

            try:
                # 流式发送内容
                async for token in rag_service.chat_with_knowledge_stream(
                    user_message=request.message,
                    knowledge_base=mode,
                    chat_history=history,
                    language=request.language,
                    user_profile=user_profile
                ):
                    full_response += token
                    yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"
            except Exception as e:
                logger.error(f"Stream generation error: {e}")
                yield f"data: {json.dumps({'type': 'error', 'content': 'Service temporarily unavailable, please try again.'})}\n\n"

            # 发送结束标记
            yield f"data: {json.dumps({'type': 'done'})}\n\n"

            # 后台异步提取用户画像（用户无感知）
            if user_id and history and full_response:
                full_history = list(history) if history else []
                full_history.append({"role": "user", "content": request.message})
                full_history.append({"role": "assistant", "content": full_response})
                asyncio.create_task(
                    profile_service.extract_and_save(user_id, full_history)
                )

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            }
        )

    except Exception as e:
        logger.error(f"Stream chat error: {e}")
        raise HTTPException(status_code=500, detail="AI service temporarily unavailable")


@router.get("/test")
async def test_chat():
    """Test chat endpoint"""
    return {
        "status": "ok",
        "message": "Chat API is working",
        "available_modes": ["changemind", "meditation"]
    }


