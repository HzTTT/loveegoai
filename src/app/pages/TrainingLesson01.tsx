import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router'
import { BreathBall } from '../../components/training/BreathBall'
import { CountdownRing } from '../../components/training/CountdownRing'
import { BodyMap } from '../../components/training/BodyMap'

// ─── 色系 ────────────────────────────────────────
const C = {
  bg: '#1C1917',
  gold: '#c4a882',
  goldLight: 'rgba(196,168,130,0.12)',
  goldBorder: 'rgba(196,168,130,0.2)',
  white: '#FAFAF9',
  mid: '#A8A29E',
  dim: '#78716C',
}

// ─── 关卡步骤定义 ─────────────────────────────────
type Step = 0 | 1 | 2 | 3 | 4 | 5

const TOTAL_STEPS = 6

// ─── 情境判断题内容 ───────────────────────────────
const CONTEXT_CHOICES = [
  {
    situation: '你发信息给朋友，对方两个小时没回。',
    options: [
      { id: 'a', text: '他是不是不喜欢我了', type: 'brain', label: '头脑故事' },
      { id: 'b', text: '胸口有点沉，喉咙有点紧', type: 'body', label: '身体信号' },
      { id: 'c', text: '我肯定做错了什么', type: 'brain', label: '头脑故事' },
    ],
    correct: 'b',
    answer: '「胸口有点沉，喉咙有点紧」是身体信号。\n另外两句是头脑已经开始讲故事了。',
  },
]

// ─── 触发标签 ─────────────────────────────────────
const TRIGGER_TAGS = [
  '被忽视', '不被理解', '不够好', '被评判', '失控感',
  '不被重视', '独自承担', '被否定', '不安全', '孤独',
]

// ─── 工具函数 ─────────────────────────────────────
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 32 }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i === current ? 20 : 6, background: i <= current ? C.gold : 'rgba(255,255,255,0.15)' }}
          transition={{ duration: 0.3 }}
          style={{ height: 6, borderRadius: 3 }}
        />
      ))}
    </div>
  )
}

function NextButton({ onClick, label = '继续', disabled = false }: { onClick: () => void; label?: string; disabled?: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      style={{
        width: '100%', padding: '16px 0',
        background: disabled ? 'rgba(196,168,130,0.15)' : C.gold,
        border: 'none', borderRadius: 16,
        fontSize: 15, fontWeight: 500,
        color: disabled ? 'rgba(196,168,130,0.4)' : '#1C1917',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.3s',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </motion.button>
  )
}

// ─── 步骤页面 ─────────────────────────────────────

// Step 0: 微讲解卡片
function StepIntro({ onNext }: { onNext: () => void }) {
  const [cardIdx, setCardIdx] = useState(0)
  const cards = [
    { text: '旧程序会比理智更快启动。', sub: '身体通常先进入收缩，意识才跟上。' },
    { text: '先识别，再反应。', sub: '这一步，就能让你从自动驾驶里出来一秒。' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepDots current={0} total={TOTAL_STEPS} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '0 8px' }}>
        <p style={{ fontSize: 10, color: C.gold, letterSpacing: 3 }}>关卡 01 · 识别旧程序</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={cardIdx}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            style={{
              background: C.goldLight, border: `1px solid ${C.goldBorder}`,
              borderRadius: 20, padding: '32px 28px', textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 22, fontWeight: 300, color: C.white, lineHeight: 1.5, marginBottom: 12 }}>{cards[cardIdx].text}</p>
            <p style={{ fontSize: 13, color: C.mid, lineHeight: 1.6 }}>{cards[cardIdx].sub}</p>
          </motion.div>
        </AnimatePresence>
        {cardIdx < cards.length - 1 ? (
          <NextButton onClick={() => setCardIdx(i => i + 1)} label="下一句" />
        ) : (
          <NextButton onClick={onNext} label="开始练习" />
        )}
      </div>
    </div>
  )
}

// Step 1: 身体感知 — 点击紧绷部位
function StepBodyScan({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<string[]>([])
  function toggle(id: string) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepDots current={1} total={TOTAL_STEPS} />
      <p style={{ fontSize: 16, fontWeight: 300, color: C.white, textAlign: 'center', lineHeight: 1.5, marginBottom: 8 }}>
        回想一个最近让身体<br />瞬间<span style={{ color: C.gold }}>紧起来</span>的时刻
      </p>
      <p style={{ fontSize: 12, color: C.mid, textAlign: 'center', marginBottom: 16 }}>点击最先收紧的部位</p>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BodyMap selected={selected} onToggle={toggle} />
      </div>
      <NextButton onClick={onNext} label={selected.length > 0 ? '我标记好了' : '跳过这步'} />
    </div>
  )
}

// Step 2: 情境判断题
function StepContextChoice({ onNext }: { onNext: () => void }) {
  const [chosen, setChosen] = useState<string | null>(null)
  const q = CONTEXT_CHOICES[0]
  const isCorrect = chosen === q.correct
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepDots current={2} total={TOTAL_STEPS} />
      <p style={{ fontSize: 13, color: C.mid, marginBottom: 12 }}>哪一句是身体信号？</p>
      <div style={{
        background: C.goldLight, border: `1px solid ${C.goldBorder}`,
        borderRadius: 14, padding: '14px 16px', marginBottom: 20,
        fontSize: 14, color: C.white, lineHeight: 1.6,
      }}>
        {q.situation}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {q.options.map(opt => {
          const isChosen = chosen === opt.id
          const showResult = chosen !== null
          const correct = opt.id === q.correct
          return (
            <motion.div
              key={opt.id}
              onClick={() => !chosen && setChosen(opt.id)}
              whileTap={{ scale: chosen ? 1 : 0.98 }}
              animate={{
                background: showResult && correct
                  ? 'rgba(196,168,130,0.2)'
                  : showResult && isChosen && !correct
                  ? 'rgba(168,162,158,0.1)'
                  : isChosen ? C.goldLight : 'rgba(255,255,255,0.04)',
                borderColor: showResult && correct ? C.gold : 'rgba(255,255,255,0.08)',
              }}
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '14px 16px',
                cursor: chosen ? 'default' : 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 14, color: C.white, lineHeight: 1.5 }}>{opt.text}</span>
              {showResult && correct && <span style={{ fontSize: 16, color: C.gold }}>✓</span>}
            </motion.div>
          )
        })}
      </div>
      <AnimatePresence>
        {chosen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: C.goldLight, borderLeft: `2px solid ${C.gold}`,
              borderRadius: '0 8px 8px 0', padding: '12px 14px',
              fontSize: 12, color: C.mid, lineHeight: 1.7, marginBottom: 16,
              whiteSpace: 'pre-line' as const,
            }}
          >
            {q.answer}
          </motion.div>
        )}
      </AnimatePresence>
      <NextButton onClick={onNext} disabled={!chosen} label="继续" />
    </div>
  )
}

