import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// ===== 品牌色系（深色科普风）=====
const C = {
  bg: '#1C1917',
  bgCard: 'rgba(250,250,249,0.06)',
  bgCardBorder: 'rgba(196,168,130,0.15)',
  gold: '#C4A882',
  goldGlow: 'rgba(196,168,130,0.08)',
  goldLight: 'rgba(196,168,130,0.2)',
  accent: '#C47D6D',
  accentGlow: 'rgba(196,125,109,0.2)',
  white: '#FAFAF9',
  textMid: '#A8A29E',
  textDim: '#78716C',
}

// ===== Scene 数据 =====
type Scene = 'intro' | 'chain' | 'highlight' | 'ending'
const SCENES: Scene[] = ['intro', 'chain', 'highlight', 'ending']

const CHAIN_NODES = [
  { icon: '⚡', label: '事件发生', desc: '外部刺激进入感知系统' },
  { icon: '🧠', label: '大脑判断', desc: '在意识到之前已经发生', isKey: true },
  { icon: '💫', label: '身体感受', desc: '胸口收紧 · 腹部下沉' },
  { icon: '🌊', label: '感受变成情绪', desc: '感受 + 判断 = 情绪' },
  { icon: '🔄', label: '情绪驱动反应', desc: '旧程序启动，替你做选择' },
]

// ===== Timeline (ms) =====
const T = {
  introTitle: 600,
  introSub: 1500,
  introToChain: 4000,
  chainNodeInterval: 1200,
  chainToHighlight: 10500,
  highlightInsight: 1000,
  highlightToEnd: 5500,
}

