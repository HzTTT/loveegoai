"""
用户画像服务：从对话中提取用户关键信息，存入 MongoDB
"""
from typing import Optional, List, Dict
from datetime import datetime
from app.core.database import get_user_profiles_collection
from app.services.llm_service import llm_service


class ProfileService:
    """用户画像提取与管理"""

    EXTRACT_PROMPT = """根据以下对话内容，提取并更新用户画像。直接输出JSON，不要其他文字。

格式：
{
  "emotional_state": "当前情绪状态（一句话）",
  "recent_concerns": ["最近关注的问题1", "问题2"],
  "progress": "心理状态变化/进展（一句话）",
  "preferences": "用户偏好（如喜欢冥想、喜欢被鼓励等）"
}

对话内容：
"""

    def __init__(self):
        self.llm = llm_service

    async def get_profile(self, user_id: str) -> Optional[str]:
        """
        获取用户画像文本（用于注入 system prompt）

        Returns:
            画像摘要文本，不存在则返回 None
        """
        collection = get_user_profiles_collection()
        doc = await collection.find_one({"user_id": user_id})

        if not doc:
            return None

        # 组装成自然语言摘要
        parts = []
        if doc.get("emotional_state"):
            parts.append(f"情绪状态: {doc['emotional_state']}")
        if doc.get("recent_concerns"):
            parts.append(f"关注问题: {', '.join(doc['recent_concerns'])}")
        if doc.get("progress"):
            parts.append(f"进展: {doc['progress']}")
        if doc.get("preferences"):
            parts.append(f"偏好: {doc['preferences']}")

        return "\n".join(parts) if parts else None

    async def extract_and_save(
        self,
        user_id: str,
        chat_history: List[Dict[str, str]]
    ):
        """
        从对话中提取画像并保存（后台调用，用户无感知）

        Args:
            user_id: 用户ID
            chat_history: 本次对话历史
        """
        if not chat_history or len(chat_history) < 2:
            return

        # 构建对话文本
        conversation = ""
        for msg in chat_history[-8:]:  # 取最近8条
            role = "用户" if msg["role"] == "user" else "AI"
            conversation += f"{role}: {msg['content']}\n"

        # 获取已有画像作为参考
        collection = get_user_profiles_collection()
        existing = await collection.find_one({"user_id": user_id})

        prompt = self.EXTRACT_PROMPT + conversation
        if existing:
            prompt += f"\n\n已有画像（请在此基础上更新）:\n"
            prompt += f"情绪: {existing.get('emotional_state', '未知')}\n"
            prompt += f"关注: {existing.get('recent_concerns', [])}\n"
            prompt += f"进展: {existing.get('progress', '未知')}\n"

        try:
            # 用 turbo 模型提取（快且便宜）
            messages = [
                {"role": "system", "content": "你是一个用户画像提取助手。只输出JSON，不要其他文字。"},
                {"role": "user", "content": prompt}
            ]

            response = await self.llm.chat(messages, temperature=0.3, max_tokens=300)

            # 解析 JSON
            import json
            # 清理可能的 markdown 代码块标记
            clean = response.strip()
            if clean.startswith("```"):
                clean = clean.split("\n", 1)[1] if "\n" in clean else clean
                clean = clean.rsplit("```", 1)[0]
            profile_data = json.loads(clean.strip())

            # 写入 MongoDB（upsert）
            await collection.update_one(
                {"user_id": user_id},
                {"$set": {
                    "user_id": user_id,
                    "emotional_state": profile_data.get("emotional_state", ""),
                    "recent_concerns": profile_data.get("recent_concerns", []),
                    "progress": profile_data.get("progress", ""),
                    "preferences": profile_data.get("preferences", ""),
                    "updated_at": datetime.utcnow()
                }},
                upsert=True
            )
            print(f"[OK] User profile updated: {user_id}")

        except Exception as e:
            # 画像提取失败不影响主流程
            print(f"[WARN] Profile extraction failed: {e}")


# 全局实例
profile_service = ProfileService()
