"""
Structured Changemind persona service built from the source docx file.
"""
from __future__ import annotations

from dataclasses import dataclass
import hashlib
import os
from pathlib import Path
import re
from typing import Dict, List, Optional, Sequence, Tuple

from docx import Document


@dataclass(frozen=True)
class ParsedParagraph:
    text: str
    style_name: str


class ChangemindPersonaService:
    """Build fine-grained tagged persona docs from the source docx."""

    RETRIEVAL_SOURCE = "changemind_persona_structured"
    DOC_ID_PREFIX = "changemind_persona_structured_"
    TARGET_CHUNK_SIZE = 800

    SECTION_TYPE_PRIORITY = [
        "practice",
        "relationship",
        "body",
        "emotion",
        "self_concept",
        "style",
        "principle",
    ]

    SECTION_TYPE_RULES: Dict[str, Tuple[str, ...]] = {
        "practice": (
            "实践",
            "练习",
            "冥想",
            "呼吸",
            "呼吸法",
            "书写",
            "自由书写",
            "咒语书写",
            "祈请",
            "仪式",
            "晨练",
            "瑜伽",
            "止语",
            "唱诵",
            "接地",
            "愿景板",
            "泡澡",
            "洗澡",
        ),
        "relationship": (
            "关系",
            "伴侣",
            "灵魂伴侣",
            "婚姻",
            "两性",
            "父母",
            "原生家庭",
            "边界",
            "控制",
            "讨好",
            "共生",
            "依附",
            "被爱",
            "pua",
            "npd",
            "投射",
            "伴侣价值",
            "荷尔蒙",
        ),
        "body": (
            "身体",
            "身心",
            "脉轮",
            "海底轮",
            "生殖轮",
            "太阳轮",
            "心轮",
            "喉轮",
            "眉心轮",
            "顶轮",
            "能量",
            "睡眠",
            "食物",
            "植物能量",
            "精油",
            "海盐",
            "磨砂膏",
            "梵咒",
            "aum",
            "om",
        ),
        "emotion": (
            "情绪",
            "情绪链条",
            "链条",
            "触发",
            "内耗",
            "痛苦",
            "焦虑",
            "委屈",
            "阴影",
            "阴影面",
            "受害者",
            "接纳",
            "责任",
            "臣服",
            "二元对立",
            "评判",
            "事实",
            "当下",
        ),
        "self_concept": (
            "自我价值",
            "本自具足",
            "身份",
            "自我形象",
            "行动力",
            "创造者",
            "创造",
            "圆满",
            "果因论",
            "事业",
            "财富",
            "赚钱",
            "欲望",
            "安全感",
            "显化",
            "女性能量",
            "男性能量",
            "阴阳平衡",
            "直觉",
        ),
        "style": (
            "说话风格",
            "语言特点",
            "表达方式",
            "引导方式",
            "核心价值观",
        ),
        "principle": (
            "语言就是咒语",
            "语言的力量",
            "宇宙",
            "量子场",
            "真理",
            "实相",
            "价值观",
            "道德观",
            "觉知",
            "意识",
            "规律",
        ),
    }

    SECONDARY_TYPE_RULES: Dict[str, List[Tuple[str, Tuple[str, ...]]]] = {
        "practice": [
            ("journaling", ("自由书写", "咒语书写", "写日记", "书写", "写下来")),
            ("meditation", ("冥想", "显化冥想", "回归当下", "愿景板", "观想")),
            ("breathwork", ("呼吸法", "呼吸", "调息", "三段式呼吸", "乌加依", "风箱呼吸", "清凉呼吸")),
            ("movement", ("晨练", "瑜伽", "阿斯汤伽", "舞动", "体式")),
            ("mantra_prayer", ("梵咒", "aum", "om", "咒语", "祈请", "止语", "唱诵")),
            ("grounding", ("接地", "地球母亲", "扎根", "赤脚")),
            ("body_care", ("泡澡", "洗澡", "海盐", "精油", "磨砂膏", "晒背")),
            ("daily_practice", ("实践", "仪式", "练习", "恢复身体能量")),
        ],
        "relationship": [
            ("parents_origin", ("父母", "原生家庭", "权力交接", "家庭", "共生")),
            ("boundaries", ("边界", "说不", "立场", "真实表达", "拒绝")),
            ("partner_selection", ("灵魂伴侣", "伴侣", "婚姻", "匹配", "择偶", "伴侣价值")),
            ("control_attachment", ("控制", "依附", "讨好", "pua", "npd", "投射", "拯救", "荷尔蒙")),
            ("intimacy", ("亲密关系", "被爱", "安全感", "两性关系")),
            ("feminine_masculine", ("女性能量", "男性能量", "阴阳", "雌雄同体")),
        ],
        "body": [
            ("chakra_system", ("脉轮", "能量通道", "连接点", "能量中心")),
            ("root_chakra", ("海底轮", "脊柱底部", "安全感", "自我肯定")),
            ("sacral_chakra", ("生殖轮", "下腹部", "创造力", "欢愉")),
            ("solar_plexus", ("太阳轮", "热情", "行动力", "胃", "肝", "胰")),
            ("heart_chakra", ("心轮", "接纳自己", "接纳万事万物", "胸腔中央")),
            ("throat_chakra", ("喉轮", "沟通", "表达", "真诚", "说出真理")),
            ("third_eye", ("眉心轮", "双眉之间", "洞见", "智慧", "生命的实相")),
            ("crown_chakra", ("顶轮", "头顶", "宇宙", "链接宇宙")),
            ("breath_energy", ("呼吸", "prana", "调息", "生命能量")),
            ("recovery_care", ("睡眠", "泡澡", "洗澡", "食物", "精油", "海盐", "磨砂膏", "嗅觉")),
        ],
        "emotion": [
            ("emotional_chain", ("情绪链条", "链条", "触发", "身体反应", "条件反射")),
            ("responsibility", ("责任", "谁的责任", "我的责任", "宇宙的责任")),
            ("acceptance_presence", ("接纳", "当下", "事实", "允许", "回归当下")),
            ("surrender_trust", ("臣服", "信任宇宙", "放手", "宇宙", "顺流")),
            ("victimhood_duality", ("受害者", "二元对立", "评判", "好坏", "对错", "内耗")),
            ("shadow_processing", ("阴影", "阴影面", "自私", "委屈", "愤怒", "羞耻", "痛苦")),
        ],
        "self_concept": [
            ("self_worth", ("自我价值", "本自具足", "值得", "配得", "不配得", "安全感")),
            ("identity_shift", ("身份", "自我形象", "旧模式", "清空", "成为", "圆满")),
            ("action_agency", ("行动力", "行动", "执行", "知行合一", "拖延")),
            ("creator_mode", ("创造者", "果因论", "显化", "量子场", "创造现实")),
            ("abundance_career", ("事业", "财富", "赚钱", "收入", "商业", "金钱")),
            ("inner_discernment", ("直觉", "洞见", "判断", "觉知", "欲望")),
            ("energy_balance", ("女性能量", "男性能量", "阴阳平衡", "阴阳", "欢愉")),
        ],
        "style": [
            ("guidance_style", ("引导方式", "说话风格", "表达方式")),
            ("core_values", ("核心价值观", "语言特点")),
        ],
        "principle": [
            ("language_spell", ("语言就是咒语", "语言的力量", "发出声音", "咒语")),
            ("co_creation", ("宇宙", "量子场", "显化", "共同创造", "共创")),
            ("worldview_shift", ("价值观", "道德观", "事实", "实相", "真理")),
            ("freedom_independence", ("自由", "精神独立", "不共生", "主角")),
            ("integration", ("知行合一", "实践", "体验", "信息", "落地")),
        ],
    }

    DEFAULT_SECONDARY_TYPE = {
        "practice": "daily_practice",
        "relationship": "general_relationship",
        "body": "body_energy",
        "emotion": "emotional_awareness",
        "self_concept": "identity_growth",
        "style": "guidance_style",
        "principle": "core_principle",
    }

    TOPIC_SECTION_OVERRIDES: List[Tuple[str, Tuple[str, ...]]] = [
        (
            "practice",
            (
                "找到魔法的方法",
                "身体仪式",
                "关于显化冥想",
                "恢复身体能量",
                "自由书写",
                "咒语书写",
                "三段式呼吸法",
                "呼吸法",
                "实践",
            ),
        ),
        (
            "emotion",
            (
                "事实是",
                "错误示范",
                "正确示范",
                "打个比方",
                "情绪链条",
                "阴影面",
                "二元对立",
            ),
        ),
        (
            "relationship",
            (
                "摆脱共生的关系",
                "原生家庭",
                "灵魂伴侣",
                "不健康的两性关系",
                "伴侣",
                "边界",
            ),
        ),
    ]

    TOPIC_SECONDARY_OVERRIDES: Dict[str, List[Tuple[str, Tuple[str, ...]]]] = {
        "practice": [
            ("journaling", ("自由书写", "咒语书写")),
            ("meditation", ("显化冥想", "冥想", "愿景板")),
            ("breathwork", ("三段式呼吸法", "呼吸法", "调息")),
            ("movement", ("晨练", "瑜伽", "阿斯汤伽")),
            ("mantra_prayer", ("梵咒", "咒语", "祈请", "唱诵", "止语")),
            ("grounding", ("接地",)),
            ("body_care", ("泡澡", "洗澡", "海盐", "精油", "磨砂膏")),
            ("daily_practice", ("身体仪式", "恢复身体能量", "找到魔法的方法", "实践")),
        ],
        "relationship": [
            ("parents_origin", ("原生家庭", "父母", "权力交接", "共生")),
            ("partner_selection", ("灵魂伴侣", "伴侣", "婚姻", "匹配", "伴侣价值")),
            ("boundaries", ("边界", "说不", "立场", "真实表达")),
            ("control_attachment", ("控制", "讨好", "依附", "pua", "npd", "投射")),
        ],
        "emotion": [
            ("responsibility", ("责任", "谁的责任", "宇宙的责任")),
            ("emotional_chain", ("情绪链条", "链条", "触发")),
            ("acceptance_presence", ("接纳", "当下", "事实")),
            ("surrender_trust", ("臣服", "信任宇宙")),
            ("victimhood_duality", ("二元对立", "评判", "受害者", "内耗")),
            ("shadow_processing", ("阴影面", "阴影", "委屈", "愤怒", "羞耻")),
        ],
    }

    def __init__(self, source_path: Optional[Path] = None):
        self.source_path = source_path or self._default_source_path()

    def get_retrieval_documents(self) -> List[Dict[str, object]]:
        """Return fine-grained persona docs for Pinecone import."""
        paragraphs = self._read_source_paragraphs()
        if not paragraphs:
            return []

        documents: List[Dict[str, object]] = []
        current_part: Optional[str] = None
        current_lesson: Optional[str] = None
        current_topic: Optional[str] = None
        chunk_paragraphs: List[str] = []
        chunk_index = 0

        def flush_chunk() -> None:
            nonlocal chunk_paragraphs, chunk_index, documents
            if not chunk_paragraphs:
                return

            chunk_index += 1
            body = "\n\n".join(chunk_paragraphs).strip()
            section_type = self._classify_section_type(
                body=body,
                topic_text=current_topic or "",
                lesson_text=current_lesson or "",
                part_text=current_part or "",
            )
            subsection_type = self._classify_secondary_type(
                section_type=section_type,
                body=body,
                topic_text=current_topic or "",
                lesson_text=current_lesson or "",
            )
            title = current_topic or current_lesson or current_part or f"chunk_{chunk_index}"
            topic_id = self._slugify(title)

            metadata = {
                "source": self.RETRIEVAL_SOURCE,
                "section_type": section_type,
                "subsection_type": subsection_type,
                "tag_path": f"{section_type}/{subsection_type}",
                "part_title": current_part or "",
                "part_id": self._slugify(current_part) if current_part else "",
                "lesson_title": current_lesson or "",
                "lesson_id": self._slugify(current_lesson) if current_lesson else "",
                "topic_title": current_topic or "",
                "chunk_index": chunk_index,
                "title": title,
                "topic_id": topic_id,
            }

            context_lines = [line for line in [current_part, current_lesson, current_topic] if line]
            text = "\n".join(context_lines + ["", body]).strip()
            documents.append(
                {
                    "id": f"{self.DOC_ID_PREFIX}{chunk_index:03d}",
                    "text": text,
                    "metadata": metadata,
                }
            )
            chunk_paragraphs = []

        for paragraph in paragraphs:
            heading = self._classify_heading(paragraph.text, paragraph.style_name)
            if heading:
                flush_chunk()
                if heading["kind"] == "part":
                    current_part = heading["title"]
                    current_lesson = None
                    current_topic = None
                elif heading["kind"] == "lesson":
                    current_lesson = heading["title"]
                    current_topic = None
                elif heading["kind"] == "topic":
                    current_topic = heading["title"]
                continue

            if self._is_noise(paragraph.text):
                continue

            if self._would_exceed_target(chunk_paragraphs, paragraph.text):
                flush_chunk()

            chunk_paragraphs.append(paragraph.text)

        flush_chunk()
        return documents

    def _read_source_paragraphs(self) -> List[ParsedParagraph]:
        if self.source_path.suffix.lower() == ".docx":
            return self._read_docx_paragraphs(self.source_path)
        return self._read_markdown_paragraphs(self.source_path)

    def _read_docx_paragraphs(self, path: Path) -> List[ParsedParagraph]:
        document = Document(path)
        paragraphs: List[ParsedParagraph] = []
        for paragraph in document.paragraphs:
            text = self._normalize_text(paragraph.text)
            if not text:
                continue
            style_name = paragraph.style.name if paragraph.style else ""
            paragraphs.append(ParsedParagraph(text=text, style_name=style_name))
        return paragraphs

    def _read_markdown_paragraphs(self, path: Path) -> List[ParsedParagraph]:
        try:
            content = path.read_text(encoding="utf-8")
        except FileNotFoundError:
            return []

        paragraphs: List[ParsedParagraph] = []
        for block in re.split(r"\n\s*\n", content):
            text = self._normalize_text(block)
            if text:
                paragraphs.append(ParsedParagraph(text=text, style_name="markdown"))
        return paragraphs

    def _default_source_path(self) -> Path:
        candidate_paths = [
            os.getenv("CHANGE_MIND_SOURCE_DOCX"),
            str(Path.home() / "Desktop" / "EGO" / "转念.docx"),
            str(Path(__file__).resolve().parents[3] / "loveegoai-backend" / "knowledge" / "changemind_persona.md"),
        ]
        for raw_path in candidate_paths:
            if not raw_path:
                continue
            candidate = Path(raw_path)
            if candidate.exists():
                return candidate
        return Path(candidate_paths[-1])

    def _classify_heading(self, text: str, style_name: str) -> Optional[Dict[str, str]]:
        clean = text.strip()
        if not clean:
            return None

        clean = re.sub(r"^[^\w\u4e00-\u9fff]+", "", clean)

        if style_name == "MainTitle":
            return {"kind": "part", "title": clean}

        if re.match(r"^part\s*\d+", clean, re.IGNORECASE):
            return {"kind": "part", "title": clean}

        if re.match(r"^第\s*[0-9一二三四五六七八九十百]+\s*[课节讲](?:[:：].*)?$", clean):
            return {"kind": "lesson", "title": clean}

        if self._looks_like_topic(clean):
            return {"kind": "topic", "title": clean}

        return None

    def _looks_like_topic(self, text: str) -> bool:
        topic_starts = (
            "课程前须知",
            "脉轮",
            "找到魔法的方法",
            "身体仪式",
            "关于",
            "恢复身体能量",
            "实践",
            "错误示范",
            "正确示范",
            "打个比方",
            "为什么",
            "最后",
            "告诉自己",
            "事实是",
            "摆脱共生的关系",
        )
        return (
            len(text) <= 50
            and (
                text.endswith(("：", ":"))
                or re.match(r"^[0-9]{1,2}[.、:：]", text)
                or text.startswith(topic_starts)
            )
        )

    def _classify_section_type(
        self,
        body: str,
        topic_text: str = "",
        lesson_text: str = "",
        part_text: str = "",
    ) -> str:
        topic_override = self._match_override(topic_text, self.TOPIC_SECTION_OVERRIDES)
        if topic_override:
            return topic_override

        scores = {
            section_type: self._weighted_keyword_score(
                keywords,
                body=body,
                topic_text=topic_text,
                lesson_text=lesson_text,
                part_text=part_text,
            )
            for section_type, keywords in self.SECTION_TYPE_RULES.items()
        }
        best_type = max(
            self.SECTION_TYPE_PRIORITY,
            key=lambda section_type: (scores.get(section_type, 0), -self.SECTION_TYPE_PRIORITY.index(section_type)),
        )
        if scores.get(best_type, 0) > 0:
            return best_type
        return "principle"

    def _classify_secondary_type(
        self,
        section_type: str,
        body: str,
        topic_text: str = "",
        lesson_text: str = "",
    ) -> str:
        topic_override = self._match_override(
            topic_text,
            self.TOPIC_SECONDARY_OVERRIDES.get(section_type, []),
        )
        if topic_override:
            return topic_override

        rules = self.SECONDARY_TYPE_RULES.get(section_type, [])
        if not rules:
            return self.DEFAULT_SECONDARY_TYPE.get(section_type, "general")

        scored_rules = [
            (
                secondary_type,
                self._weighted_keyword_score(
                    keywords,
                    body=body,
                    topic_text=topic_text,
                    lesson_text=lesson_text,
                ),
            )
            for secondary_type, keywords in rules
        ]
        best_secondary, best_score = max(scored_rules, key=lambda item: item[1], default=("general", 0))
        if best_score > 0:
            return best_secondary
        return self.DEFAULT_SECONDARY_TYPE.get(section_type, "general")

    def _keyword_score(self, text: str, keywords: Sequence[str]) -> int:
        lowered = text.lower()
        return sum(lowered.count(keyword.lower()) for keyword in keywords)

    def _weighted_keyword_score(
        self,
        keywords: Sequence[str],
        body: str,
        topic_text: str = "",
        lesson_text: str = "",
        part_text: str = "",
    ) -> int:
        return (
            self._keyword_score(topic_text, keywords) * 4
            + self._keyword_score(lesson_text, keywords) * 2
            + self._keyword_score(part_text, keywords)
            + self._keyword_score(body, keywords)
        )

    def _match_override(
        self,
        text: str,
        rules: Sequence[Tuple[str, Sequence[str]]],
    ) -> Optional[str]:
        if not text:
            return None
        for label, patterns in rules:
            if any(pattern in text for pattern in patterns):
                return label
        return None

    def _is_noise(self, text: str) -> bool:
        return text in {"课程", "part1改变", "part2 创造", "part2创造"}

    def _would_exceed_target(self, current_paragraphs: List[str], next_paragraph: str) -> bool:
        current_text = "\n\n".join(current_paragraphs)
        return bool(current_text) and len(current_text) + len(next_paragraph) + 2 > self.TARGET_CHUNK_SIZE

    def _normalize_text(self, text: str) -> str:
        collapsed_lines = [line.strip() for line in text.splitlines() if line.strip()]
        return "\n".join(collapsed_lines).strip()

    def _slugify(self, value: str) -> str:
        ascii_safe = re.sub(r"[^0-9a-zA-Z]+", "_", value).strip("_").lower()
        if ascii_safe:
            return ascii_safe
        return hashlib.md5(value.encode("utf-8")).hexdigest()[:12]


changemind_persona_service = ChangemindPersonaService()
