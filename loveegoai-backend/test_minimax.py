"""测试 MiniMax TTS"""
import asyncio
from app.services.tts_service_minimax import minimax_tts_service

async def test():
    try:
        print("Testing MiniMax TTS...")
        result = await minimax_tts_service.text_to_speech(
            text="这是一个测试",
            filename="test.mp3",
            language="zh"
        )
        print(f"Success: {result}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
