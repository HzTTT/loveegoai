import { useEffect, useState, useRef } from 'react'
import { motion } from 'motion/react'

interface CountdownRingProps {
  seconds: number
  onComplete: () => void
  size?: number
  requireLongPress?: boolean
}

export function CountdownRing({ seconds, onComplete, size = 140, requireLongPress = false }: CountdownRingProps) {
  const [remaining, setRemaining] = useState(seconds)
  const [holding, setHolding] = useState(!requireLongPress)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const progress = remaining / seconds
  const strokeDash = circumference * progress

  useEffect(() => {
    if (!holding || done) return
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current!)
          setDone(true)
          setTimeout(onComplete, 600)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [holding, done, onComplete])

  function startHold() {
    if (!requireLongPress || done) return
    setHolding(true)
  }

  function endHold() {
    if (!requireLongPress || done) return
    setHolding(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, cursor: requireLongPress ? 'pointer' : 'default', userSelect: 'none' }}
      onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}
      onTouchStart={startHold} onTouchEnd={endHold}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* 背景圆 */}
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
          {/* 进度圆 */}
          <motion.circle
            cx={size/2} cy={size/2} r={radius}
            fill="none" stroke="#c4a882" strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: circumference - strokeDash }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>
        {/* 中心数字 */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          {done ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: 28, color: '#c4a882' }}>✓</motion.div>
          ) : (
            <>
              <motion.span
                key={remaining}
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ fontSize: 32, fontWeight: 300, color: '#FAFAF9', lineHeight: 1 }}
              >
                {remaining}
              </motion.span>
              <span style={{ fontSize: 11, color: 'rgba(168,162,158,0.6)', marginTop: 2 }}>秒</span>
            </>
          )}
        </div>
      </div>

      {requireLongPress && !holding && !done && (
        <p style={{ fontSize: 12, color: 'rgba(196,168,130,0.6)', letterSpacing: 1 }}>长按继续</p>
      )}
      {requireLongPress && holding && !done && (
        <p style={{ fontSize: 12, color: 'rgba(196,168,130,0.8)', letterSpacing: 1 }}>保持住...</p>
      )}
    </div>
  )
}
