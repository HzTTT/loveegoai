"""
RAG (Retrieval-Augmented Generation) service.
"""
from typing import Dict, List, Optional

from app.core.logger import logger
from app.services.changemind_persona_service import changemind_persona_service
from app.services.llm_service import llm_service
from app.services.skill_service import SkillPlan, skill_service
from app.services.vector_service import vector_service


class RAGService:
    """Knowledge retrieval and response generation service."""

    NAMESPACE_CHANGEMIND = "changemind"
    NAMESPACE_MEDITATION = "meditation"
    NAMESPACE_LETTERS = "letters"

    MIN_RELEVANCE_SCORE = 0.15
    SUPPLEMENTAL_DOC_LIMIT = 2

    LANGUAGE_NAMES = {
        "en": "English",
        "zh": "Chinese",
        "ja": "Japanese",
        "ko": "Korean",
    }

    DIRECT_REPLY_TRIGGERS = {
        "hi",
        "hello",
        "hey",
        "hey there",
        "good morning",
        "good afternoon",
        "good evening",
        "thanks",
        "thank you",
        "thank you so much",
        "ok",
        "okay",
    }

    def __init__(self):
        self.llm = llm_service
        self.vector = vector_service

    async def chat_with_knowledge(
        self,
        user_message: str,
        knowledge_base: str = "changemind",
        chat_history: Optional[List[dict]] = None,
        top_k: int = 3,
        language: str = "en",
    ) -> str:
        """Chat with optional retrieval augmentation."""
        if self._should_skip_retrieval(user_message, chat_history):
            logger.info(f"[RAG] Skip retrieval for low-context message: {user_message!r}")
            messages = self._build_direct_messages(user_message, knowledge_base, language)
            return await self.llm.chat(messages, temperature=0.7, max_tokens=200)

        if knowledge_base == self.NAMESPACE_CHANGEMIND:
            messages = await self._build_changemind_messages(
                user_message=user_message,
                chat_history=chat_history,
                language=language,
                top_k=top_k,
            )
            return await self.llm.chat(messages, temperature=0.7, max_tokens=1000)

        search_query = await self._build_search_query(user_message, chat_history)
        relevant_docs = await self.vector.search(
            query=search_query,
            namespace=knowledge_base,
            top_k=top_k,
        )
        context_docs = self._extract_relevant_context(relevant_docs)
        system_prompt = self._get_system_prompt(knowledge_base, language)

        return await self.llm.chat_with_context(
            user_message=user_message,
            system_prompt=system_prompt,
            context_docs=context_docs,
            history=chat_history,
        )

    async def _build_search_query(
        self,
        user_message: str,
        chat_history: Optional[List[dict]] = None,
    ) -> str:
        """Rewrite short follow-ups into a more useful retrieval query."""
        if len(user_message) > 15:
            return user_message

        if not chat_history:
            return user_message

        recent = chat_history[-4:]
        context = "\n".join(f"{message['role']}: {message['content'][:150]}" for message in recent)

        rewrite_messages = [
            {
                "role": "system",
                "content": (
                    "You rewrite short follow-up chat messages into concise retrieval queries. "
                    "Return only the query, with no explanation."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Conversation context:\n{context}\n\n"
                    f"Latest user message: {user_message}\n\n"
                    "Search query:"
                ),
            },
        ]

        try:
            query = await self.llm.chat(rewrite_messages, temperature=0, max_tokens=50)
            query = query.strip().strip('"').strip("'")
            logger.info(f"[RAG] Query rewrite: '{user_message}' -> '{query}'")
            return query
        except Exception as exc:
            logger.warning(f"[RAG] Query rewrite failed: {exc}, using original")
            return user_message

    def _normalize_message(self, message: str) -> str:
        cleaned = "".join(ch.lower() if ch.isalnum() or ch.isspace() else " " for ch in message.strip())
        return " ".join(cleaned.split())

    def _should_skip_retrieval(
        self,
        user_message: str,
        chat_history: Optional[List[dict]] = None,
    ) -> bool:
        if chat_history:
            return False

        normalized = self._normalize_message(user_message)
        if not normalized:
            return True

        return normalized in self.DIRECT_REPLY_TRIGGERS

    def _get_direct_chat_prompt(self, knowledge_base: str, language: str = "en") -> str:
        prompts = {
            "changemind": (
                "You are LoveEgo AI, a warm emotional wellness companion. "
                "The user sent a short greeting or low-context small-talk message. "
                "Reply naturally in 1 to 3 sentences. Stay grounded in the user's actual words. "
                "Do not invent hidden struggles, trauma, spiritual revelations, or long advice. "
                "A gentle invitation to share more is welcome."
            ),
            "meditation": (
                "You are LoveEgo AI, a calm meditation companion. "
                "The user sent a short greeting or low-context message. "
                "Reply naturally in 1 to 3 short sentences. "
                "Do not generate a full meditation script unless the user explicitly asks for one. "
                "Offer calm support and invite them to share what they need."
            ),
        }

        lang_name = self.LANGUAGE_NAMES.get(language, "English")
        return f"{prompts.get(knowledge_base, prompts['changemind'])}\n\nIMPORTANT: You MUST respond in {lang_name}."

    def _build_direct_messages(
        self,
        user_message: str,
        knowledge_base: str,
        language: str,
        user_profile: Optional[str] = None,
        chat_history: Optional[List[dict]] = None,
    ) -> List[dict]:
        messages = [{"role": "system", "content": self._get_direct_chat_prompt(knowledge_base, language)}]
        if knowledge_base == self.NAMESPACE_CHANGEMIND:
            messages.append({"role": "system", "content": skill_service.get_contract_prompt()})
        if user_profile:
            messages.append({"role": "system", "content": f"User profile:\n{user_profile}"})
        if chat_history:
            messages.extend(chat_history[-6:])
        messages.append({"role": "user", "content": user_message})
        return messages

    async def chat_with_knowledge_stream(
        self,
        user_message: str,
        knowledge_base: str = "changemind",
        chat_history: Optional[List[dict]] = None,
        top_k: int = 3,
        language: str = "en",
        user_profile: Optional[str] = None,
    ):
        """Stream chat with optional retrieval augmentation."""
        if self._should_skip_retrieval(user_message, chat_history):
            logger.info(f"[RAG] Stream skip retrieval for low-context message: {user_message!r}")
            messages = self._build_direct_messages(
                user_message,
                knowledge_base,
                language,
                user_profile=user_profile,
                chat_history=chat_history,
            )
            async for token in self.llm.chat_stream(messages, max_tokens=200, use_turbo=True):
                yield token
            return

        if knowledge_base == self.NAMESPACE_CHANGEMIND:
            messages = await self._build_changemind_messages(
                user_message=user_message,
                chat_history=chat_history,
                language=language,
                top_k=top_k,
                user_profile=user_profile,
            )
            async for token in self.llm.chat_stream(messages, max_tokens=1000, use_turbo=True):
                yield token
            return

        search_query = await self._build_search_query(user_message, chat_history)
        logger.info(f"[RAG] Original query: {user_message[:50]}, Enhanced query: {search_query[:80]}")

        relevant_docs = await self.vector.search(
            query=search_query,
            namespace=knowledge_base,
            top_k=top_k,
        )
        filtered_texts = self._extract_relevant_context(relevant_docs)
        logger.info(
            f"[RAG] Found {len(relevant_docs)} docs, scores={[round(doc['score'], 3) for doc in relevant_docs]}"
        )

        system_prompt = self._get_system_prompt(knowledge_base, language)
        if filtered_texts:
            context_text = "\n\n---\n\n".join(filtered_texts)
            system_prompt += (
                "\n\n=== Knowledge Base Context (use when relevant) ===\n"
                f"{context_text}\n"
                "=== End Knowledge Base Context ===\n"
            )

        if user_profile:
            system_prompt += f"\n\nUser profile:\n{user_profile}"

        messages = [{"role": "system", "content": system_prompt}]
        if chat_history:
            messages.extend(chat_history[-6:])
        messages.append({"role": "user", "content": user_message})

        logger.info(
            f"[RAG] Total messages: {len(messages)}, system_prompt_len={len(system_prompt)}, max_tokens=1000"
        )
        async for token in self.llm.chat_stream(messages, max_tokens=1000, use_turbo=True):
            yield token

    async def _build_changemind_messages(
        self,
        *,
        user_message: str,
        language: str,
        top_k: int,
        chat_history: Optional[List[dict]] = None,
        user_profile: Optional[str] = None,
    ) -> List[dict]:
        search_query = await self._build_search_query(user_message, chat_history)
        plan = skill_service.plan_response(user_message, chat_history)
        retrieved_docs = await self._retrieve_changemind_docs(
            search_query=search_query,
            plan=plan,
            top_k=top_k,
        )

        messages = [
            {"role": "system", "content": self._get_system_prompt(self.NAMESPACE_CHANGEMIND, language)},
            {"role": "system", "content": skill_service.get_contract_prompt()},
            {"role": "system", "content": skill_service.build_plan_prompt(plan)},
        ]

        if retrieved_docs:
            messages.append({"role": "system", "content": self._format_structured_context(retrieved_docs)})

        if user_profile:
            messages.append({"role": "system", "content": f"User profile:\n{user_profile}"})

        if chat_history:
            messages.extend(chat_history[-6:])
        messages.append({"role": "user", "content": user_message})

        logger.info(
            "[RAG] Changemind plan=%s heuristics=%s docs=%s",
            plan.primary_model,
            ",".join(plan.supporting_heuristics),
            len(retrieved_docs),
        )
        return messages

    async def _retrieve_changemind_docs(
        self,
        *,
        search_query: str,
        plan: SkillPlan,
        top_k: int,
    ) -> List[Dict]:
        query_embedding = await self.vector.get_embedding(search_query)
        collected: List[Dict] = []

        primary_docs = await self._search_skill_docs(
            query=search_query,
            query_embedding=query_embedding,
            section_type="model",
            top_k=1,
            model_id=plan.primary_model,
        )
        collected.extend(primary_docs[:1])

        for heuristic_id in plan.supporting_heuristics:
            heuristic_docs = await self._search_skill_docs(
                query=search_query,
                query_embedding=query_embedding,
                section_type="heuristic",
                top_k=1,
                heuristic_id=heuristic_id,
            )
            collected.extend(heuristic_docs[:1])

        if plan.need_practice:
            practice_docs = await self._search_skill_docs(
                query=search_query,
                query_embedding=query_embedding,
                section_type="practice",
                top_k=1,
            )
            collected.extend(practice_docs[:1])

        style_docs = await self._search_skill_docs(
            query=search_query,
            query_embedding=query_embedding,
            section_type="style",
            top_k=1,
        )
        collected.extend(style_docs[:1])

        supplemental_docs = await self.vector.search(
            query=search_query,
            namespace=self.NAMESPACE_CHANGEMIND,
            top_k=max(top_k * 2, 6),
            metadata_filter={
                "source": {"$eq": changemind_persona_service.RETRIEVAL_SOURCE},
            },
            query_embedding=query_embedding,
        )
        supplemental_added = 0
        for doc in supplemental_docs:
            metadata = doc.get("metadata") or {}
            if doc.get("score", 0) < self.MIN_RELEVANCE_SCORE:
                continue
            collected.append(doc)
            supplemental_added += 1
            if supplemental_added >= self.SUPPLEMENTAL_DOC_LIMIT:
                break

        return self._dedupe_docs(collected)

    async def _search_skill_docs(
        self,
        *,
        query: str,
        query_embedding: List[float],
        section_type: str,
        top_k: int = 1,
        model_id: Optional[str] = None,
        heuristic_id: Optional[str] = None,
    ) -> List[Dict]:
        metadata_filter = self._build_skill_filter(
            section_type=section_type,
            model_id=model_id,
            heuristic_id=heuristic_id,
        )
        return await self.vector.search(
            query=query,
            namespace=self.NAMESPACE_CHANGEMIND,
            top_k=top_k,
            metadata_filter=metadata_filter,
            query_embedding=query_embedding,
        )

    def _build_skill_filter(
        self,
        *,
        section_type: str,
        model_id: Optional[str] = None,
        heuristic_id: Optional[str] = None,
    ) -> Dict[str, Dict[str, str]]:
        metadata_filter: Dict[str, Dict[str, str]] = {
            "source": {"$eq": skill_service.RETRIEVAL_SOURCE},
            "section_type": {"$eq": section_type},
        }
        if model_id:
            metadata_filter["model_id"] = {"$eq": model_id}
        if heuristic_id:
            metadata_filter["heuristic_id"] = {"$eq": heuristic_id}
        return metadata_filter

    def _extract_relevant_context(self, relevant_docs: List[Dict]) -> List[str]:
        return [doc["text"] for doc in relevant_docs if doc.get("score", 0) >= self.MIN_RELEVANCE_SCORE]

    def _format_structured_context(self, docs: List[Dict]) -> str:
        formatted_sections = []
        for doc in docs:
            metadata = doc.get("metadata") or {}
            section_type = metadata.get("section_type", "reference").upper()
            title = metadata.get("title", doc.get("id", "reference"))
            text = (doc.get("text") or "").strip()
            if not text:
                continue
            formatted_sections.append(f"[{section_type}] {title}\n{text}")

        if not formatted_sections:
            return ""

        return (
            "Structured LoveEgo framework context. Use it selectively and follow the plan above.\n\n"
            + "\n\n---\n\n".join(formatted_sections)
        )

    def _dedupe_docs(self, docs: List[Dict]) -> List[Dict]:
        seen_ids = set()
        unique_docs = []
        for doc in docs:
            doc_id = doc.get("id")
            if not doc_id or doc_id in seen_ids:
                continue
            seen_ids.add(doc_id)
            unique_docs.append(doc)
        return unique_docs

    def _get_system_prompt(self, knowledge_base: str, language: str = "en") -> str:
        prompts = {
            "changemind": (
                "You are LoveEgo AI, a warm and grounded emotional support companion. "
                "Follow the supplied runtime contract and response plan. "
                "Use retrieved knowledge only when it is relevant, and stay close to the user's actual message. "
                "Do not invent personal history or hidden causes. "
                "Offer practical, compassionate guidance."
            ),
            "meditation": (
                "You are LoveEgo AI, a calm meditation guide. "
                "Help the user relax with gentle, clear, supportive guidance. "
                "Use retrieved context when it is relevant."
            ),
        }

        lang_name = self.LANGUAGE_NAMES.get(language, "English")
        return f"{prompts.get(knowledge_base, prompts['changemind'])}\n\nIMPORTANT: You MUST respond in {lang_name}."

    async def detect_meditation_intent(self, message: str) -> bool:
        meditation_keywords = [
            "meditation",
            "meditate",
            "relax",
            "calm",
            "breathe",
            "mindful",
            "anxiety",
            "stress",
            "冥想",
            "放松",
            "减压",
            "解压",
            "焦虑",
            "静心",
            "深呼吸",
            "正念",
        ]
        lowered = message.lower()
        return any(keyword in lowered for keyword in meditation_keywords)

    async def generate_daily_letter(self, language: str = "en") -> str:
        relevant_docs = await self.vector.search(
            query="warm healing letter about nature, psychology, and mindfulness",
            namespace=self.NAMESPACE_LETTERS,
            top_k=3,
        )
        context_docs = [doc["text"] for doc in relevant_docs]
        return await self.llm.generate_daily_letter(context_docs, language=language)

    async def generate_meditation_script(
        self,
        user_need: str,
        duration: int = 10,
        top_k: int = 3,
        language: str = "en",
        chat_history: Optional[List[dict]] = None,
    ) -> str:
        search_query = await self._build_search_query(user_need, chat_history)
        logger.info(f"[Meditation] Search query: '{user_need[:50]}' -> '{search_query[:80]}'")

        relevant_docs = await self.vector.search(
            query=search_query,
            namespace=self.NAMESPACE_MEDITATION,
            top_k=top_k,
        )
        context_docs = self._extract_relevant_context(relevant_docs)
        logger.info(
            f"[Meditation] Found {len(context_docs)} docs, scores={[round(doc['score'], 3) for doc in relevant_docs]}"
        )

        return await self.llm.generate_meditation_script(
            user_need=user_need,
            duration=duration,
            context_docs=context_docs if context_docs else None,
            language=language,
        )


rag_service = RAGService()
