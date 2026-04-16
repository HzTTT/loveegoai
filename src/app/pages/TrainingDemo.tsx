import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BreathBall } from '../../components/training/BreathBall'
import { BodyMap } from '../../components/training/BodyMap'
import { CountdownRing } from '../../components/training/CountdownRing'
import { ContractionExpansion } from '../../components/training/ContractionExpansion'

type Step = 0 | 1 | 2 | 3 | 4

const STEP_TITLES = [
  '欢迎',
  '身体感知',
  '停顿练习',
  '身体状态',
  '呼吸练习',
]

export default function TrainingDemo() {
  const [step, setStep] = useState<Step>(0)

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1C1917 0%, #292524 100%)',
      color: '#FAFAF9',
      fontFamily: "'Noto Sans SC', sans-serif",
      overflow: 'hidden',
    }}>
      {/* 顶部进度条 */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
        padding: '52px 20px 12px',
        background: 'linear-gradient(180deg, rgba(28,25,23,0.95) 60%, transparent)',
      }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              animate={{
                background: i <= step ? '#C4A882' : 'rgba(196,168,130,0.15)',
              }}
              style={{ flex: 1, height: 3, borderRadius: 2 }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(168,162,158,0.5)', letterSpacing: 2 }}>
            {STEP_TITLES[step]}
          </span>
          <span style={{ fontSize: 11, color: 'rgba(168,162,158,0.3)' }}>
            {step + 1} / 5
          </span>
        </div>
      </div>

      {/* 内容区 */}
      <div style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {step === 0 && <WelcomeStep key="welcome" onNext={() => setStep(1)} />}
          {step === 1 && <BodyStep key="body" onNext={() => setStep(2)} />}
          {step === 2 && <CountdownStep key="countdown" onNext={() => setStep(3)} />}
          {step === 3 && <StateStep key="state" onNext={() => setStep(4)} />}
          {step === 4 && <BreathStep key="breath" onNext={() => setStep(0)} />}
        </AnimatePresence>
      </div>

      {/* 底部步骤指示 */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '20px',
        background: 'linear-gradient(0deg, rgba(28,25,23,0.95) 60%, transparent)',
        display: 'flex', justifyContent: 'center', gap: 8,
      }}>
        {[0, 1, 2, 3, 4].map(i => (
          <button
            key={i}
            onClick={() => setStep(i as Step)}
            style={{
              width: 36, height: 36,
              borderRadius: '50%',
              border: `1.5px solid ${i === step ? '#C4A882' : 'rgba(196,168,130,0.15)'}`,
              background: i === step ? 'rgba(196,168,130,0.15)' : 'transparent',
              color: i === step ? '#C4A882' : 'rgba(168,162,158,0.4)',
              fontSize: 12, fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Step 0: Welcome ─── */
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <StepWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{ textAlign: 'center', padding: '0 32px' }}
      >
        <div style={{ fontSize: 40, marginBottom: 24 }}>🐨</div>
        <h1 style={{
          fontSize: 22, fontWeight: 600, marginBottom: 12,
          fontFamily: "'Noto Serif SC', serif", color: '#FAFAF9',
        }}>
          识别旧程序启动
        </h1>
        <p style={{
          fontSize: 14, lineHeight: 2, color: 'rgba(168,162,158,0.7)',
          marginBottom: 8,
        }}>
          这个练习帮你觉察——<br />
          身体在你反应之前，已经做了什么。
        </p>
        <p style={{
          fontSize: 12, color: 'rgba(196,168,130,0.5)', letterSpacing: 1,
          marginBottom: 32,
        }}>
          大约 3 分钟 · 4 个步骤
        </p>
        <NextButton onClick={onNext} label="开始练习" />
      </motion.div>
    </StepWrapper>
  )
}

/* ─── Step 1: Body Map ─── */
function BodyStep({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<string[]>([])

  const handleToggle = useCallback((id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }, [])

  return (
    <StepWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{ textAlign: 'center', padding: '0 20px' }}
      >
        <p style={{
          fontSize: 15, fontWeight: 500, color: '#FAFAF9',
          marginBottom: 4, fontFamily: "'Noto Serif SC', serif",
        }}>
          感受你的身体
        </p>
        <p style={{ fontSize: 12, color: 'rgba(168,162,158,0.5)', marginBottom: 20, letterSpacing: 1 }}>
          点击有感觉的部位
        </p>

        <BodyMap
          selected={selected}
          onToggle={handleToggle}
          label=""
        />

        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: 20 }}
          >
            <NextButton onClick={onNext} label="下一步" />
          </motion.div>
        )}
      </motion.div>
    </StepWrapper>
  )
}

