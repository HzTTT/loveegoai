import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// ═══════════════════════════════════════════════════════════════
// Love Ego AI — 完整集成 Demo
// 流程：Onboarding 8题 → 结果页 → 付费墙 → 限制性信念卡片课程 → AI 对话
// ═══════════════════════════════════════════════════════════════

type Stage = 'quiz' | 'result' | 'paywall' | 'course' | 'ai_chat'

// ─── 色系 ────────────────────────────────────────
const C = {
  bg: '#160F14',
  bgLight: '#1D1520',
  bgCard: 'rgba(250,240,245,0.04)',
  border: 'rgba(210,170,180,0.14)',
  gold: '#C9A87C',
  goldDim: 'rgba(201,168,124,0.5)',
  rose: '#D4A0B0',
  roseLight: 'rgba(212,160,176,0.7)',
  roseDim: 'rgba(212,160,176,0.35)',
  roseFaint: 'rgba(212,160,176,0.10)',
  violet: 'rgba(178,140,210,0.55)',
  white: '#FDF8FA',
  mid: '#B8A8B2',
  dim: '#6B5A64',
}

const FONT = "'Noto Sans SC', -apple-system, 'Helvetica Neue', sans-serif"
const FONT_SERIF = "'Noto Serif SC', 'Georgia', serif"

// ─── Onboarding 8 题（ELENA 原文）────────────────
const QUESTIONS = [
  {
    q: '如果亲密关系真的变好了，最想先感受到什么？',
    a: '被坚定选择、被爱、被确认',
    b: '更有魅力、更有吸引力、更像女人',
    c: '更高质量的爱，同时不失去自己的节奏和人生',
  },
  {
    q: '当对方突然冷下来时，第一反应更像哪一种？',
    a: '很慌，想立刻确认关系有没有问题',
    b: '脑子会开始分析，但身体其实也会紧',
    c: '能看见自己被触发了，但想知道怎么更高级地回应',
  },
  {
    q: '哪句话更像现在的自己？',
    a: '如果有一段好的关系，很多问题都会好起来',
    b: '我其实很能干，但我不够有吸引力',
    c: '我已经明白很多了，现在更想把内在稳定变成现实结果',
  },
  {
    q: '现在最想先改善的是什么？',
    a: '不再一被忽视就崩',
    b: '提升自己的女性魅力和性感',
    c: '让爱和成就都更上一层楼',
  },
  {
    q: '在关系里，最常见的困扰是什么？',
    a: '总怕失去、怕不被爱、怕被抛下',
    b: '明明很优秀，但就是没有那种柔软和吸引力',
    c: '已经不太执着于被爱，但想知道怎么进入更高质量的关系',
  },
  {
    q: '更像哪种状态？',
    a: '很容易被对方带走',
    b: '很容易活在头脑里',
    c: '已经能稳定很多，但想活出更大版本的自己',
  },
  {
    q: '哪句话最刺到你？',
    a: '安全感不是通过绑定一个人得到的',
    b: '魅力不是技巧，是身体在场',
    c: '更高阶段的问题，不需要在旧层级里解决',
  },
  {
    q: '现在更需要哪种帮助？',
    a: '帮我稳住自己，不要总在关系里失控',
    b: '帮我从头脑回到身体，提升女性能量',
    c: '帮我把觉知真正带进关系、财富和现实创造',
  },
]

// ─── 结果页（ELENA 原文）────────────────────────
const RESULTS = {
  L1: {
    title: '安全感与关系稳定路径',
    desc: '你现在最需要的，不是更会爱别人，而是先不再把自己的安全感完全交给关系。',
    label: '关系托付型',
  },
  L2: {
    title: '女性能量与魅力恢复路径',
    desc: '你已经有现实层面的能力，接下来最值得打开的，是身体、感受和磁性魅力。',
    label: '事业主导型',
  },
  L3: {
    title: '高阶关系与现实整合路径',
    desc: '你已经不再停留在基础依附和防御层，接下来更适合进入爱、成就和生命表达的整合训练。',
    label: '觉醒参与型',
  },
}

// ─── 限制性信念卡片课程（ELENA 7层结构，24张）────
type CardLayer = 'opening' | 'concept' | 'mechanism' | 'scene' | 'body' | 'self' | 'bridge'

interface CourseCard {
  layer: CardLayer
  layerName: string
  title: string
  body: string
  accent?: boolean // 特别突出的卡片
}

