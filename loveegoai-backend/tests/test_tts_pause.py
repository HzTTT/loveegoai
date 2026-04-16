"""
测试TTS停顿功能
"""
import asyncio
import sys
import os

# 添加项目路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.tts_service import TTSService


async def test_pause():
    """测试停顿功能"""
    tts = TTSService()

    # 测试文本 (包含停顿标记)
    test_script = """
    Hello，大家好，我是梦琪。[停顿2秒]
    今天我们来练习边界冥想。[停顿1秒]
    闭上你的眼睛，[停顿2秒]
    深呼吸三次。[停顿3秒]
    很好，现在让我们开始。
    """

    print("🎤 开始生成带停顿的冥想音频...")
    print(f"📝 测试文本:\n{test_script}\n")

    result = await tts.generate_meditation_audio(
        script=test_script,
        title="边界冥想测试"
    )

    print(f"\n✅ 生成成功!")
    print(f"📄 文件名: {result['filename']}")
    print(f"🔗 URL: {result['audio_url']}")
    print(f"\n💡 请播放音频文件验证停顿效果")


async def test_simple():
    """测试普通语音 (无停顿)"""
    tts = TTSService()

    test_text = "这是一段普通的语音，不包含停顿标记。"

    print("\n🎤 开始生成普通音频...")
    print(f"📝 测试文本: {test_text}\n")

    audio_url = await tts.text_to_speech(
        text=test_text,
        filename="test_simple.mp3",
        support_pause=False
    )

    print(f"\n✅ 生成成功!")
    print(f"🔗 URL: {audio_url}")


if __name__ == "__main__":
    print("=" * 60)
    print("TTS 停顿功能测试")
    print("=" * 60)

    # 测试1: 带停顿的冥想音频
    asyncio.run(test_pause())

    # 测试2: 普通语音
    asyncio.run(test_simple())

    print("\n" + "=" * 60)
    print("测试完成! 请播放生成的音频文件验证效果。")
    print("=" * 60)
