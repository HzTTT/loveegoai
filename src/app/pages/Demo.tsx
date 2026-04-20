import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#160F14',
  rose: '#D4A0B0',
  gold: '#C9A87C',
  white: '#FDF8FA',
  roseDim: 'rgba(212,160,176,0.45)',
  roseFaint: 'rgba(212,160,176,0.10)',
  border: 'rgba(212,160,176,0.18)',
  borderStrong: 'rgba(212,160,176,0.35)',
  mid: '#B8A8B2',
  dim: '#6B5A64',
}
const FONT = "'PingFang SC', system-ui, sans-serif"

// ─── Quiz data ─────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    q: 'Q1. 如果亲密关系真的变好了，最想先感受到什么？',
    options: [
      'A. 被坚定选择、被爱、被确认',
      'B. 更有魅力、更有吸引力、更像女人',
      'C. 更高质量的爱，同时不失去自己的节奏和人生',
    ],
  },
  {
    q: 'Q2. 当对方突然冷下来时，第一反应更像哪一种？',
    options: [
      'A. 很慌，想立刻确认关系有没有问题',
      'B. 脑子会开始分析，但身体其实也会紧',
      'C. 能看见自己被触发了，但想知道怎么更高级地回应',
    ],
  },
  {
    q: 'Q3. 哪句话更像现在的自己？',
    options: [
      'A. 如果有一段好的关系，很多问题都会好起来',
      'B. 我其实很能干，但我不够有吸引力',
      'C. 我已经明白很多了，现在更想把内在稳定变成现实结果',
    ],
  },
  {
    q: 'Q4. 现在最想先改善的是什么？',
    options: [
      'A. 不再一被忽视就崩',
      'B. 提升自己的女性魅力和性感',
      'C. 让爱和成就都更上一层楼',
    ],
  },
  {
    q: 'Q5. 在关系里，最常见的困扰是什么？',
    options: [
      'A. 总怕失去、怕不被爱、怕被抛下',
      'B. 明明很优秀，但就是没有那种柔软和吸引力',
      'C. 已经不太执着于被爱，但想知道怎么进入更高质量的关系',
    ],
  },
  {
    q: 'Q6. 更像哪种状态？',
    options: [
      'A. 很容易被对方带走',
      'B. 很容易活在头脑里',
      'C. 已经能稳定很多，但想活出更大版本的自己',
    ],
  },
  {
    q: 'Q7. 哪句话最刺到你？',
    options: [
      'A. 安全感不是通过绑定一个人得到的',
      'B. 魅力不是技巧，是身体在场',
      'C. 更高阶段的问题，不需要在旧层级里解决',
    ],
  },
  {
    q: 'Q8. 现在更需要哪种帮助？',
    options: [
      'A. 帮我稳住自己，不要总在关系里失控',
      'B. 帮我从头脑回到身体，提升女性能量',
      'C. 帮我把觉知真正带进关系、财富和现实创造',
    ],
  },
]

// ─── Cards data ────────────────────────────────────────────────────────────────
const CARDS = [
  {
    title: '为什么你知道很多，生活还是没变？',
    body: '因为问题不只是认知。你一直相信某些旧声音。这节课，要做的不是安慰自己——而是找出那句旧声音。',
    layer: '开场层',
  },
  {
    title: '限制性信念不是事实，是被重复太久的想法。',
    body: '它通常来自早年经验、父母价值观、环境评价。它会进入身体，而不只是停留在头脑。',
    layer: '概念层',
  },
  {
    title: '它是怎么影响你现实的？',
    body: '一条信念 → 决定你怎么看一件事 → 带来身体收缩 → 带来熟悉情绪 → 带来熟悉反应 → 制造同样的现实。这就是闭环。',
    layer: '运作机制层',
  },
  {
    title: '这些是你的吗？',
    body: '「如果他冷下来，就说明我不重要。」「如果我不够好，就不会被爱。」「如果我停下来，我就会落后。」',
    layer: '生活场景层',
  },
  {
    title: '当那句信念启动时，身体最先哪里紧？',
    body: '胸口？喉咙？胃？肩膀？身体收缩不是结论，而是入口。真正的限制性信念，不只是在脑子里——而是在身体里活着。',
    layer: '身体识别层',
  },
  {
    title: '你已经知道什么是限制性信念了。',
    body: '现在，不用急着改变这条旧声音。先让 AI 带你找到：它在你的人生里，最像哪一句。',
    layer: '过渡层',
    cta: '让她带我找出来',
  },
]

