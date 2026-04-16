"""
简化TTS停顿功能测试
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.tts_service import tts_service


async def test_pause():
    """测试停顿功能"""
    print("=" * 80)
    print("TTS 停顿功能测试")
    print("=" * 80)

    # 测试文本 (包含停顿标记)
    test_script = """
Hello，大家好，我是梦琪。[停顿2秒]
今天我们来练习边界冥想。[停顿1秒]
闭上你的眼睛，[停顿2秒]
深呼吸三次。[停顿3秒]
很好，现在让我们开始。
    """

    print("\n测试文本:")
    print(test_script)
    print("\n开始生成音频...\n")

    try:
        result = await tts_service.generate_meditation_audio(
            script=test_script,
            title="边界冥想测试"
        )

        print("\n生成成功!")
        print(f"文件名: {result['filename']}")
        print(f"URL: {result['audio_url']}")
        print("\n请播放音频文件验证停顿效果")
        print(f"文件路径: ./static/audios/{result['filename']}")

    except Exception as e:
        print(f"\n生成失败: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_pause())