// Step 3: 即时停顿 — 呼吸球 15 秒
function StepBreath({ onNext }: { onNext: () => void }) {
  type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'idle'
  const [phase, setPhase] = useState<BreathPhase>('idle')
  const [round, setRound] = useState(0)
  const [done, setDone] = useState(false)
  const ROUNDS = 3
  const phaseRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runCycle = useCallback(() => {
    setPhase('inhale')
    phaseRef.current = setTimeout(() => {
      setPhase('hold')
      phaseRef.current = setTimeout(() => {
        setPhase('exhale')
        phaseRef.current = setTimeout(() => {
          setRound(r => {
            const next = r + 1
            if (next >= ROUNDS) { setDone(true); setPhase('idle'); return next }
            runCycle()
            return next
          })
        }, 6000)
      }, 1000)
    }, 4000)
  }, [])

  useEffect(() => {
    const t = setTimeout(runCycle, 800)
    return () => { clearTimeout(t); if (phaseRef.current) clearTimeout(phaseRef.current) }
  }, [runCycle])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepDots current={3} total={TOTAL_STEPS} />
      <p style={{ fontSize: 16, fontWeight: 300, color: C.white, textAlign: 'center', marginBottom: 6 }}>
        先不要解释，<br />先跟着呼吸
      </p>
      <p style={{ fontSize: 12, color: C.mid, textAlign: 'center', marginBottom: 8 }}>
        {done ? '完成了' : `第 ${round + 1} / ${ROUNDS} 轮`}
      </p>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BreathBall phase={phase} size={110} />
      </div>
      <NextButton onClick={onNext} disabled={!done} label={done ? '继续' : '请先完成呼吸练习'} />
    </div>
  )
}

