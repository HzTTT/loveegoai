"""
测试完整冥想生成流程：RAG → LLM → TTS（带停顿）
"""
import asyncio
import sys
import os

# 添加项目路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.llm_service import llm_service


async def test_llm_direct():
    """测试LLM直接生成（不使用RAG，但带停顿标记）"""
    print("=" * 80)
    print("测试1: LLM 直接生成冥想脚本（带停顿标记）")
    print("=" * 80)

    user_need = "帮我生成一个关于放松焦虑的冥想引导"
    duration = 3  # 3分钟测试

    print(f"\n📝 用户需求: {user_need}")
    print(f"⏱️  时长: {duration}分钟\n")

    # 生成脚本
    script = await llm_service.generate_meditation_script(
        user_need=user_need,
        duration=duration
    )

    print(f"🎤 生成的冥想脚本:\n")
    print("-" * 80)
    print(script)
    print("-" * 80)

    # 检查是否包含停顿标记
    pause_count = script.count("[停顿")
    print(f"\n✅ 停顿标记数量: {pause_count}")

    if pause_count > 0:
        print("✅ LLM成功生成了停顿标记！")
    else:
        print("⚠️  警告: LLM未生成停顿标记，请检查prompt")

    return script


async def test_llm_with_examples():
    """测试LLM生成（带知识库示例）"""
    print("\n\n" + "=" * 80)
    print("测试2: LLM 生成冥想脚本（使用知识库示例）")
    print("=" * 80)

    user_need = "帮我生成一个关于建立边界的冥想引导"
    duration = 3

    # 模拟从知识库检索到的示例（带停顿标记）
    example_docs = [
        """
        【边界冥想示例】
        Hello，大家好，我是梦琪。[停顿2秒]
        今天我们来练习边界冥想。[停顿1秒]
        闭上你的眼睛，[停顿2秒]
        深呼吸三次。[停顿3秒]
        现在想象一个圆圈围绕着你的身体。[停顿2秒]
        这个圆圈代表你的边界。[停顿2秒]
        """,
        """
        【呼吸冥想示例】
        找一个舒适的姿势。[停顿2秒]
        轻轻闭上双眼。[停顿1秒]
        深深地吸气，[停顿1秒]慢慢地呼气。[停顿2秒]
        再次吸气，[停顿1秒]呼气。[停顿3秒]
        感受呼吸的节奏。[停顿2秒]
        """
    ]

    print(f"\n📝 用户需求: {user_need}")
    print(f"⏱️  时长: {duration}分钟")
    print(f"📚 知识库示例数量: {len(example_docs)}\n")

    # 生成脚本（带示例）
    script = await llm_service.generate_meditation_script(
        user_need=user_need,
        duration=duration,
        context_docs=example_docs
    )

    print(f"🎤 生成的冥想脚本:\n")
    print("-" * 80)
    print(script)
    print("-" * 80)

    # 检查停顿标记
    pause_count = script.count("[停顿")
    print(f"\n✅ 停顿标记数量: {pause_count}")

    if pause_count > 0:
        print("✅ LLM成功学习了示例的停顿节奏！")
    else:
        print("⚠️  警告: LLM未使用停顿标记")

    return script


async def test_tts_with_pause():
    """测试TTS停顿功能"""
    print("\n\n" + "=" * 80)
    print("测试3: TTS 停顿功能测试")
    print("=" * 80)

    try:
        from app.services.tts_service import tts_service

        # 测试脚本（包含停顿标记）
        test_script = """
        Hello，大家好，我是梦琪。[停顿2秒]
        现在让我们开始一段简短的冥想。[停顿1秒]
        闭上你的眼睛。[停顿2秒]
        深呼吸三次。[停顿3秒]
        很好，睁开眼睛。[停顿1秒]
        """

        print(f"\n📝 测试脚本:\n{test_script}")

        # 生成音频
        print("\n🎵 开始生成音频...\n")
        result = await tts_service.generate_meditation_audio(
            script=test_script,
            title="停顿测试"
        )

        print(f"\n✅ 音频生成成功!")
        print(f"📄 文件名: {result['filename']}")
        print(f"🔗 URL: {result['audio_url']}")
        print(f"\n💡 请播放音频验证停顿效果")

    except ImportError as e:
        print(f"⚠️  跳过TTS测试（依赖未安装）: {e}")
        print("   请先安装: pip install pydub")


async def main():
    """运行所有测试"""
    print("\n")
    print("🧘 " + "=" * 76 + " 🧘")
    print("    冥想生成完整流程测试: RAG → LLM → TTS（带停顿）")
    print("🧘 " + "=" * 76 + " 🧘")

    try:
        # 测试1: LLM直接生成
        script1 = await test_llm_direct()

        # 测试2: LLM + 知识库示例
        script2 = await test_llm_with_examples()

        # 测试3: TTS停顿功能（需要pydub）
        await test_tts_with_pause()

        print("\n\n" + "=" * 80)
        print("🎉 测试完成!")
        print("=" * 80)

        print("\n📊 关键检查点:")
        print("  ✓ LLM 能否生成 [停顿X秒] 标记？")
        print("  ✓ 知识库示例是否帮助改善停顿节奏？")
        print("  ✓ TTS 能否正确处理停顿标记？")

    except Exception as e:
        print(f"\n❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