const LAYER_NAMES: Record<CardLayer, string> = {
  opening: '开场',
  concept: '概念',
  mechanism: '运作机制',
  scene: '生活场景',
  body: '身体识别',
  self: '自我识别',
  bridge: '练习与过渡',
}

const LAYER_COLORS: Record<CardLayer, string> = {
  opening: C.rose,
  concept: C.gold,
  mechanism: 'rgba(178,140,210,0.8)',
  scene: C.roseLight,
  body: 'rgba(140,200,180,0.8)',
  self: C.gold,
  bridge: C.rose,
}

const COURSE_CARDS: CourseCard[] = [
  // ── 开场层（3张）──
  { layer: 'opening', layerName: '开场', title: '为什么知道很多，人生还是没变', body: '你读过很多书、听过很多道理、试过很多方法。\n\n但生活好像还是在重复同一种模式。\n\n不是你不够努力，是有些东西比认知更深。' },
  { layer: 'opening', layerName: '开场', title: '因为问题不只是认知', body: '真正困住你的，不是你不知道该怎么做。\n\n而是你内心深处，一直在相信某些旧声音。\n\n那些声音太熟悉了，熟悉到你以为它们就是事实。' },
  { layer: 'opening', layerName: '开场', title: '这节课要做什么', body: '这节课要做的，不是安慰自己，\n不是再学一个新道理，\n\n而是找出那句一直在替你做决定的旧声音。', accent: true },

  // ── 概念层（5张）──
  { layer: 'concept', layerName: '概念', title: '什么是限制性信念', body: '限制性信念不是事实，\n是被重复太久的想法。\n\n它被重复得太多次，\n你已经不觉得它是一个"想法"了——\n你觉得它就是"我"。' },
  { layer: 'concept', layerName: '概念', title: '它从哪里来', body: '它通常来自早年经验、\n父母的价值观、\n环境的评价。\n\n"你不够好"\n"你必须优秀才值得被爱"\n"你不应该要太多"\n\n这些话进入你的生命时，你还太小，无法反驳。' },
  { layer: 'concept', layerName: '概念', title: '它不只在头脑里', body: '一条限制性信念，不只停留在头脑。\n\n它会进入身体。\n\n变成胸口的紧、喉咙的堵、\n胃里的沉、肩膀的僵。\n\n你的身体一直在替你"相信"着什么。' },
  { layer: 'concept', layerName: '概念', title: '它变成了"我就是这样"', body: '慢慢地，\n它从一句话变成了一种感觉，\n从一种感觉变成了一种身份。\n\n"我就是不够好。"\n"我就是不值得。"\n"我就是必须靠自己。"\n\n你以为这是性格，其实这是旧声音。' },
  { layer: 'concept', layerName: '概念', title: '它最厉害的地方', body: '限制性信念最厉害的地方，\n是让人误把熟悉当真实。\n\n因为你已经相信了太久，\n所以任何不符合它的可能性，\n你都会自动过滤掉。', accent: true },

  // ── 运作机制层（5张）──
  { layer: 'mechanism', layerName: '运作机制', title: '信念决定你怎么看', body: '一条限制性信念\n会决定你怎么看一件事。\n\n同样是对方没回消息，\n"我不够好"的信念会让你看到"被忽视"，\n而不是"他在忙"。' },
  { layer: 'mechanism', layerName: '运作机制', title: '看法带来身体收缩', body: '这个看法不会停留在头脑里。\n\n它会立刻带来一次身体收缩——\n\n胸口发紧，\n呼吸变浅，\n胃开始翻搅。\n\n这是信念启动的第二步。' },
  { layer: 'mechanism', layerName: '运作机制', title: '身体收缩带来熟悉情绪', body: '身体收缩会唤起一种\n你非常熟悉的情绪——\n\n焦虑、委屈、愤怒、无力。\n\n这些情绪不是新的，\n是你的身体已经排练过无数次的。' },
  { layer: 'mechanism', layerName: '运作机制', title: '熟悉情绪带来熟悉反应', body: '当熟悉的情绪升起来，\n你会做出熟悉的反应——\n\n追问、讨好、冷战、崩溃、\n或者假装什么都没发生。\n\n不是你想这样做，\n是你的身体已经自动开始了。' },
  { layer: 'mechanism', layerName: '运作机制', title: '熟悉反应制造同样的现实', body: '信念 → 看法 → 身体收缩 → \n熟悉情绪 → 熟悉反应 → \n同样的现实\n\n这就是为什么\n你一直在经历类似的事情。\n\n不是命运，是闭环。', accent: true },

  // ── 生活场景层（6张）──
  { layer: 'scene', layerName: '生活场景', title: '"如果我不够好，就不会被爱"', body: '你总是在关系里努力表现——\n温柔、体贴、懂事。\n\n因为在你内心深处，\n有一个声音一直在说：\n\n如果你不够好，\n就没有人会爱你。', accent: true },
  { layer: 'scene', layerName: '生活场景', title: '"如果我不一直强，就会被看轻"', body: '你不允许自己脆弱，\n不允许自己需要帮助。\n\n因为你相信：\n一旦你不够强，\n别人就会看轻你。\n\n所以你一个人扛着一切。' },
  { layer: 'scene', layerName: '生活场景', title: '"如果他冷下来，就说明我不重要"', body: '对方只要稍微不回应，\n你就开始解读：\n\n"他不在意我了。"\n"我做错了什么。"\n"我不够重要。"\n\n不是他冷了，\n是你的旧声音又开始说话了。' },
  { layer: 'scene', layerName: '生活场景', title: '"如果别人不认可我，说明我不值得"', body: '你会因为一句评价而动摇——\n\n被夸了就松一口气，\n被否定了就开始怀疑自己。\n\n因为你的价值感，\n一直建立在别人的回应上。' },
  { layer: 'scene', layerName: '生活场景', title: '"如果我停下来，我就会落后"', body: '你不敢休息，\n不敢放松，\n不敢什么都不做。\n\n因为你相信：\n一旦停下来，\n你就会被世界甩开。' },
  { layer: 'scene', layerName: '生活场景', title: '"如果我不控制，一切都会失控"', body: '你对关系里的每一个细节\n都想掌控——\n\n他的情绪、他的回应、\n关系的走向。\n\n因为放手让你恐惧。\n你相信：一旦松开，\n一切都会崩塌。' },

  // ── 身体识别层（3张）──
  { layer: 'body', layerName: '身体识别', title: '信念启动时，身体先知道', body: '当一条限制性信念启动时，\n身体通常比头脑先反应——\n\n还没想明白发生了什么，\n身体已经开始紧了。\n\n你有注意过吗？' },
  { layer: 'body', layerName: '身体识别', title: '不同的紧，不同的体验', body: '胸口紧 → 被压住、透不过气\n喉咙紧 → 说不出口、委屈\n胃紧 → 恐惧、不安全\n肩膀紧 → 在扛、在撑\n\n身体收缩不是结论，\n而是入口。', accent: true },
  { layer: 'body', layerName: '身体识别', title: '信念在身体里活着', body: '真正的限制性信念，\n不只是在脑子里——\n\n它在身体里活着。\n\n每次被触发，\n它都会用同一个位置的紧\n来提醒你：\n"你还在相信那句话。"' },

  // ── 自我识别层（4张）──
  { layer: 'self', layerName: '自我识别', title: '你最常重复的那句话是什么', body: '现在，试着不去分析，\n只是感受一下——\n\n你内心最常重复的\n那句内在台词是什么？\n\n不需要说得很完整。\n只是让它浮上来。' },
  { layer: 'self', layerName: '自我识别', title: '那更像谁的声音', body: '这句话，\n不像是今天才有的。\n\n它更像是谁的声音？\n\n妈妈？爸爸？老师？\n还是小时候的环境？\n\n第一直觉，不用很确定。' },
  { layer: 'self', layerName: '自我识别', title: '它现在还在替你决定什么', body: '这句话进入你的生命后，\n一直在暗中替你做决定——\n\n它决定了你选什么样的人，\n它决定了你怎么回应冲突，\n它决定了你觉得自己值不值得。\n\n你有没有发现？' },
  { layer: 'self', layerName: '自我识别', title: '如果没有这句话', body: '如果有一天，\n这句旧声音安静了，\n不再替你说话了——\n\n你会怎么活？\n\n不用急着回答。\n让这个问题停一会儿。', accent: true },

  // ── 练习与过渡层（3张 + 1张过桥）──
  { layer: 'bridge', layerName: '练习与过渡', title: '今天不用推翻它', body: '今天先不要推翻它，\n不要急着"变好"。\n\n只要先看见它。\n\n看见它是一条旧声音，\n不是全部的你。' },
  { layer: 'bridge', layerName: '练习与过渡', title: '下一步', body: '下一步，\n你会进入限制性信念 AI。\n\nAI 会帮你找到\n你自己的那句旧声音——\n\n不是重复课程，\n而是把它变成你自己的语言。' },
  { layer: 'bridge', layerName: '练习与过渡', title: '你不用一次改掉它', body: '你不用一次改掉它。\n\n只要第一次\n把它和"自己"分开。\n\n"这是一条旧声音，\n不是全部的我。"', accent: true },
]