// ─── AI chat messages ──────────────────────────────────────────────────────────
const AI_MESSAGES = [
  '刚刚这节课里，哪一句最像你一直活在里面的那句话？不用说很多，先用一句自己的话说出来。',
  '如果把它翻成一句你一直相信的话，它更像什么？',
  '这更像谁的声音？不用很确定，第一直觉就好。',
  '当你说出这句话的时候，身体最先哪里紧了？',
  '今天不用推翻它。先带走一句新的话：「这是一条旧声音，不是全部的我。」',
]

// ─── Result configs ────────────────────────────────────────────────────────────
const RESULTS = {
  L1: {
    title: '当前更适合先进入：安全感与关系稳定路径',
    desc: '你现在最需要的，不是更会爱别人，而是先不再把自己的安全感完全交给关系。',
  },
  L2: {
    title: '当前更适合先进入：女性能量与魅力恢复路径',
    desc: '你已经有现实层面的能力，接下来最值得打开的，是身体、感受和磁性魅力。',
  },
  L3: {
    title: '当前更适合先进入：高阶关系与现实整合路径',
    desc: '你已经不再停留在基础依附和防御层，接下来更适合进入爱、成就和生命表达的整合训练。',
  },
}

// ─── Types ─────────────────────────────────────────────────────────────────────
type Phase = 'quiz' | 'result' | 'paywall' | 'cards' | 'chat'
type Level = 'L1' | 'L2' | 'L3'

// ─── Sub-components ────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 2,
            background: i <= current ? C.rose : C.roseFaint,
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  )
}