// Step 4: 带走一句中断语
function StepInterruptPhrase({ onNext }: { onNext: () => void }) {
  const phrases = [
    '这是旧程序，不是真相。',
    '我先回到身体。',
    '这只是收缩，不代表现实。',
  ]
  const [chosen, setChosen] = useState<number | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepDots current={4} total={TOTAL_STEPS} />
      <p style={{ fontSize: 16, fontWeight: 300, color: C.white, marginBottom: 6, lineHeight: 1.5 }}>
        带走一句<span style={{ color: C.gold }}>中断语</span>
      </p>
      <p style={{ fontSize: 12, color: C.mid, marginBottom: 20 }}>下次旧程序启动时，对自己说这句话</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {phrases.map((p, i) => (
          <motion.div
            key={i}
            onClick={() => setChosen(i)}
            whileTap={{ scale: 0.97 }}
            animate={{
              background: chosen === i ? C.goldLight : 'rgba(255,255,255,0.04)',
              borderColor: chosen === i ? C.gold : 'rgba(255,255,255,0.08)',
              scale: chosen === i ? 1.02 : 1,
            }}
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '18px 20px',
              cursor: 'pointer',
            }}
          >
            <p style={{ fontSize: 15, color: C.white, lineHeight: 1.5 }}>「{p}」</p>
          </motion.div>
        ))}
      </div>
      <NextButton onClick={onNext} disabled={chosen === null} label="选好了" />
    </div>
  )
}

// Step 5: 现实映射记录
function StepRecord({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<string[]>([])
  function toggle(tag: string) {
    setSelected(s => s.includes(tag) ? s.filter(x => x !== tag) : [...s, tag])
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepDots current={5} total={TOTAL_STEPS} />
      <p style={{ fontSize: 16, fontWeight: 300, color: C.white, marginBottom: 6, lineHeight: 1.5 }}>
        今天最容易启动旧程序的<br />是哪种场景？
      </p>
      <p style={{ fontSize: 12, color: C.mid, marginBottom: 20 }}>可以多选</p>
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' as const, gap: 10, alignContent: 'flex-start' }}>
        {TRIGGER_TAGS.map(tag => {
          const on = selected.includes(tag)
          return (
            <motion.div
              key={tag}
              onClick={() => toggle(tag)}
              whileTap={{ scale: 0.94 }}
              animate={{
                background: on ? C.gold : 'rgba(255,255,255,0.05)',
                color: on ? '#1C1917' : C.mid,
              }}
              style={{
                padding: '8px 16px', borderRadius: 20,
                border: `1px solid ${on ? C.gold : 'rgba(255,255,255,0.1)'}`,
                fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {tag}
            </motion.div>
          )
        })}
      </div>
      <NextButton onClick={onComplete} label={selected.length > 0 ? '完成这一关' : '暂时跳过'} />
    </div>
  )
}

// ─── 完成页 ───────────────────────────────────────
function CompletionScreen() {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 20, padding: '0 32px', textAlign: 'center',
      }}
    >
      <motion.div
        animate={{ scale: [0.9, 1.1, 1] }}
        transition={{ duration: 0.6 }}
        style={{
          width: 72, height: 72, borderRadius: '50%',
          background: C.goldLight, border: `2px solid ${C.gold}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}
      >
        ✓
      </motion.div>
      <div>
        <p style={{ fontSize: 22, fontWeight: 300, color: C.white, lineHeight: 1.5, marginBottom: 8 }}>
          关卡完成了
        </p>
        <p style={{ fontSize: 14, color: C.mid, lineHeight: 1.7 }}>
          识别旧程序启动<br />
          是改变的第一步。
        </p>
      </div>
      <motion.button
        onClick={() => navigate('/home')}
        whileTap={{ scale: 0.96 }}
        style={{
          width: '100%', padding: '16px 0',
          background: C.gold, border: 'none', borderRadius: 16,
          fontSize: 15, fontWeight: 500, color: '#1C1917',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        回到首页
      </motion.button>
    </motion.div>
  )
}

// ─── 主页面 ───────────────────────────────────────
export default function TrainingLesson01() {
  const [step, setStep] = useState<Step>(0)
  const [complete, setComplete] = useState(false)

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1) as Step)

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: `linear-gradient(170deg, ${C.bg} 0%, #231f1c 60%, ${C.bg} 100%)`,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
      color: C.white,
    }}>
      {/* 顶栏 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '52px 28px 16px',
      }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(196,168,130,0.4)' }}>LOVE EGO AI</p>
        <p style={{ fontSize: 11, color: C.dim }}>关卡 01 / 20</p>
      </div>

      {/* 内容区 */}
      <div style={{ flex: 1, padding: '16px 28px 40px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {complete ? (
            <CompletionScreen key="complete" />
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              {step === 0 && <StepIntro onNext={next} />}
              {step === 1 && <StepBodyScan onNext={next} />}
              {step === 2 && <StepContextChoice onNext={next} />}
              {step === 3 && <StepBreath onNext={next} />}
              {step === 4 && <StepInterruptPhrase onNext={next} />}
              {step === 5 && <StepRecord onComplete={() => setComplete(true)} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