// ─── AI 对话（ELENA 固定4步模板）────────────────
interface ChatMessage {
  role: 'ai' | 'user'
  text: string
  options?: string[]
}

const AI_CONVERSATION: ChatMessage[] = [
  { role: 'ai', text: '刚刚这节课里，\n哪一句最像你一直活在里面的那句话？\n\n不用说很多，先用一句自己的话说出来。', options: ['"如果我不够好，就不会被爱"', '"如果我停下来，就会落后"', '"如果我不控制，一切都会失控"'] },
  { role: 'user', text: '"如果我不够好，就不会被爱"' },
  { role: 'ai', text: '这句话不像今天才有。\n\n它更像是谁的声音？\n或者说，它第一次进入你生命的时候，\n更像哪个阶段？', options: ['好像是妈妈的声音', '小时候在学校', '不确定，但很早就有了'] },
  { role: 'user', text: '好像是妈妈的声音' },
  { role: 'ai', text: '当你说出"如果我不够好，就不会被爱"\n这句话的时候，\n\n身体最先哪里有感觉？\n先别分析，只说身体。', options: ['胸口发紧', '喉咙堵住了', '胃在翻搅'] },
  { role: 'user', text: '胸口发紧' },
  { role: 'ai', text: '胸口的紧，\n是你的身体一直在替你"相信"着这句话。\n\n今天不用推翻它。\n\n先带走一句新的话：\n\n"这是一条旧声音，不是全部的我。"' },
]

