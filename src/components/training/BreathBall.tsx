import { motion } from 'motion/react'

interface BreathBallProps {
  phase: 'inhale' | 'hold' | 'exhale' | 'idle'
  size?: number
  label?: string
}

export function BreathBall({ phase, size = 120, label }: BreathBallProps) {
  const scale = phase === 'inhale' ? 1.4 : phase === 'hold' ? 1.4 : 0.85
  const opacity = phase === 'idle' ? 0.5 : 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div style={{ position: 'relative', width: size * 1.6, height: size * 1.6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* 外环光晕 */}
        <motion.div
          animate={{ scale: scale * 0.9, opacity: phase === 'idle' ? 0 : 0.15 }}
          transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 6 : 0.3, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: size * 1.5, height: size * 1.5,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #c4a882 0%, transparent 70%)',
          }}
        />
        {/* 主球 */}
        <motion.div
          animate={{ scale, opacity }}
          transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 6 : 0.3, ease: 'easeInOut' }}
          style={{
            width: size, height: size,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(196,168,130,0.9) 0%, rgba(138,122,106,0.7) 100%)',
            boxShadow: '0 0 40px rgba(196,168,130,0.3)',
          }}
        />
        {/* 中心文字 */}
        <motion.div
          animate={{ opacity: phase === 'idle' ? 0 : 1 }}
          style={{
            position: 'absolute',
            fontSize: 12, color: 'rgba(255,255,255,0.9)',
            fontWeight: 500, letterSpacing: 1,
          }}
        >
          {phase === 'inhale' ? '吸气' : phase === 'hold' ? '保持' : phase === 'exhale' ? '呼气' : ''}
        </motion.div>
      </div>

      {label && (
        <p style={{ fontSize: 13, color: 'rgba(168,162,158,0.8)', letterSpacing: 1 }}>{label}</p>
      )}
    </div>
  )
}
