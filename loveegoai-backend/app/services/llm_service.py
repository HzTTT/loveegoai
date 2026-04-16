"""
LLM服务: 通义千问集成
"""
from openai import AsyncOpenAI
from typing import List, Dict, Optional
from app.config import settings


class LLMService:
    """通义千问LLM服务"""

    # 聊天用 turbo（快），冥想/信件用 plus（质量高）
    CHAT_MODEL = "qwen-turbo"

    def __init__(self):
        # 通义千问兼容OpenAI API格式
        self.client = AsyncOpenAI(
            api_key=settings.QWEN_API_KEY,
            base_url=settings.QWEN_BASE_URL
        )
        self.model = settings.QWEN_MODEL  # qwen-plus（默认）

    async def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> str:
        """
        聊天对话

        Args:
            messages: 消息列表 [{"role": "user", "content": "..."}]
            temperature: 温度参数 (0-1)
            max_tokens: 最大token数

        Returns:
            AI回复内容
        """
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"❌ LLM调用失败: {e}")
            raise

    async def chat_stream(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 500,
        use_turbo: bool = False
    ):
        """
        流式聊天对话

        Args:
            use_turbo: True 用 qwen-turbo（快），False 用 qwen-plus（质量高）

        Yields:
            逐个token的文本片段
        """
        try:
            model = self.CHAT_MODEL if use_turbo else self.model
            response = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True
            )

            async for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            print(f"❌ LLM流式调用失败: {e}")
            raise

    async def chat_with_context(
        self,
        user_message: str,
        system_prompt: Optional[str] = None,
        context_docs: Optional[List[str]] = None,
        history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """
        带上下文的对话 (用于RAG)

        Args:
            user_message: 用户消息
            system_prompt: 系统提示词
            context_docs: 检索到的相关文档
            history: 历史对话

        Returns:
            AI回复
        """
        messages = []

        # 1. 系统提示词
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        else:
            messages.append({
                "role": "system",
                "content": "你是Love Ego AI,来自自然星球的心理健康助手。你温柔、有同理心,善于倾听和给予支持。"
            })

        # 2. 注入检索到的知识库内容
        if context_docs:
            context_text = "\n\n".join(context_docs)
            messages.append({
                "role": "system",
                "content": f"参考以下专业知识回答用户问题:\n\n{context_text}"
            })

        # 3. 历史对话
        if history:
            messages.extend(history)

        # 4. 当前用户消息
        messages.append({"role": "user", "content": user_message})

        return await self.chat(messages)

    # 各语言的冥想提示词模板
    MEDITATION_PROMPTS = {
        "en": {
            "system": """You are Love Ego AI, a professional meditation guide from the Natural Planet. Generate a {duration}-minute meditation script based on the user's needs.

Script structure:
1. Opening (1-2 min): Welcome + guide relaxation posture + close eyes
2. Breathing guide (2-3 min): 3-5 deep breaths
3. Theme meditation ({theme_duration} min): Expand based on user needs
4. Return to present (1-2 min): Awaken body + open eyes

Language requirements:
- Gentle, soothing, full of care
- Use second person "you"
- Concise and clear, keep each sentence short
- Use punctuation (periods, commas) to control speech rhythm
- About {word_count} words

Example format:
"Hello everyone, I am Love Ego AI.
Today we will practice a relaxation meditation.
Please find a comfortable position to sit or lie down.
Close your eyes.
Take a deep breath in, slowly breathe out.
Good, now let us begin."

You MUST write the entire script in English.""",
            "context": "Use the following meditation examples as style reference:\n\n",
        },
        "zh": {
            "system": """你是 Love Ego AI，一位来自 Natural 星球的专业冥想引导师。根据用户需求,生成一段{duration}分钟的冥想引导脚本。

脚本结构:
1. 开场(1-2分钟): 欢迎 + 引导放松姿势 + 闭眼
2. 呼吸引导(2-3分钟): 深呼吸3-5次
3. 主题冥想({theme_duration}分钟): 根据用户需求展开引导
4. 回归当下(1-2分钟): 唤醒身体 + 睁眼

语言要求:
- 温柔、舒缓、充满关怀
- 使用第二人称"你"
- 简洁明了，每句话不超过20字
- 合理使用标点符号(句号、逗号)控制语音节奏
- 约{word_count}字左右

示例格式:
"Hello，大家好，我是 Love Ego AI。
今天我们来练习边界冥想。
请找一个舒适的姿势坐下或躺下。
闭上你的眼睛。
深深地吸气，慢慢地呼气。
很好，现在让我们开始。"

你必须用中文写整个脚本。""",
            "context": "参考以下冥想引导示例的风格:\n\n",
        },
        "ja": {
            "system": """あなたはLove Ego AI、Natural Planetから来た専門の瞑想ガイドです。ユーザーのニーズに基づいて、{duration}分間の瞑想ガイドスクリプトを生成してください。

スクリプト構成:
1. オープニング（1〜2分）: 歓迎 + リラックスした姿勢へ誘導 + 目を閉じる
2. 呼吸ガイド（2〜3分）: 深呼吸3〜5回
3. テーマ瞑想（{theme_duration}分）: ユーザーのニーズに応じて展開
4. 現在に戻る（1〜2分）: 体を目覚めさせる + 目を開ける

言語要件:
- 優しく、穏やかで、思いやりに満ちた
- 二人称「あなた」を使用
- 簡潔で明確、各文は短く
- 句読点でスピーチのリズムを制御
- 約{word_count}文字

スクリプト全体を必ず日本語で書いてください。""",
            "context": "以下の瞑想ガイドの例をスタイル参考にしてください:\n\n",
        },
        "ko": {
            "system": """당신은 Love Ego AI, Natural Planet에서 온 전문 명상 가이드입니다. 사용자의 요구에 따라 {duration}분 명상 가이드 스크립트를 생성하세요.

스크립트 구조:
1. 오프닝 (1-2분): 환영 + 편안한 자세 유도 + 눈 감기
2. 호흡 가이드 (2-3분): 깊은 호흡 3-5회
3. 테마 명상 ({theme_duration}분): 사용자 요구에 따라 전개
4. 현재로 돌아오기 (1-2분): 몸 깨우기 + 눈 뜨기

언어 요구사항:
- 부드럽고, 차분하며, 배려가 가득한
- 2인칭 "당신"을 사용
- 간결하고 명확하게, 각 문장은 짧게
- 구두점으로 말하기 리듬을 조절
- 약 {word_count}자

반드시 전체 스크립트를 한국어로 작성하세요.""",
            "context": "다음 명상 가이드 예시를 스타일 참고로 사용하세요:\n\n",
        },
    }

    async def generate_meditation_script(
        self,
        user_need: str,
        duration: int = 10,
        context_docs: Optional[List[str]] = None,
        language: str = "en"
    ) -> str:
        """
        生成冥想引导脚本

        Args:
            user_need: 用户需求描述
            duration: 时长(分钟)
            context_docs: 冥想知识库文档(可选)
            language: 语言代码 (en/zh/ja/ko)

        Returns:
            冥想引导文字
        """
        prompt = self.MEDITATION_PROMPTS.get(language, self.MEDITATION_PROMPTS["en"])
        theme_duration = max(duration - 5, 1)
        word_count = duration * 150

        system_prompt = prompt["system"].format(
            duration=duration,
            theme_duration=theme_duration,
            word_count=word_count
        )

        messages = [
            {"role": "system", "content": system_prompt}
        ]

        # 注入冥想知识库示例 (如果提供)
        if context_docs:
            context_text = "\n\n".join(context_docs)
            messages.append({
                "role": "system",
                "content": prompt["context"] + context_text
            })

        messages.append({"role": "user", "content": user_need})

        return await self.chat(messages, temperature=0.8, max_tokens=2000)

    # 语言名称映射
    LANGUAGE_NAMES = {
        "en": "English",
        "zh": "中文",
        "ja": "日本語",
        "ko": "한국어",
    }

    # 各语言的信件提示词模板
    LETTER_PROMPTS = {
        "en": {
            "greeting": "Dear Earth Traveler",
            "system": """You are Love Ego from the Natural Planet. Write a warm letter to an Earth Traveler.

Requirements:
1. Start with "Dear Earth Traveler"
2. Warm, philosophical, and healing
3. 300-500 words
4. End with "Love Ego, FROM NATURAL PLANET"
5. Incorporate elements of nature, psychology, and mindfulness

You MUST write the entire letter in English.""",
            "context": "Use the following materials as inspiration:\n\n",
            "user": "Please write today's letter.",
        },
        "zh": {
            "greeting": "亲爱的地球旅人",
            "system": """你是来自自然星球的Love Ego。请写一封给地球旅人的温暖信件。

要求:
1. 以"亲爱的地球旅人"开头
2. 温暖、有哲理、治愈人心
3. 300-500字
4. 结尾署名"Love Ego, FROM NATURAL PLANET"
5. 融入自然、心理学、正念等元素

你必须用中文写整封信。""",
            "context": "参考以下素材:\n\n",
            "user": "请生成今天的信件。",
        },
        "ja": {
            "greeting": "親愛なる地球の旅人へ",
            "system": """あなたはNatural Planetから来たLove Egoです。地球の旅人に温かい手紙を書いてください。

要件:
1. 「親愛なる地球の旅人へ」で始める
2. 温かく、哲学的で、癒しのある内容
3. 300〜500文字
4. 最後に「Love Ego, FROM NATURAL PLANET」と署名
5. 自然、心理学、マインドフルネスの要素を取り入れる

手紙全体を必ず日本語で書いてください。""",
            "context": "以下の素材を参考にしてください:\n\n",
            "user": "今日の手紙を書いてください。",
        },
        "ko": {
            "greeting": "사랑하는 지구 여행자에게",
            "system": """당신은 Natural Planet에서 온 Love Ego입니다. 지구 여행자에게 따뜻한 편지를 써주세요.

요구사항:
1. "사랑하는 지구 여행자에게"로 시작
2. 따뜻하고, 철학적이며, 치유적인 내용
3. 300~500자
4. 마지막에 "Love Ego, FROM NATURAL PLANET"로 서명
5. 자연, 심리학, 마음챙김 요소를 포함

반드시 전체 편지를 한국어로 작성하세요.""",
            "context": "다음 자료를 참고하세요:\n\n",
            "user": "오늘의 편지를 작성해주세요.",
        },
    }

    async def generate_daily_letter(
        self,
        context_docs: Optional[List[str]] = None,
        language: str = "en"
    ) -> str:
        """
        生成每日信件

        Args:
            context_docs: 信件知识库文档
            language: 语言代码 (en/zh/ja/ko)

        Returns:
            信件内容
        """
        prompt = self.LETTER_PROMPTS.get(language, self.LETTER_PROMPTS["en"])

        messages = [{"role": "system", "content": prompt["system"]}]

        # 注入知识库内容
        if context_docs:
            context_text = "\n\n".join(context_docs)
            messages.append({
                "role": "system",
                "content": prompt["context"] + context_text
            })

        messages.append({"role": "user", "content": prompt["user"]})

        return await self.chat(messages, temperature=0.9, max_tokens=800)


# 创建全局LLM服务实例
llm_service = LLMService()