export default function KoalaVideoDemo() {
  const [phase, setPhase] = useState<'idle' | 'playing'>('idle')
  const [scene, setScene] = useState<Scene>('intro')
  const [visibleNodes, setVisibleNodes] = useState<number[]>([])
  const [showInsight, setShowInsight] = useState(false)
  const [progress, setProgress] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const TOTAL = 20000

  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    if (progressRef.current) clearInterval(progressRef.current)
  }, [])

  useEffect(() => cleanup, [cleanup])

  const t = (ms: number, fn: () => void) => {
    timersRef.current.push(setTimeout(fn, ms))
  }

  const start = useCallback(() => {
    if (phase === 'playing') return
    cleanup()
    setPhase('playing')
    setScene('intro')
    setVisibleNodes([])
    setShowInsight(false)
    setProgress(0)

    // Progress bar
    const startTime = Date.now()
    progressRef.current = setInterval(() => {
      setProgress(Math.min((Date.now() - startTime) / TOTAL * 100, 100))
    }, 30)

    // Scene 1 → Scene 2
    t(T.introToChain, () => {
      setScene('chain')
      CHAIN_NODES.forEach((_, i) => {
        t(i * T.chainNodeInterval, () => setVisibleNodes(prev => [...prev, i]))
      })
    })

    // Scene 2 → Scene 3
    t(T.introToChain + T.chainToHighlight, () => {
      setScene('highlight')
      t(T.highlightInsight, () => setShowInsight(true))
    })

    // Scene 3 → Scene 4
    t(T.introToChain + T.chainToHighlight + T.highlightToEnd, () => {
      setScene('ending')
      if (progressRef.current) clearInterval(progressRef.current)
      setProgress(100)
    })
  }, [phase, cleanup])

  const handleClick = () => {
    if (phase === 'idle') {
      start()
    } else if (scene === 'ending') {
      cleanup()
      setPhase('idle')
      setScene('intro')
      setVisibleNodes([])
      setShowInsight(false)
      setProgress(0)
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100vw',
        height: '100vh',
        background: `linear-gradient(170deg, ${C.bg} 0%, #292524 50%, ${C.bg} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Noto Sans SC', 'Noto Serif SC', sans-serif",
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${C.goldGlow} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Topic tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'idle' ? 0 : 0.5 }}
        transition={{ delay: 0.2 }}
        style={{
          position: 'absolute',
          top: 48,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 11,
          letterSpacing: 4,
          color: C.gold,
          fontWeight: 500,
        }}
      >
        原理科普 · 01
      </motion.div>

      {/* ===== Idle: Play Button ===== */}
      <AnimatePresence>
        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              zIndex: 50,
            }}
          >
            <motion.img
              src="/marketing/koala-ip.png"
              alt=""
              style={{ width: 100, marginBottom: 8 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            />
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: C.goldLight,
                border: `2px solid ${C.gold}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 22, color: C.gold, marginLeft: 3 }}>▶</span>
            </motion.div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: C.textMid, letterSpacing: 2 }}>点击播放</div>
              <div style={{ fontSize: 11, color: C.gold, letterSpacing: 3, marginTop: 6, opacity: 0.6 }}>
                LOVE EGO AI · 原理科普
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Scene 1: Intro ===== */}
      <AnimatePresence mode="wait">
        {scene === 'intro' && phase === 'playing' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 28,
              padding: '0 40px',
              textAlign: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              style={{
                fontFamily: "'Noto Serif SC', serif",
                fontSize: 34,
                fontWeight: 600,
                color: C.white,
                lineHeight: 1.6,
              }}
            >
              一个情绪
              <br />
              是怎么形成的
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              style={{ fontSize: 15, color: C.textMid, lineHeight: 1.8 }}
            >
              你以为情绪是随机的
              <br />
              其实它有一条完整的链条
            </motion.div>

            <motion.img
              src="/marketing/koala-ip.png"
              alt=""
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 100, damping: 15 }}
              style={{ position: 'absolute', bottom: 40, right: 32, width: 110 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Scene 2: Chain ===== */}
      <AnimatePresence mode="wait">
        {scene === 'chain' && (
          <motion.div
            key="chain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0,
              padding: '0 32px',
              width: '100%',
              maxWidth: 400,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 0.6, y: 0 }}
              style={{ fontSize: 13, color: C.gold, letterSpacing: 3, marginBottom: 28, fontWeight: 500 }}
            >
              情绪链条
            </motion.div>

            {CHAIN_NODES.map((node, i) => (
              <div key={node.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {/* 连线 */}
                {i > 0 && (
                  <AnimatePresence>
                    {visibleNodes.includes(i) && (
                      <motion.div
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        style={{
                          width: 2,
                          height: 20,
                          background: `linear-gradient(180deg, ${C.gold}, ${C.goldLight})`,
                          transformOrigin: 'top',
                          marginBottom: 4,
                        }}
                      />
                    )}
                  </AnimatePresence>
                )}

                {/* 节点卡片 */}
                <AnimatePresence>
                  {visibleNodes.includes(i) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: 16 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        background: node.isKey ? C.accentGlow : C.bgCard,
                        border: `1px solid ${node.isKey ? 'rgba(196,125,109,0.3)' : C.bgCardBorder}`,
                        borderRadius: 16,
                        padding: '14px 22px',
                        width: '100%',
                        backdropFilter: 'blur(12px)',
                      }}
                    >
                      <div style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: node.isKey
                          ? 'linear-gradient(135deg, rgba(196,125,109,0.3), rgba(196,125,109,0.1))'
                          : `linear-gradient(135deg, ${C.goldLight}, rgba(196,168,130,0.05))`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        flexShrink: 0,
                      }}>
                        {node.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: node.isKey ? C.accent : C.white,
                          marginBottom: 2,
                        }}>
                          {node.label}
                        </div>
                        <div style={{ fontSize: 12, color: C.textMid }}>
                          {node.desc}
                        </div>
                      </div>
                      {node.isKey && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          style={{
                            fontSize: 9,
                            color: C.accent,
                            background: 'rgba(196,125,109,0.15)',
                            padding: '3px 8px',
                            borderRadius: 10,
                            fontWeight: 600,
                            letterSpacing: 1,
                            whiteSpace: 'nowrap' as const,
                          }}
                        >
                          关键
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <motion.img
              src="/marketing/koala-ip.png"
              alt=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 4 }}
              style={{ position: 'absolute', bottom: 24, right: 16, width: 72 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Scene 3: Highlight ===== */}
      <AnimatePresence mode="wait">
        {scene === 'highlight' && (
          <motion.div
            key="highlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 40px',
              gap: 32,
            }}
          >
            {/* 高亮卡片 */}
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: 'linear-gradient(135deg, rgba(196,125,109,0.2), rgba(196,125,109,0.06))',
                border: '2px solid rgba(196,125,109,0.35)',
                borderRadius: 20,
                padding: '22px 30px',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #C47D6D, #B8956A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
              }}>
                🧠
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.white }}>大脑判断</div>
                <div style={{ fontSize: 13, color: C.accent, fontWeight: 500, marginTop: 2 }}>链条的关键环节</div>
              </div>
            </motion.div>

            {/* 洞见文字 */}
            <AnimatePresence>
              {showInsight && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ maxWidth: 320 }}
                >
                  <div style={{
                    fontFamily: "'Noto Serif SC', serif",
                    fontSize: 21,
                    fontWeight: 600,
                    color: C.white,
                    lineHeight: 1.9,
                    marginBottom: 20,
                  }}>
                    这个判断
                    <br />
                    大部分不是你当下做出的
                    <br />
                    <span style={{ color: C.gold }}>是你很早以前就学会的</span>
                  </div>
                  <div style={{ fontSize: 13, color: C.textDim, lineHeight: 1.8 }}>
                    身体跳过意识，直接调用旧的反应方式
                    <br />
                    这就是为什么"想通了"≠"做到了"
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.img
              src="/marketing/koala-ip.png"
              alt=""
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
              style={{
                position: 'absolute',
                bottom: 40,
                left: 28,
                width: 90,
                transform: 'scaleX(-1)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Scene 4: Ending ===== */}
      <AnimatePresence mode="wait">
        {scene === 'ending' && (
          <motion.div
            key="ending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 36,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{
                fontFamily: "'Noto Serif SC', serif",
                fontSize: 28,
                fontWeight: 600,
                color: C.white,
                lineHeight: 1.8,
              }}
            >
              看见链条
              <br />
              才有机会
              <br />
              在某个环节<span style={{ color: C.gold }}>停下来</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}
            >
              <motion.img
                src="/marketing/koala-ip.png"
                alt=""
                initial={{ y: 16 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.8, type: 'spring' }}
                style={{ width: 72 }}
              />
              <div style={{ fontSize: 13, letterSpacing: 6, color: C.gold, opacity: 0.6, fontWeight: 500 }}>
                LOVE EGO AI
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 2 }}
              style={{ position: 'absolute', bottom: 52, fontSize: 12, color: C.textDim }}
            >
              点击重播
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      {phase === 'playing' && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'rgba(196,168,130,0.1)',
        }}>
          <motion.div style={{
            height: '100%',
            background: `linear-gradient(90deg, ${C.gold}, ${C.accent})`,
            width: `${progress}%`,
            borderRadius: '0 2px 2px 0',
          }} />
        </div>
      )}

      {/* Scene indicators */}
      {phase === 'playing' && scene !== 'ending' && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          display: 'flex',
          gap: 8,
        }}>
          {SCENES.map((s) => (
            <motion.div
              key={s}
              animate={{
                background: s === scene ? C.gold : C.goldLight,
                scale: s === scene ? 1.3 : 1,
              }}
              transition={{ duration: 0.3 }}
              style={{ width: 6, height: 6, borderRadius: '50%' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
