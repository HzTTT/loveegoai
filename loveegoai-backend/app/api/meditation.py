"""
Meditation API routes
"""
from fastapi import APIRouter, HTTPException
import uuid
from app.schemas.meditation import MeditationRequest, MeditationResponse
from app.services.rag_service import rag_service
from app.services.tts_service_minimax import minimax_tts_service as tts_service
from app.core.logger import logger

router = APIRouter()


@router.post("/generate", response_model=MeditationResponse)
async def generate_meditation(request: MeditationRequest):
    """
    Generate meditation audio

    1. Generate meditation script using RAG
    2. Convert text to speech using TTS
    3. Return audio URL
    """
    try:
        logger.info(f"Generating meditation: duration={request.duration}min")

        # 1. Generate meditation script with RAG + chat context
        chat_history = None
        if request.chat_history:
            chat_history = [{"role": msg.role, "content": msg.content} for msg in request.chat_history]

        script = await rag_service.generate_meditation_script(
            user_need=request.user_input,
            duration=request.duration,
            language=request.language,
            chat_history=chat_history
        )
        logger.info(f"Script generated: {len(script)} chars, language={request.language}")

        # 2. Generate audio
        audio_info = await tts_service.generate_meditation_audio(
            script=script,
            title=f"Meditation_{request.duration}min",
            language=request.language
        )
        logger.info(f"Audio generated: {audio_info['audio_url']}")

        # 3. Return response
        meditation_id = str(uuid.uuid4())

        return MeditationResponse(
            id=meditation_id,
            title=f"{request.duration}min Meditation",
            text=script,
            audio_url=audio_info["audio_url"],
            duration=request.duration
        )

    except Exception as e:
        logger.error(f"Meditation generation error: {e}")
        raise HTTPException(status_code=500, detail="Meditation generation failed")


@router.get("/test")
async def test_meditation():
    """Test meditation endpoint"""
    return {
        "status": "ok",
        "message": "Meditation API is working",
        "tts_voice": "zh-CN-XiaoxiaoNeural"
    }