/* ─── Step 2: Countdown + Long Press ─── */
function CountdownStep({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState<'countdown' | 'longpress' | 'done'>('countdown')

  return (
    <StepWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{ textAlign: 'center', padding: '0 20px' }}
      >
        <p style={{
          fontSize: 15, fontWeight: 500, color: '#FAFAF9',
          marginBottom: 4, fontFamily: "'Noto Serif SC', serif",
        }}>
          {phase === 'countdown' ? '先停一停' : phase === 'longpress' ? '长按保持觉察' : '很好'}
        </p>
        <p style={{ fontSize: 12, color: 'rgba(168,162,158,0.5)', marginBottom: 28, letterSpacing: 1 }}>
          {phase === 'countdown'
            ? '在反应之前，给自己几秒钟'
            : phase === 'longpress'
            ? '用手指感受这个停顿'
            : '你刚刚做到了「暂停」'}
        </p>

        <AnimatePresence mode="wait">
          {phase === 'countdown' && (
            <motion.div key="cd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CountdownRing
                seconds={5}
                onComplete={() => setPhase('longpress')}
                size={140}
              />
            </motion.div>
          )}
          {phase === 'longpress' && (
            <motion.div key="lp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CountdownRing
                seconds={6}
                onComplete={() => setPhase('done')}
                size={140}
                requireLongPress
              />
            </motion.div>
          )}
          {phase === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
              <NextButton onClick={onNext} label="下一步" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </StepWrapper>
  )
}

/* ─── Step 3: Contraction / Expansion ─── */
function StateStep({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<'contraction' | 'expansion' | null>(null)

  return (
    <StepWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{ textAlign: 'center', padding: '0 20px' }}
      >
        <p style={{
          fontSize: 15, fontWeight: 500, color: '#FAFAF9',
          marginBottom: 4, fontFamily: "'Noto Serif SC', serif",
        }}>
          现在的身体状态
        </p>
        <p style={{ fontSize: 12, color: 'rgba(168,162,158,0.5)', marginBottom: 24, letterSpacing: 1 }}>
          不需要改变，只是看到
        </p>

        <ContractionExpansion
          selected={selected}
          onSelect={(state) => setSelected(state)}
          label=""
        />

        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: 24 }}
          >
            <NextButton onClick={onNext} label="下一步" />
          </motion.div>
        )}
      </motion.div>
    </StepWrapper>
  )
}

/* ─── Step 4: Breath ─── */
function BreathStep({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'idle'>('idle')
  const [cycle, setCycle] = useState(0)
  const TOTAL_CYCLES = 3

  useEffect(() => {
    if (phase === 'idle' && cycle === 0) {
      // Auto-start after mount
      const t = setTimeout(() => setPhase('inhale'), 800)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    if (phase === 'idle') return

    const durations = { inhale: 4000, hold: 2000, exhale: 6000 }
    const nextPhase = { inhale: 'hold' as const, hold: 'exhale' as const, exhale: 'inhale' as const }

    const t = setTimeout(() => {
      if (phase === 'exhale') {
        const next = cycle + 1
        setCycle(next)
        if (next >= TOTAL_CYCLES) {
          setPhase('idle')
          return
        }
      }
      setPhase(nextPhase[phase])
    }, durations[phase])

    return () => clearTimeout(t)
  }, [phase, cycle])

  const done = cycle >= TOTAL_CYCLES && phase === 'idle'

  return (
    <StepWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{ textAlign: 'center', padding: '0 20px' }}
      >
        <p style={{
          fontSize: 15, fontWeight: 500, color: '#FAFAF9',
          marginBottom: 4, fontFamily: "'Noto Serif SC', serif",
        }}>
          {done ? '练习完成' : '跟随呼吸'}
        </p>
        <p style={{ fontSize: 12, color: 'rgba(168,162,158,0.5)', marginBottom: 28, letterSpacing: 1 }}>
          {done ? '你为身体创造了一个新的空间' : `第 ${Math.min(cycle + 1, TOTAL_CYCLES)} / ${TOTAL_CYCLES} 轮`}
        </p>

        <BreathBall phase={phase} size={120} />

        {done && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: 32 }}
          >
            <p style={{ fontSize: 13, color: 'rgba(196,168,130,0.7)', marginBottom: 20, lineHeight: 1.8 }}>
              你刚刚完成了一次完整的觉察练习：<br />
              感知身体 → 暂停 → 识别状态 → 呼吸
            </p>
            <NextButton onClick={onNext} label="再来一次" />
          </motion.div>
        )}
      </motion.div>
    </StepWrapper>
  )
}

/* ─── Shared UI ─── */
function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: '100%', maxWidth: 375, margin: '0 auto', padding: '0 8px' }}>
      {children}
    </div>
  )
}

function NextButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      style={{
        padding: '14px 40px',
        borderRadius: 28,
        border: 'none',
        background: 'linear-gradient(135deg, #C4A882, #B8956A)',
        color: '#1C1917',
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: 1,
        cursor: 'pointer',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: '0 4px 20px rgba(196,168,130,0.3)',
      }}
    >
      {label}
    </motion.button>
  )
}