function QuizPhase({
  onComplete,
}: {
  onComplete: (level: Level) => void
}) {
  const [current, setCurrent] = useState(0)
  const [scores, setScores] = useState({ L1: 0, L2: 0, L3: 0 })

  function handleAnswer(idx: number) {
    const next = { ...scores }
    if (idx === 0) next.L1 += 1
    else if (idx === 1) next.L2 += 1
    else next.L3 += 1

    if (current + 1 >= QUESTIONS.length) {
      // determine level
      const max = Math.max(next.L1, next.L2, next.L3)
      let level: Level = 'L1'
      if (next.L1 === max) level = 'L1'
      else if (next.L2 === max) level = 'L2'
      else level = 'L3'
      onComplete(level)
    } else {
      setScores(next)
      setCurrent(c => c + 1)
    }
  }

  const q = QUESTIONS[current]

  return (
    <motion.div
      key={current}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      style={{ padding: '0 24px' }}
    >
      <div style={{ marginBottom: 28 }}>
        <ProgressBar current={current} total={QUESTIONS.length} />
        <div style={{ color: C.dim, fontSize: 12, marginTop: 6 }}>
          {current + 1} / {QUESTIONS.length}
        </div>
      </div>

      <div
        style={{
          fontSize: 17,
          fontWeight: 500,
          color: C.white,
          lineHeight: 1.65,
          marginBottom: 32,
          letterSpacing: 0.2,
        }}
      >
        {q.q}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {q.options.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleAnswer(i)}
            style={{
              background: 'transparent',
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: '16px 20px',
              color: C.mid,
              fontSize: 15,
              lineHeight: 1.6,
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: FONT,
              letterSpacing: 0.1,
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                C.rose
              ;(e.currentTarget as HTMLButtonElement).style.color = C.white
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                C.border
              ;(e.currentTarget as HTMLButtonElement).style.color = C.mid
            }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

function ResultPhase({
  level,
  onNext,
}: {
  level: Level
  onNext: () => void
}) {
  const r = RESULTS[level]
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '0 24px', textAlign: 'center' }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: 3,
          color: C.gold,
          marginBottom: 24,
          textTransform: 'uppercase',
        }}
      >
        测试结果
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: C.white,
          lineHeight: 1.6,
          marginBottom: 24,
        }}
      >
        {r.title}
      </div>
      <div
        style={{
          fontSize: 15,
          color: C.mid,
          lineHeight: 1.75,
          marginBottom: 48,
          maxWidth: 320,
          margin: '0 auto 48px',
        }}
      >
        {r.desc}
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        style={{
          background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`,
          border: 'none',
          borderRadius: 50,
          padding: '16px 48px',
          color: '#160F14',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: FONT,
          letterSpacing: 0.5,
        }}
      >
        了解如何开始
      </motion.button>
    </motion.div>
  )
}

function PaywallPhase({ onNext }: { onNext: () => void }) {
  const points = [
    '被深爱，被珍视，被稳定选择',
    '有浪漫、有忠诚、有支持',
    '身体是松的、打开的、有磁性的',
    '爱可以进入生命，不需要靠抓、靠证明、靠控制',
    '女王意识 · 女性能量 · 极性吸引',
    '更高阶的女性身份感，以及由此带来的被爱能力',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '0 24px' }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: C.white,
          lineHeight: 1.55,
          marginBottom: 16,
          textAlign: 'center',
        }}
      >
        不是教你留住谁，
        <br />
        而是让你成为那个被深爱的自己。
      </div>
      <div
        style={{
          fontSize: 15,
          color: C.rose,
          textAlign: 'center',
          marginBottom: 36,
          lineHeight: 1.6,
        }}
      >
        更有魅力、更有边界、更能承接爱。
      </div>

      <div
        style={{
          background: 'rgba(212,160,176,0.06)',
          border: `1px solid ${C.border}`,
          borderRadius: 18,
          padding: '24px 20px',
          marginBottom: 32,
        }}
      >
        {points.map((p, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              marginBottom: i < points.length - 1 ? 16 : 0,
            }}
          >
            <span style={{ color: C.gold, marginTop: 2, flexShrink: 0 }}>
              —
            </span>
            <span style={{ color: C.mid, fontSize: 14, lineHeight: 1.7 }}>
              {p}
            </span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: C.dim, marginBottom: 6 }}>
          完整课程
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: C.gold,
            letterSpacing: 1,
          }}
        >
          ¥3,888
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        style={{
          width: '100%',
          background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`,
          border: 'none',
          borderRadius: 50,
          padding: '17px 0',
          color: '#160F14',
          fontSize: 17,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: FONT,
          letterSpacing: 0.5,
        }}
      >
        进入体验 Demo
      </motion.button>
    </motion.div>
  )
}

