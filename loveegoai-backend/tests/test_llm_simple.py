"""
简化测试: 验证 LLM 是否能生成停顿标记
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.llm_service import llm_service


async def test_without_examples():
    """测试1: 不提供示例，看LLM是否理解prompt"""
    print("=" * 80)
    print("测试1: LLM 能否理解 prompt 并生成停顿标记？")
    print("=" * 80)

    user_need = "帮我生成一个2分钟的放松冥想"

    print(f"\n用户需求: {user_need}")
    print(f"时长: 2分钟\n")
    print("调用 LLM...\n")

    script = await llm_service.generate_meditation_script(
        user_need=user_need,
        duration=2,
        context_docs=None  # 不提供示例
    )

    print("-" * 80)
    print("生成的脚本:")
    print("-" * 80)
    print(script)
    print("-" * 80)

    # 分析结果
    pause_marks = script.count("[停顿")
    has_brackets = "[停顿" in script
    has_dots = "..." in script or "。。。" in script

    print(f"\n分析结果:")
    print(f"  停顿标记数量: {pause_marks}")
    print(f"  是否包含 [停顿X秒]: {'是' if has_brackets else '否'}")
    print(f"  是否使用了 ... : {'是(错误)' if has_dots else '否'}")

    if pause_marks > 5:
        print("\n测试通过! LLM 理解了停顿标记格式")
        return True
    elif pause_marks > 0:
        print("\n部分成功: LLM 生成了一些停顿标记，但数量偏少")
        return False
    else:
        print("\n测试失败! LLM 没有生成停顿标记")
        print("   可能的原因:")
        print("   1. 通义千问不理解这个格式")
        print("   2. Prompt 需要调整")
        print("   3. 需要提供示例引导")
        return False


async def test_with_examples():
    """测试2: 提供明确示例，强化学习"""
    print("\n\n" + "=" * 80)
    print("测试2: 提供示例后，LLM 是否能模仿？")
    print("=" * 80)

    # 提供带停顿标记的示例
    examples = [
        """
示例冥想脚本:
Hello，大家好，我是梦琪。[停顿2秒]
今天我们来练习呼吸冥想。[停顿1秒]
请找一个舒适的姿势坐下。[停顿2秒]
轻轻闭上你的双眼。[停顿2秒]
深深地吸气，[停顿1秒]慢慢地呼气。[停顿3秒]
再次吸气，[停顿1秒]呼气。[停顿3秒]
感受你的呼吸。[停顿2秒]
很好。[停顿1秒]
        """
    ]

    user_need = "帮我生成一个2分钟的身体扫描冥想"

    print(f"\n用户需求: {user_need}")
    print(f"提供了 {len(examples)} 个示例\n")
    print("调用 LLM...\n")

    script = await llm_service.generate_meditation_script(
        user_need=user_need,
        duration=2,
        context_docs=examples  # 提供示例
    )

    print("-" * 80)
    print("生成的脚本:")
    print("-" * 80)
    print(script)
    print("-" * 80)

    # 分析结果
    pause_marks = script.count("[停顿")

    print(f"\n分析结果:")
    print(f"  停顿标记数量: {pause_marks}")

    if pause_marks > 5:
        print("\n测试通过! 提供示例后，LLM 能够模仿生成停顿标记")
        return True
    else:
        print("\n测试失败! 即使提供示例，LLM 仍然不能正确生成停顿标记")
        return False


async def main():
    print("\n")
    print("=" * 80)
    print("    LLM 停顿标记生成能力测试")
    print("=" * 80)

    try:
        # 测试1: 不提供示例
        result1 = await test_without_examples()

        # 测试2: 提供示例
        result2 = await test_with_examples()

        # 总结
        print("\n\n" + "=" * 80)
        print("测试总结")
        print("=" * 80)

        if result1:
            print("好消息! LLM 能够直接理解并生成停顿标记")
            print("   -> 方案可行，继续优化知识库即可")
        elif result2:
            print("LLM 需要示例才能生成停顿标记")
            print("   -> 必须优化冥想知识库，添加停顿标记")
            print("   -> 必须导入 Pinecone，让 RAG 能检索到示例")
        else:
            print("问题严重! LLM 无法生成停顿标记")
            print("\n备选方案:")
            print("   方案A: 调整 prompt，更加明确和强制")
            print("   方案B: 后处理 - 用规则自动在合适位置插入停顿标记")
            print("   方案C: 使用其他 LLM (GPT-4, Claude 等)")

    except Exception as e:
        print(f"\n测试出错: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
