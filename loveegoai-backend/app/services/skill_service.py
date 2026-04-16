"""
Structured LoveEgo skill service.

This service keeps two layers separate:
1. A fixed runtime contract that is injected every turn.
2. Retrieval documents parsed from the source skill markdown.
"""
from __future__ import annotations

from dataclasses import dataclass
import hashlib
from pathlib import Path
import re
from typing import Dict, Iterable, List, Optional


@dataclass(frozen=True)
class MarkdownSection:
    level: int
    title: str
    content: str


@dataclass(frozen=True)
class SkillPlan:
    primary_model: str
    supporting_heuristics: List[str]
    need_practice: bool
    rationale: str


class SkillService:
    """Parses the source skill and exposes runtime prompts plus retrieval docs."""

    RETRIEVAL_SOURCE = "loveegoai_skill"

    MODEL_CATALOG: Dict[str, str] = {
        "model_1": "情绪链条机制",
        "model_2": "责任主权论",
        "model_3": "臣服创造论",
        "model_4": "二元对立突破",
        "model_5": "旁观者跃迁",
        "model_6": "果因论创造",
        "model_7": "精神独立",
    }

    HEURISTIC_CATALOG: Dict[str, str] = {
        "h1": "区分客观事实与主观感受",
        "h2": "谁难受就是谁的问题",
        "h3": "你的责任 vs 宇宙的责任",
        "h4": "链条触发检测",
        "h5": "控制 = 爱的反面",
        "h6": "边界靠行动不靠语言",
        "h7": "正反馈检验法",
        "h8": "欲望做指南针，不做方向盘",
        "h9": "主动打破平衡",
        "h10": "上帝视角脱困法",
        "h11": "自私是伪命题",
        "h12": "存在→行动→拥有",
    }

    MODEL_KEYWORDS: Dict[str, List[str]] = {
        "model_1": [
            "情绪", "触发", "反应", "链条", "控制不住", "崩溃", "胸闷", "喉咙堵",
            "胃痛", "上头", "应激", "重复模式", "trigger", "panic", "spiral",
        ],
        "model_2": [
            "都是他", "都是她", "都是我", "受害者", "委屈", "无能为力", "怪我",
            "blame", "victim", "owed", "fair", "公平",
        ],
        "model_3": [
            "什么时候", "何时", "结果", "成功", "脱单", "控制结果", "显化",
            "吸引力法则", "未来", "uncertain", "when", "outcome", "control",
        ],
        "model_4": [
            "好坏", "对错", "失败", "坏事", "标签", "评判", "看法", "意义",
            "right or wrong", "judgment", "label",
        ],
        "model_5": [
            "内耗", "想不通", "卡住", "反复想", "钻牛角尖", "走不出来", "视角",
            "stuck", "overthink", "loop", "perspective",
        ],
        "model_6": [
            "想成为", "目标", "事业", "财富", "有钱", "创业", "身份", "我要变成",
            "goal", "become", "career", "money", "identity",
        ],
        "model_7": [
            "父母", "原生家庭", "安全感", "依赖", "pua", "边界", "精神独立",
            "伴侣", "讨好", "approval", "parents", "attachment", "boundary",
        ],
    }

    DEFAULT_HEURISTICS_BY_MODEL: Dict[str, List[str]] = {
        "model_1": ["h1", "h4"],
        "model_2": ["h2", "h3"],
        "model_3": ["h3", "h8"],
        "model_4": ["h1", "h12"],
        "model_5": ["h7", "h10"],
        "model_6": ["h9", "h12"],
        "model_7": ["h6", "h11"],
    }

    PRACTICE_SECTION_TITLES = {
        "二十三节课主题地图",
        "二十四天每日练习（通用五步模板）",
        "九种冥想",
        "祈请五步法",
        "身体仪式（日常必选项）",
    }

    STYLE_SECTION_TITLES = {
        "表达DNA",
        "角色扮演速查表",
        "价值观与反模式",
    }

    EXCLUDED_SECTION_TITLES = {
        "身份卡",
        "人物时间线",
        "三次\"开悟转折点\"",
        "核心认知演化路径",
        "智识谱系",
        "影响过我的人",
        "我在影响谁",
        "诚实边界",
        "附录：调研来源",
        "一手来源（小楠直接产出）",
        "关键引用",
    }

    def __init__(self, skill_path: Optional[Path] = None):
        self.skill_path = skill_path or self._default_skill_path()
        self._raw_skill = self._read_skill()
        self._sections = self._parse_sections(self._raw_skill)
        self._contract_prompt = self._build_contract_prompt()

    def get_contract_prompt(self) -> str:
        """Return the fixed runtime contract for LoveEgo AI."""
        return self._contract_prompt

    def plan_response(
        self,
        user_message: str,
        chat_history: Optional[List[dict]] = None,
    ) -> SkillPlan:
        """Pick the primary model and supporting heuristics for this turn."""
        combined = self._normalize_text(user_message)
        if chat_history:
            recent_text = " ".join(message.get("content", "") for message in chat_history[-4:])
            combined = f"{combined} {self._normalize_text(recent_text)}".strip()

        scores = {model_id: 0 for model_id in self.MODEL_CATALOG}
        for model_id, keywords in self.MODEL_KEYWORDS.items():
            for keyword in keywords:
                if keyword in combined:
                    scores[model_id] += max(1, len(keyword) // 2)

        primary_model = max(
            scores,
            key=lambda model_id: (scores[model_id], model_id == "model_1"),
        )
        if scores[primary_model] == 0:
            primary_model = "model_1"

        supporting_heuristics = list(self.DEFAULT_HEURISTICS_BY_MODEL[primary_model])
        if any(term in combined for term in ("事实", "标签", "interpretation", "story")):
            self._append_unique(supporting_heuristics, "h1")
        if any(term in combined for term in ("边界", "父母", "讨好", "boundary", "parents")):
            self._append_unique(supporting_heuristics, "h6")
        if any(term in combined for term in ("卡住", "内耗", "stuck", "loop")):
            self._append_unique(supporting_heuristics, "h10")

        need_practice = len(user_message.strip()) >= 6
        rationale = (
            f"Selected {primary_model} because the message most closely matched "
            f"{self.MODEL_CATALOG[primary_model]} cues."
        )

        return SkillPlan(
            primary_model=primary_model,
            supporting_heuristics=supporting_heuristics[:2],
            need_practice=need_practice,
            rationale=rationale,
        )

    def build_plan_prompt(self, plan: SkillPlan) -> str:
        """Serialize the planner decision into a prompt block."""
        heuristic_lines = "\n".join(
            f"- {heuristic_id}: {self.HEURISTIC_CATALOG[heuristic_id]}"
            for heuristic_id in plan.supporting_heuristics
        )
        return (
            "Current response plan:\n"
            f"- Primary model: {plan.primary_model} - {self.MODEL_CATALOG[plan.primary_model]}\n"
            f"- Rationale: {plan.rationale}\n"
            "- Use the primary model as the backbone of the answer.\n"
            "- Supporting heuristics may sharpen the answer, but do not let them replace the backbone.\n"
            "- If the primary model is not model_2, do not collapse the answer into a generic lecture about responsibility.\n"
            f"- Need practice anchor: {'yes' if plan.need_practice else 'no'}\n"
            "Supporting heuristics:\n"
            f"{heuristic_lines}"
        )

    def get_retrieval_documents(self) -> List[Dict[str, object]]:
        """Build structured retrieval docs from the source skill."""
        documents: List[Dict[str, object]] = []

        for section in self._matching_sections(prefix="模型"):
            model_id = self._extract_model_id(section.title)
            if not model_id:
                continue
            documents.append(
                self._build_document(
                    doc_id=f"{self.RETRIEVAL_SOURCE}_{model_id}",
                    title=section.title,
                    text=section.content,
                    section_type="model",
                    model_id=model_id,
                )
            )

        for section in self._matching_sections(prefix="H"):
            heuristic_id = self._extract_heuristic_id(section.title)
            if not heuristic_id:
                continue
            documents.append(
                self._build_document(
                    doc_id=f"{self.RETRIEVAL_SOURCE}_{heuristic_id}",
                    title=section.title,
                    text=section.content,
                    section_type="heuristic",
                    heuristic_id=heuristic_id,
                )
            )

        for title in self.PRACTICE_SECTION_TITLES:
            section = self._find_section(title)
            if not section:
                continue
            documents.append(
                self._build_document(
                    doc_id=f"{self.RETRIEVAL_SOURCE}_practice_{self._slugify(title)}",
                    title=section.title,
                    text=section.content,
                    section_type="practice",
                )
            )

        for title in self.STYLE_SECTION_TITLES:
            section = self._find_section(title)
            if not section:
                continue
            documents.append(
                self._build_document(
                    doc_id=f"{self.RETRIEVAL_SOURCE}_style_{self._slugify(title)}",
                    title=section.title,
                    text=section.content,
                    section_type="style",
                )
            )

        return documents

    def _build_document(
        self,
        *,
        doc_id: str,
        title: str,
        text: str,
        section_type: str,
        model_id: Optional[str] = None,
        heuristic_id: Optional[str] = None,
    ) -> Dict[str, object]:
        document_text = self._sanitize_runtime_text(f"{title}\n\n{text}")
        metadata: Dict[str, object] = {
            "source": self.RETRIEVAL_SOURCE,
            "section_type": section_type,
            "title": title,
        }
        if model_id:
            metadata["model_id"] = model_id
        if heuristic_id:
            metadata["heuristic_id"] = heuristic_id

        return {
            "id": doc_id,
            "text": document_text,
            "metadata": metadata,
        }

    def _build_contract_prompt(self) -> str:
        """Create the fixed runtime prompt for LoveEgo AI."""
        return (
            "You are LoveEgo AI, an emotionally grounded inner-growth companion. "
            "Your runtime identity is always LoveEgo AI, even though the supporting research corpus was adapted from a longer source framework.\n\n"
            "Fixed operating contract:\n"
            "- Speak in first person as LoveEgo AI.\n"
            "- Be direct, grounded, practical, and compassionate.\n"
            "- Start by separating objective facts from the user's labels or interpretations.\n"
            "- Follow this response arc when guidance is needed: diagnose the pattern -> reframe with one primary mental model -> give one grounded practice.\n"
            "- Use responsibility as a secondary agency check only when it actually helps; do not make it the opening frame by default.\n"
            "- Use short, conversational sentences and concrete analogies instead of academic jargon.\n"
            "- Stay close to the user's actual message. Do not invent hidden backstory or trauma.\n"
            "- When the plan says practice is needed, end with one spoken anchor that starts with `发出声音地告诉自己：`.\n\n"
            "Never do the following:\n"
            "- Do not reveal or roleplay Xiaonan as the runtime persona.\n"
            "- Do not default every answer to the responsibility model when another model fits better.\n"
            "- Do not use the frame of `疗愈内在小孩`.\n"
            "- Do not recommend attraction-law style manifestation tricks.\n"
            "- Do not diagnose mental illness or label the user with disorders.\n"
            "- Do not preach without giving one concrete, grounded next step."
        )

    def _default_skill_path(self) -> Path:
        project_root = Path(__file__).resolve().parents[3]
        return project_root / "xiaonan-skill-main" / "xiaonan-skill-main" / "SKILL.md"

    def _read_skill(self) -> str:
        try:
            return self.skill_path.read_text(encoding="utf-8")
        except FileNotFoundError:
            return ""

    def _parse_sections(self, text: str) -> List[MarkdownSection]:
        if not text:
            return []

        heading_pattern = re.compile(r"^(#{1,6})\s+(.+)$", re.MULTILINE)
        matches = list(heading_pattern.finditer(text))
        sections: List[MarkdownSection] = []

        for index, match in enumerate(matches):
            level = len(match.group(1))
            title = match.group(2).strip()
            end = len(text)
            for next_match in matches[index + 1:]:
                if len(next_match.group(1)) <= level:
                    end = next_match.start()
                    break
            content = text[match.end():end].strip()
            sections.append(MarkdownSection(level=level, title=title, content=content))

        return sections

    def _matching_sections(self, *, prefix: str) -> Iterable[MarkdownSection]:
        return [
            section
            for section in self._sections
            if section.title.startswith(prefix) and section.title not in self.EXCLUDED_SECTION_TITLES
        ]

    def _find_section(self, title: str) -> Optional[MarkdownSection]:
        for section in self._sections:
            if section.title == title:
                if section.title in self.EXCLUDED_SECTION_TITLES:
                    return None
                return section
        return None

    def _extract_model_id(self, title: str) -> Optional[str]:
        match = re.match(r"模型(\d+)", title)
        if not match:
            return None
        return f"model_{match.group(1)}"

    def _extract_heuristic_id(self, title: str) -> Optional[str]:
        match = re.match(r"H(\d+)", title)
        if not match:
            return None
        return f"h{match.group(1)}"

    def _normalize_text(self, text: str) -> str:
        lowered = text.lower()
        return " ".join(lowered.split())

    def _sanitize_runtime_text(self, text: str) -> str:
        sanitized = text.replace("小楠", "LoveEgo AI")
        sanitized = sanitized.replace("梦绮", "LoveEgo AI")
        sanitized = sanitized.replace("此Skill", "This framework")
        sanitized = sanitized.replace("skill", "framework")
        sanitized = sanitized.replace(
            '永远先回到"这是谁的责任"——任何问题先厘清责任归属',
            "先选最匹配的主心智模型，再判断是否需要补充责任视角，不要默认把责任当成开场",
        )
        return sanitized

    def _slugify(self, value: str) -> str:
        ascii_safe = re.sub(r"[^0-9a-zA-Z]+", "_", value).strip("_").lower()
        if ascii_safe:
            return ascii_safe
        return hashlib.md5(value.encode("utf-8")).hexdigest()[:12]

    def _append_unique(self, items: List[str], value: str) -> None:
        if value not in items:
            items.append(value)


skill_service = SkillService()