// ═══════════════════════════════════════════════════════════════
// 组件
// ═══════════════════════════════════════════════════════════════

const KEYFRAMES = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes breatheGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(212,160,176,0.15); }
  50% { box-shadow: 0 0 40px rgba(212,160,176,0.3); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
@keyframes typing {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}
`

// ─── 进度条 ──────────────────────────────────────
function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 22 : 6,
            background: i < current ? C.rose : i === current ? C.rose : 'rgba(212,160,176,0.15)',
            opacity: i <= current ? 1 : 0.4,
          }}
          transition={{ duration: 0.3 }}
          style={{ height: 6, borderRadius: 3 }}
        />
      ))}
    </div>
  )
}

// ─── 按钮 ──────────────────────────────────────
function PrimaryButton({ label, onClick, disabled = false }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      style={{
        width: '100%',
        padding: '16px 0',
        background: disabled ? 'rgba(212,160,176,0.15)' : `linear-gradient(135deg, ${C.rose}, ${C.gold})`,
        border: 'none',
        borderRadius: 14,
        fontSize: 15,
        fontWeight: 600,
        color: disabled ? C.dim : '#1A0F14',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: FONT,
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </motion.button>
  )
}

// ─── 选项按钮 ────────────────────────────────────
function OptionButton({ text, selected, onClick, index }: { text: string; selected: boolean; onClick: () => void; index: number }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.35 }}
      whileTap={{ scale: 0.97 }}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '16px 18px',
        background: selected ? 'rgba(212,160,176,0.12)' : 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${selected ? C.rose : 'rgba(212,160,176,0.12)'}`,
        borderRadius: 14,
        fontSize: 14.5,
        lineHeight: 1.6,
        color: selected ? C.white : C.mid,
        cursor: 'pointer',
        fontFamily: FONT,
        transition: 'all 0.25s',
      }}
    >
      {text}
    </motion.button>
  )
}

// ─── 卡片课程层标签 ──────────────────────────────
function LayerBadge({ layer }: { layer: CardLayer }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      color: LAYER_COLORS[layer],
      background: `${LAYER_COLORS[layer]}15`,
      border: `1px solid ${LAYER_COLORS[layer]}30`,
      letterSpacing: '0.04em',
      fontFamily: FONT,
    }}>
      {LAYER_NAMES[layer]}
    </span>
  )
}