function CardsPhase({ onNext }: { onNext: () => void }) {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)

  function go(d: number) {
    const next = idx + d
    if (next < 0 || next >= CARDS.length) return
    setDir(d)
    setIdx(next)
  }

  const card = CARDS[idx]
  const isLast = idx === CARDS.length - 1

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <ProgressBar current={idx} total={CARDS.length} />
        <div style={{ color: C.dim, fontSize: 12, marginTop: 6 }}>
          {idx + 1} / {CARDS.length}
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          minHeight: 340,
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
            style={{
              background: 'rgba(212,160,176,0.06)',
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: '32px 24px',
              minHeight: 300,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: C.gold,
                  letterSpacing: 2,
                  marginBottom: 18,
                  textTransform: 'uppercase',
                }}
              >
                {card.layer}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: C.white,
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: C.mid,
                  lineHeight: 1.8,
                }}
              >
                {card.body}
              </div>
            </div>

            {isLast && card.cta && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onNext}
                style={{
                  marginTop: 28,
                  background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`,
                  border: 'none',
                  borderRadius: 50,
                  padding: '14px 32px',
                  color: '#160F14',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  alignSelf: 'center',
                  letterSpacing: 0.3,
                }}
              >
                {card.cta}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 20,
          gap: 12,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => go(-1)}
          disabled={idx === 0}
          style={{
            flex: 1,
            padding: '12px 0',
            background: 'transparent',
            border: `1px solid ${idx === 0 ? 'rgba(212,160,176,0.08)' : C.border}`,
            borderRadius: 50,
            color: idx === 0 ? C.dim : C.mid,
            fontSize: 14,
            cursor: idx === 0 ? 'default' : 'pointer',
            fontFamily: FONT,
          }}
        >
          上一张
        </motion.button>
        {!isLast && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => go(1)}
            style={{
              flex: 1,
              padding: '12px 0',
              background: C.roseFaint,
              border: `1px solid ${C.border}`,
              borderRadius: 50,
              color: C.rose,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: FONT,
            }}
          >
            下一张
          </motion.button>
        )}
      </div>
    </div>
  )
}

function ChatPhase({ onDone }: { onDone: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showPause, setShowPause] = useState(false)
  const [done, setDone] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let step = 0

    function next() {
      if (step >= AI_MESSAGES.length) {
        setDone(true)
        return
      }
      setVisibleCount(step + 1)
      step++

      if (step < AI_MESSAGES.length) {
        setShowPause(true)
        timerRef.current = setTimeout(() => {
          setShowPause(false)
          timerRef.current = setTimeout(next, 400)
        }, 2000)
      } else {
        setDone(true)
      }
    }

    timerRef.current = setTimeout(next, 600)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '0 24px' }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: 3,
          color: C.gold,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        AI 对话
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AnimatePresence>
          {AI_MESSAGES.slice(0, visibleCount).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'rgba(212,160,176,0.07)',
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: '16px 20px',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: C.gold,
                  marginBottom: 8,
                  letterSpacing: 1,
                }}
              >
                AI
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: C.white,
                  lineHeight: 1.75,
                }}
              >
                {msg}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {showPause && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 4px',
            }}
          >
            <div style={{ fontSize: 13, color: C.dim }}>正在感受</div>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.25,
                }}
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: C.roseDim,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: 36, textAlign: 'center' }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onDone}
            style={{
              background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`,
              border: 'none',
              borderRadius: 50,
              padding: '16px 32px',
              color: '#160F14',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: FONT,
              letterSpacing: 0.3,
            }}
          >
            Demo 已完成 · 开始你的真实旅程
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Demo() {
  const [phase, setPhase] = useState<Phase>('quiz')
  const [level, setLevel] = useState<Level>('L1')

  function handleQuizComplete(l: Level) {
    setLevel(l)
    setPhase('result')
  }

  return (
    <div
      translate="no"
      style={{
        minHeight: '100vh',
        background: C.bg,
        color: C.white,
        fontFamily: FONT,
        overflowX: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,160,176,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 480,
          margin: '0 auto',
          paddingTop: 60,
          paddingBottom: 60,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40, padding: '0 24px' }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 4,
              color: C.gold,
              marginBottom: 10,
              textTransform: 'uppercase',
            }}
          >
            LoveEgo · 亲密关系探索
          </div>
          {phase === 'quiz' && (
            <div style={{ fontSize: 13, color: C.dim }}>
              8道题，找到你现在的方向
            </div>
          )}
          {phase === 'paywall' && (
            <div style={{ fontSize: 13, color: C.dim }}>
              女王意识 · 女性能量 · 极性吸引
            </div>
          )}
          {phase === 'cards' && (
            <div style={{ fontSize: 13, color: C.dim }}>
              限制性信念 · 卡片课程
            </div>
          )}
          {phase === 'chat' && (
            <div style={{ fontSize: 13, color: C.dim }}>
              AI 引导体验
            </div>
          )}
        </div>

        {/* Phase content */}
        <AnimatePresence mode="wait">
          {phase === 'quiz' && (
            <motion.div key="quiz">
              <QuizPhase onComplete={handleQuizComplete} />
            </motion.div>
          )}
          {phase === 'result' && (
            <motion.div key="result">
              <ResultPhase level={level} onNext={() => setPhase('paywall')} />
            </motion.div>
          )}
          {phase === 'paywall' && (
            <motion.div key="paywall">
              <PaywallPhase onNext={() => setPhase('cards')} />
            </motion.div>
          )}
          {phase === 'cards' && (
            <motion.div key="cards">
              <CardsPhase onNext={() => setPhase('chat')} />
            </motion.div>
          )}
          {phase === 'chat' && (
            <motion.div key="chat">
              <ChatPhase onDone={() => setPhase('quiz')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