// ─── 背景粒子 ──────────────────────────────────
function BgParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    left: `${(i * 8.3 + 3) % 94}%`,
    top: `${(i * 11.7 + 8) % 85}%`,
    size: i % 3 === 0 ? 3 : 2,
    delay: `${(i * 0.6) % 4}s`,
    duration: `${5 + (i * 0.8) % 4}s`,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.left,
          top: p.top,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: i % 2 === 0 ? C.roseDim : C.goldDim,
          animation: `pulse ${p.duration} ${p.delay} ease-in-out infinite`,
          opacity: 0.3,
        }} />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 主组件
// ═══════════════════════════════════════════════════════════════

export default function IntegratedDemo() {
  const [stage, setStage] = useState<Stage>('quiz')
  const [quizIndex, setQuizIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [result, setResult] = useState<'L1' | 'L2' | 'L3'>('L1')
  const [cardIndex, setCardIndex] = useState(0)
  const [chatStep, setChatStep] = useState(0)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // 计分
  const computeResult = useCallback((ans: string[]) => {
    const scores = { L1: 0, L2: 0, L3: 0 }
    ans.forEach(a => {
      if (a === 'a') scores.L1++
      else if (a === 'b') scores.L2++
      else if (a === 'c') scores.L3++
    })
    if (scores.L1 >= scores.L2 && scores.L1 >= scores.L3) return 'L1' as const
    if (scores.L2 >= scores.L1 && scores.L2 >= scores.L3) return 'L2' as const
    return 'L3' as const
  }, [])

  // 答题
  const handleAnswer = () => {
    if (!selectedOption) return
    const newAnswers = [...answers, selectedOption]
    setAnswers(newAnswers)
    setSelectedOption(null)

    if (quizIndex < 7) {
      setQuizIndex(quizIndex + 1)
    } else {
      const r = computeResult(newAnswers)
      setResult(r)
      setStage('result')
    }
  }

  // AI 对话推进
  const advanceChat = useCallback((optionText?: string) => {
    const step = chatStep
    const conv = AI_CONVERSATION

    if (step >= conv.length) return

    // 如果当前步骤是 AI 消息且有选项，用户选了一个
    if (optionText) {
      // 添加用户选择的消息
      setChatMessages(prev => [...prev, { role: 'user', text: optionText }])

      const nextStep = step + 2 // 跳过预设的 user 消息，到下一个 AI 消息
      setChatStep(nextStep)

      if (nextStep < conv.length) {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setChatMessages(prev => [...prev, conv[nextStep]])
        }, 1200 + Math.random() * 800)
      }
    }
  }, [chatStep])

  // 进入 AI 对话阶段时，显示第一条 AI 消息
  useEffect(() => {
    if (stage === 'ai_chat' && chatMessages.length === 0) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setChatMessages([AI_CONVERSATION[0]])
        setChatStep(0)
      }, 1000)
    }
  }, [stage, chatMessages.length])

  // 自动滚动到底
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isTyping])

  // ─── 页面壳 ──────────────────────────────────
  const pageStyle: React.CSSProperties = {
    minHeight: '100dvh',
    background: C.bg,
    color: C.white,
    fontFamily: FONT,
    position: 'relative',
    overflow: 'hidden',
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: 440,
    margin: '0 auto',
    padding: '0 24px',
    position: 'relative',
    zIndex: 1,
  }

  return (
    <div style={pageStyle}>
      <style>{KEYFRAMES}</style>
      <BgParticles />

      <AnimatePresence mode="wait">
        {stage === 'quiz' && (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} style={containerStyle}>
            <QuizStage
              question={QUESTIONS[quizIndex]}
              index={quizIndex}
              selectedOption={selectedOption}
              onSelect={setSelectedOption}
              onNext={handleAnswer}
            />
          </motion.div>
        )}

        {stage === 'result' && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={containerStyle}>
            <ResultStage result={RESULTS[result]} onContinue={() => setStage('paywall')} />
          </motion.div>
        )}

        {stage === 'paywall' && (
          <motion.div key="paywall" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={containerStyle}>
            <PaywallStage onContinue={() => setStage('course')} />
          </motion.div>
        )}

        {stage === 'course' && (
          <motion.div key="course" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} style={containerStyle}>
            <CourseStage
              card={COURSE_CARDS[cardIndex]}
              cardIndex={cardIndex}
              total={COURSE_CARDS.length}
              onNext={() => {
                if (cardIndex < COURSE_CARDS.length - 1) {
                  setCardIndex(cardIndex + 1)
                } else {
                  setStage('ai_chat')
                }
              }}
              onPrev={() => { if (cardIndex > 0) setCardIndex(cardIndex - 1) }}
              isLast={cardIndex === COURSE_CARDS.length - 1}
            />
          </motion.div>
        )}

        {stage === 'ai_chat' && (
          <motion.div key="ai_chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={containerStyle}>
            <AIChatStage
              messages={chatMessages}
              isTyping={isTyping}
              onSelectOption={advanceChat}
              chatEndRef={chatEndRef}
              isComplete={chatStep >= AI_CONVERSATION.length - 1 && !isTyping}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Stage: Quiz（Onboarding 8题测试）
// ═══════════════════════════════════════════════════════════════

function QuizStage({ question, index, selectedOption, onSelect, onNext }: {
  question: typeof QUESTIONS[0]
  index: number
  selectedOption: string | null
  onSelect: (v: string) => void
  onNext: () => void
}) {
  return (
    <div style={{ paddingTop: 60, paddingBottom: 40, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部标签 */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, letterSpacing: '0.12em', color: C.roseDim, textTransform: 'uppercase', fontWeight: 600 }}>
          {index === 0 ? '找到你的起点' : `第 ${index + 1} / 8 题`}
        </span>
      </div>

      <ProgressDots current={index} total={8} />

      {/* 问题 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35 }}
          style={{ flex: 1 }}
        >
          <h2 style={{
            fontSize: 20,
            fontWeight: 500,
            lineHeight: 1.6,
            color: C.white,
            marginBottom: 32,
            fontFamily: FONT_SERIF,
            textAlign: 'center',
            padding: '0 8px',
          }}>
            {question.q}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <OptionButton text={question.a} selected={selectedOption === 'a'} onClick={() => onSelect('a')} index={0} />
            <OptionButton text={question.b} selected={selectedOption === 'b'} onClick={() => onSelect('b')} index={1} />
            <OptionButton text={question.c} selected={selectedOption === 'c'} onClick={() => onSelect('c')} index={2} />
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: 'auto', paddingTop: 32 }}>
        <PrimaryButton
          label={index < 7 ? '下一题' : '查看结果'}
          onClick={onNext}
          disabled={!selectedOption}
        />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Stage: Result（结果页）
// ═══════════════════════════════════════════════════════════════

function ResultStage({ result, onContinue }: { result: typeof RESULTS.L1; onContinue: () => void }) {
  return (
    <div style={{ paddingTop: 80, paddingBottom: 40, minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* 呼吸光圈 */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.roseFaint} 0%, transparent 70%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'breatheGlow 4s ease-in-out infinite',
          marginBottom: 40,
        }}
      >
        <div style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.rose} 0%, transparent 80%)`,
          opacity: 0.6,
        }} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{ fontSize: 12, letterSpacing: '0.12em', color: C.roseDim, marginBottom: 12, textTransform: 'uppercase', fontWeight: 600 }}
      >
        当前更适合先进入
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: C.white,
          textAlign: 'center',
          lineHeight: 1.5,
          fontFamily: FONT_SERIF,
          marginBottom: 24,
          padding: '0 16px',
        }}
      >
        {result.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        style={{
          fontSize: 15,
          lineHeight: 1.8,
          color: C.mid,
          textAlign: 'center',
          maxWidth: 340,
          marginBottom: 48,
        }}
      >
        {result.desc}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        style={{ width: '100%', marginTop: 'auto' }}
      >
        <PrimaryButton label="开启我的路径" onClick={onContinue} />
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Stage: Paywall（B版方向付费墙 — 精简版）
// ═══════════════════════════════════════════════════════════════

function PaywallStage({ onContinue }: { onContinue: () => void }) {
  return (
    <div style={{ paddingTop: 60, paddingBottom: 40 }}>
      {/* 标签 */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <span style={{
          fontSize: 11,
          letterSpacing: '0.15em',
          color: C.gold,
          fontWeight: 600,
          textTransform: 'uppercase',
        }}>
          Love Ego AI
        </span>
      </div>

      {/* 主标题 */}
      <h1 style={{
        fontSize: 28,
        fontWeight: 600,
        lineHeight: 1.5,
        color: C.white,
        textAlign: 'center',
        fontFamily: FONT_SERIF,
        marginBottom: 16,
      }}>
        成为那个<br />
        <span style={{ color: C.rose }}>更有魅力、更有边界、<br />更能承接爱</span>的自己
      </h1>

      <p style={{
        fontSize: 14,
        lineHeight: 1.8,
        color: C.mid,
        textAlign: 'center',
        marginBottom: 40,
        padding: '0 12px',
      }}>
        不是教你留住谁，而是让爱可以进入你的生命——<br />
        不需要靠抓、靠证明、靠控制。
      </p>

      {/* 你将获得 */}
      <div style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: '28px 22px',
        marginBottom: 24,
      }}>
        <p style={{ fontSize: 12, letterSpacing: '0.1em', color: C.roseDim, marginBottom: 18, fontWeight: 600 }}>
          你将进入
        </p>
        {[
          '更高阶的女性身份感',
          '更稳定的 BEING 能量',
          '更强的魅力与极性吸引',
          '被深爱、被珍视、被稳定选择的能力',
          '身体是松的、打开的、有磁性的',
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            marginBottom: i < 4 ? 14 : 0,
          }}>
            <span style={{ color: C.rose, fontSize: 14, marginTop: 2, flexShrink: 0 }}>+</span>
            <span style={{ fontSize: 14, lineHeight: 1.6, color: C.white }}>{item}</span>
          </div>
        ))}
      </div>

      {/* 包含内容 */}
      <div style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: '28px 22px',
        marginBottom: 24,
      }}>
        <p style={{ fontSize: 12, letterSpacing: '0.1em', color: C.goldDim, marginBottom: 18, fontWeight: 600 }}>
          包含
        </p>
        {[
          { icon: '◎', text: '分层卡片课程（7层引导路径）', sub: '不是摘要，是一层层可代入的路径' },
          { icon: '◎', text: '专项 AI 教练', sub: '限制性信念 · Trigger · 身体感受 · 自我价值 · 关系模式' },
          { icon: '◎', text: '课后 AI 内化对话', sub: '把公共知识变成你自己的信念、身体和历史' },
          { icon: '◎', text: '录音 + 卡片双入口', sub: '适合你的方式学习' },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: i < 3 ? 18 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ color: C.gold, fontSize: 12 }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.white }}>{item.text}</span>
            </div>
            <p style={{ fontSize: 12, color: C.dim, marginLeft: 22, lineHeight: 1.5 }}>{item.sub}</p>
          </div>
        ))}
      </div>

      {/* 不是什么 */}
      <div style={{
        padding: '20px 22px',
        marginBottom: 32,
        borderLeft: `2px solid ${C.roseFaint}`,
      }}>
        <p style={{ fontSize: 13, color: C.dim, lineHeight: 1.8, fontStyle: 'italic' }}>
          这不是情感修复课，不是恋爱技巧，不是许愿池。<br />
          这是一套完整的女性身份感训练系统。
        </p>
      </div>

      {/* CTA */}
      <PrimaryButton label="开始体验课程 Demo" onClick={onContinue} />
      <p style={{ fontSize: 11, color: C.dim, textAlign: 'center', marginTop: 12 }}>
        以下是《限制性信念》课程的完整体验
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Stage: Course（限制性信念卡片课程）
// ═══════════════════════════════════════════════════════════════

function CourseStage({ card, cardIndex, total, onNext, onPrev, isLast }: {
  card: CourseCard
  cardIndex: number
  total: number
  onNext: () => void
  onPrev: () => void
  isLast: boolean
}) {
  // 计算当前层进度
  const layerCards = COURSE_CARDS.filter(c => c.layer === card.layer)
  const layerIndex = layerCards.indexOf(card)
  const layerTotal = layerCards.length

  return (
    <div style={{ paddingTop: 50, paddingBottom: 32, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部信息栏 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <LayerBadge layer={card.layer} />
        <span style={{ fontSize: 12, color: C.dim }}>
          {cardIndex + 1} / {total}
        </span>
      </div>

      {/* 层内进度条 */}
      <div style={{
        display: 'flex', gap: 3, marginBottom: 32,
      }}>
        {layerCards.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 2, borderRadius: 1,
            background: i <= layerIndex ? LAYER_COLORS[card.layer] : 'rgba(255,255,255,0.06)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* 卡片内容 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={cardIndex}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <h2 style={{
            fontSize: card.accent ? 22 : 19,
            fontWeight: 500,
            lineHeight: 1.6,
            color: card.accent ? C.white : C.white,
            fontFamily: FONT_SERIF,
            marginBottom: 24,
          }}>
            {card.title}
          </h2>

          <div style={{
            fontSize: 15,
            lineHeight: 2,
            color: card.accent ? 'rgba(253,248,250,0.9)' : C.mid,
            whiteSpace: 'pre-line',
            flex: 1,
          }}>
            {card.body}
          </div>

          {card.accent && (
            <div style={{
              width: 40,
              height: 2,
              background: `linear-gradient(90deg, ${LAYER_COLORS[card.layer]}, transparent)`,
              marginTop: 24,
              borderRadius: 1,
            }} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 底部导航 */}
      <div style={{ paddingTop: 24, display: 'flex', gap: 12 }}>
        {cardIndex > 0 && (
          <motion.button
            onClick={onPrev}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '14px 20px',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              color: C.mid,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: FONT,
            }}
          >
            上一张
          </motion.button>
        )}
        <div style={{ flex: 1 }}>
          <PrimaryButton
            label={isLast ? '进入 AI 对话' : '继续'}
            onClick={onNext}
          />
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Stage: AI Chat（限制性信念 AI 对话）
// ═══════════════════════════════════════════════════════════════

function AIChatStage({ messages, isTyping, onSelectOption, chatEndRef, isComplete }: {
  messages: ChatMessage[]
  isTyping: boolean
  onSelectOption: (text: string) => void
  chatEndRef: React.RefObject<HTMLDivElement | null>
  isComplete: boolean
}) {
  const lastAiMessage = messages.filter(m => m.role === 'ai').pop()
  const hasOptions = lastAiMessage?.options && !isTyping && !isComplete

  return (
    <div style={{ paddingTop: 50, paddingBottom: 32, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* 头部 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28,
        paddingBottom: 18, borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.roseFaint}, rgba(178,140,210,0.15))`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>
          <span style={{ opacity: 0.7 }}>&#10047;</span>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 2 }}>限制性信念 AI</p>
          <p style={{ fontSize: 11, color: C.dim }}>课后内化 · 概念私人化</p>
        </div>
      </div>

      {/* 对话区 */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 16,
            }}
          >
            <div style={{
              maxWidth: '85%',
              padding: '14px 18px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user'
                ? 'rgba(212,160,176,0.15)'
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${msg.role === 'user' ? 'rgba(212,160,176,0.2)' : C.border}`,
              fontSize: 14,
              lineHeight: 1.8,
              color: msg.role === 'user' ? C.white : C.mid,
              whiteSpace: 'pre-line',
            }}>
              {msg.text}
            </div>
          </motion.div>
        ))}

        {/* 打字指示 */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: 6, padding: '12px 18px' }}
          >
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: C.roseDim,
                animation: `typing 1.2s ${i * 0.2}s ease-in-out infinite`,
              }} />
            ))}
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 选项按钮 */}
      {hasOptions && lastAiMessage?.options && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 12 }}
        >
          {lastAiMessage.options.map((opt, i) => (
            <motion.button
              key={i}
              onClick={() => onSelectOption(opt)}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '13px 16px',
                background: 'rgba(212,160,176,0.06)',
                border: `1px solid rgba(212,160,176,0.15)`,
                borderRadius: 12,
                fontSize: 13.5,
                lineHeight: 1.5,
                color: C.roseLight,
                cursor: 'pointer',
                fontFamily: FONT,
              }}
            >
              {opt}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* 完成状态 */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', paddingTop: 24 }}
        >
          <div style={{
            width: 48, height: 2, borderRadius: 1, margin: '0 auto 16px',
            background: `linear-gradient(90deg, transparent, ${C.rose}, transparent)`,
          }} />
          <p style={{ fontSize: 13, color: C.dim, lineHeight: 1.7 }}>
            这是完整的卡片课程 + AI 对话体验
          </p>
          <p style={{ fontSize: 12, color: C.dim, marginTop: 4, opacity: 0.6 }}>
            Love Ego AI · Demo
          </p>
        </motion.div>
      )}
    </div>
  )
}
