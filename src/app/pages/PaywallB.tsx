import { motion } from 'motion/react'

// 付费墙 B：神性女性 / BEING能量 · 浪漫女王意识版本
// 核心视觉：玫瑰金 + 深紫罗兰 + 星尘粒子 + 呼吸光晕

const C = {
  bg: '#160F14',          // 深玫瑰暗底
  bgAlt: '#1A1118',       // 略深的玫瑰暗底
  bgCard: 'rgba(250,240,245,0.035)',
  border: 'rgba(210,170,180,0.14)',
  borderStrong: 'rgba(210,170,180,0.30)',
  gold: '#C9A87C',        // 暖金
  rose: '#D4A0B0',        // 玫瑰
  roseLight: 'rgba(212,160,176,0.7)',
  roseDim: 'rgba(212,160,176,0.45)',
  roseFaint: 'rgba(212,160,176,0.12)',
  violet: 'rgba(178,140,210,0.55)', // 紫罗兰
  white: '#FDF8FA',
  mid: '#B8A8B2',
  dim: '#6B5A64',
}

const FONT_SERIF = "'Noto Serif SC', 'Georgia', serif"
const FONT_SANS = "'Noto Sans SC', -apple-system, sans-serif"

const KEYFRAMES = `
@font-face {
  font-family: 'Noto Serif SC';
  font-style: normal;
}

@keyframes breatheOuter {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.10; }
  50% { transform: translate(-50%, -50%) scale(1.18); opacity: 0.22; }
}
@keyframes breatheMid {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.20; }
  50% { transform: translate(-50%, -50%) scale(1.11); opacity: 0.38; }
}
@keyframes breatheInner {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.42; }
  50% { transform: translate(-50%, -50%) scale(1.06); opacity: 0.68; }
}
@keyframes breatheCore {
  0%, 100% { opacity: 0.50; box-shadow: 0 0 12px 4px rgba(212,160,176,0.4); }
  50% { opacity: 1; box-shadow: 0 0 24px 10px rgba(212,160,176,0.7); }
}
@keyframes floatUp {
  0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 0.6; }
  100% { transform: translateY(-120px) translateX(var(--drift, 20px)) scale(0.5); opacity: 0; }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.1; transform: scale(0.8); }
  50% { opacity: 0.9; transform: scale(1.2); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes drift {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(8px, -12px) rotate(120deg); }
  66% { transform: translate(-6px, -8px) rotate(240deg); }
}
@keyframes rotateSlow {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
`

/* ─── 浮动粒子 ─── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 5.5) % 90}%`,
  delay: `${(i * 0.7) % 6}s`,
  duration: `${6 + (i * 1.1) % 5}s`,
  size: i % 3 === 0 ? 4 : i % 3 === 1 ? 3 : 2,
  drift: i % 2 === 0 ? '18px' : '-14px',
  top: `${10 + (i * 7) % 75}%`,
  isRose: i % 3 !== 2,
}))

/* ─── 星光点 ─── */
const STARS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${(i * 3.3 + 2) % 96}%`,
  top: `${(i * 4.7 + 5) % 90}%`,
  delay: `${(i * 0.4) % 3.5}s`,
  duration: `${2.5 + (i * 0.3) % 2}s`,
  size: i % 4 === 0 ? 2.5 : 1.5,
}))

function ParticleField({ count = 18 }: { count?: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {PARTICLES.slice(0, count).map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.isRose
              ? `radial-gradient(circle, ${C.rose}, transparent)`
              : `radial-gradient(circle, ${C.gold}, transparent)`,
            animation: `floatUp ${p.duration} ${p.delay} ease-in-out infinite`,
            ['--drift' as never]: p.drift,
          }}
        />
      ))}
    </div>
  )
}

function StarField() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map(s => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.id % 3 === 0 ? C.rose : C.gold,
            animation: `twinkle ${s.duration} ${s.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── 装饰分隔符 ─── */
function Divider({ variant = 'default' }: { variant?: 'default' | 'rose' }) {
  const color = variant === 'rose' ? C.rose : C.gold
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: '20px 0',
      opacity: 0.5,
    }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${color})` }} />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2 L13.5 8.5 L20 7 L15 12 L20 17 L13.5 15.5 L12 22 L10.5 15.5 L4 17 L9 12 L4 7 L10.5 8.5 Z"
          fill={color} fillOpacity="0.8" />
      </svg>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  )
}

/* ─── CTA 按钮 ─── */
function CTAButton({ label, fullWidth }: { label: string; fullWidth?: boolean }) {
  return (
    <button
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: fullWidth ? '20px 0' : '18px 40px',
        background: `linear-gradient(135deg, #C9A87C 0%, #D4A0B0 50%, #C9A87C 100%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s linear infinite',
        border: 'none',
        borderRadius: 100,
        color: '#160F14',
        fontFamily: FONT_SERIF,
        fontSize: 16,
        fontWeight: 500,
        letterSpacing: 2,
        cursor: 'pointer',
        boxShadow: '0 4px 32px rgba(212,160,176,0.35), 0 0 60px rgba(201,168,124,0.15)',
      }}
    >
      {label}
    </button>
  )
}

/* ─── 共用组件 ─── */
function SectionLabel({ text, center }: { text: string; center?: boolean }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      style={{
        fontSize: 10,
        letterSpacing: 7,
        color: C.roseDim,
        marginBottom: 20,
        textAlign: center ? 'center' : 'left',
        textTransform: 'uppercase',
      }}
    >
      — {text} —
    </motion.p>
  )
}

function SectionTitle({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9 }}
      style={{
        fontFamily: FONT_SERIF,
        fontSize: 26,
        fontWeight: 300,
        lineHeight: 1.65,
        color: C.white,
        letterSpacing: 2,
        marginBottom: 0,
        textAlign: center ? 'center' : 'left',
      }}
    >
      {children}
    </motion.h2>
  )
}

/* ═══════════════════════════════════════
   主组件
═══════════════════════════════════════ */
export default function PaywallB() {
  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
        background: C.bg,
        color: C.white,
        fontFamily: FONT_SANS,
      }}>
        <div style={{ maxWidth: 430, margin: '0 auto' }}>
          <Hero />
          <Vision />
          <Core />
          <Witness />
          <Promise />
          <Pricing />
          <BottomCTA />
          <Footer />
        </div>
      </div>
    </>
  )
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '80px 0 100px',
    }}>
      {/* 星空背景 */}
      <StarField />
      <ParticleField count={14} />

      {/* 背景渐变光晕 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 60% 50% at 50% 55%, rgba(212,160,176,0.12) 0%, transparent 70%),
          radial-gradient(ellipse 40% 35% at 30% 20%, rgba(178,140,210,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 35% 30% at 70% 80%, rgba(201,168,124,0.07) 0%, transparent 60%)
        `,
        pointerEvents: 'none',
      }} />

      {/* 呼吸光晕中心 */}
      <div style={{
        position: 'absolute',
        top: '46%',
        left: '50%',
        pointerEvents: 'none',
        width: 0,
        height: 0,
      }}>
        {/* 最外光环 */}
        <div style={{
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,160,176,0.06) 0%, transparent 65%)',
          border: '1px solid rgba(212,160,176,0.06)',
          position: 'absolute',
          top: '50%', left: '50%',
          animation: 'breatheOuter 7s ease-in-out infinite',
        }} />
        {/* 旋转光环 */}
        <div style={{
          width: 260,
          height: 260,
          borderRadius: '50%',
          border: '1px solid rgba(212,160,176,0.10)',
          position: 'absolute',
          top: '50%', left: '50%',
          animation: 'rotateSlow 20s linear infinite',
        }}>
          {[0, 60, 120, 180, 240, 300].map(deg => (
            <div key={deg} style={{
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: C.rose,
              top: '50%',
              left: '50%',
              transform: `rotate(${deg}deg) translateX(128px) translate(-50%, -50%)`,
              opacity: 0.5,
            }} />
          ))}
        </div>
        {/* 中层光晕 */}
        <div style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,160,176,0.14) 0%, rgba(178,140,210,0.06) 50%, transparent 70%)',
          position: 'absolute',
          top: '50%', left: '50%',
          animation: 'breatheMid 7s ease-in-out infinite',
          animationDelay: '0.5s',
        }} />
        {/* 内层光晕 */}
        <div style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,160,176,0.22) 0%, rgba(201,168,124,0.10) 60%, transparent 75%)',
          position: 'absolute',
          top: '50%', left: '50%',
          animation: 'breatheInner 7s ease-in-out infinite',
          animationDelay: '1s',
        }} />
        {/* 核心点 */}
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`,
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'breatheCore 7s ease-in-out infinite',
        }} />
      </div>

      <div style={{
        width: '100%',
        padding: '0 28px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            fontSize: 10,
            letterSpacing: 7,
            color: C.roseDim,
            marginBottom: 44,
            textTransform: 'uppercase',
          }}
        >
          LOVE EGO AI · 神性女性系统
        </motion.p>

        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.3 }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 32,
            fontWeight: 300,
            lineHeight: 1.6,
            color: C.white,
            marginBottom: 12,
            letterSpacing: 3,
          }}
        >
          这是一场
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5 }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 32,
            fontWeight: 300,
            lineHeight: 1.6,
            letterSpacing: 3,
            marginBottom: 12,
            background: `linear-gradient(135deg, ${C.gold} 0%, ${C.rose} 50%, ${C.gold} 100%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 4s linear infinite',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          关系科学 · 灵性之爱
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.7 }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 32,
            fontWeight: 300,
            lineHeight: 1.6,
            color: C.white,
            marginBottom: 40,
            letterSpacing: 3,
          }}
        >
          与极性艺术的相遇
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.3, delay: 1.0 }}
          style={{
            fontSize: 14,
            lineHeight: 2.1,
            color: C.mid,
            marginBottom: 60,
            padding: '0 8px',
          }}
        >
          激活你内在的神性女性能量<br />
          引领你的关系进入深沉、神圣<br />
          真实的爱的境界
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.3 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <CTAButton label="激活我的女王意识" />
        </motion.div>

        {/* 底部小字 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          style={{
            marginTop: 24,
            fontSize: 11,
            letterSpacing: 3,
            color: C.dim,
          }}
        >
          ¥3,888 · 一次觉醒 · 永久携带
        </motion.p>
      </div>
    </section>
  )
}

/* ─── 愿景 ─── */
function Vision() {
  const visions = [
    '在日常互动中，你能够确切地知道爱的样子和感觉——揭开神圣而性感、亲密、健康、有意识的亲密关系的密码。',
    '你确信自己被深爱着、被全力支持着，生活在一个浪漫、忠诚、幸福美满的婚姻中。',
  ]

  return (
    <section style={{
      width: '100%',
      position: 'relative',
      padding: '100px 0',
      background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bgAlt} 50%, ${C.bg} 100%)`,
      overflow: 'hidden',
    }}>
      <ParticleField count={8} />

      <div style={{ width: '100%', padding: '0 28px', position: 'relative', zIndex: 1 }}>
        <SectionLabel text="你渴望的是什么" />
        <SectionTitle>「想象一下……」</SectionTitle>

        <Divider variant="rose" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          {visions.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.12 }}
              style={{
                padding: '24px 24px 24px 20px',
                background: `linear-gradient(135deg, rgba(212,160,176,0.07) 0%, rgba(250,240,245,0.02) 100%)`,
                borderLeft: `2px solid`,
                borderImage: `linear-gradient(to bottom, ${C.rose}, ${C.gold}) 1`,
                borderRadius: '0 14px 14px 0',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* 微光装饰 */}
              <div style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(212,160,176,0.08) 0%, transparent 70%)`,
              }} />
              <p style={{
                fontFamily: FONT_SERIF,
                fontSize: 15,
                lineHeight: 1.95,
                color: C.white,
                margin: 0,
                position: 'relative',
              }}>
                <span style={{ color: C.roseDim, marginRight: 6 }}>✦</span>
                <span style={{ color: C.roseLight }}>想象一下，</span>
                {v}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 产品核心 ─── */
function Core() {
  const cards = [
    {
      symbol: '◎',
      title: '旧程序识别',
      desc: '看见那些在关系里让你讨好、切断、过度分析的自动程序——它们不是你，它们只是你学来的生存策略',
      color: C.rose,
    },
    {
      symbol: '❋',
      title: 'BEING 能量激活',
      desc: '从头脑的 DOING 回到身体的存在，找回属于你的阴性能量——它不是技巧，而是你原本就拥有的',
      color: C.gold,
    },
    {
      symbol: '∞',
      title: '极性吸引重建',
      desc: '当你回到身体，关系里的极性自然重建，吸引力从内部流出——不是你追，是他靠近',
      color: C.violet,
    },
  ]

  return (
    <section style={{
      width: '100%',
      padding: '100px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 背景装饰光 */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '-20%',
        width: '60%',
        height: '40%',
        background: `radial-gradient(ellipse, rgba(178,140,210,0.06) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '-20%',
        width: '55%',
        height: '35%',
        background: `radial-gradient(ellipse, rgba(212,160,176,0.06) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', padding: '0 28px', position: 'relative', zIndex: 1 }}>
        <SectionLabel text="这里发生了什么" />
        <SectionTitle>激活你的神性女性意识</SectionTitle>

        <Divider />

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          style={{
            margin: '0 0 44px',
            padding: '28px 24px',
            background: `linear-gradient(135deg, rgba(212,160,176,0.06) 0%, rgba(201,168,124,0.04) 100%)`,
            border: `1px solid rgba(212,160,176,0.18)`,
            borderRadius: 16,
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute',
            top: 12,
            left: 18,
            fontFamily: FONT_SERIF,
            fontSize: 48,
            color: C.rose,
            opacity: 0.15,
            lineHeight: 1,
            userSelect: 'none',
          }}>「</div>
          <p style={{
            fontFamily: FONT_SERIF,
            fontSize: 15,
            lineHeight: 2.1,
            color: C.mid,
            margin: '0 0 16px',
            paddingLeft: 14,
          }}>
            超越头脑思维的噪音、障碍和限制——那些让你讨好、让你追逐、让你在关系里失去重量的旧程序。
          </p>
          <p style={{
            fontFamily: FONT_SERIF,
            fontSize: 15,
            lineHeight: 2.1,
            color: C.mid,
            margin: '0 0 16px',
            paddingLeft: 14,
          }}>
            BEING 能量是你与生俱来的阴性能量。它不是技巧，不是策略，而是你作为女性最原始的吸引力来源。
          </p>
          <p style={{
            fontFamily: FONT_SERIF,
            fontSize: 15,
            lineHeight: 2.1,
            color: C.rose,
            margin: 0,
            fontStyle: 'italic',
            paddingLeft: 14,
          }}>
            当这个能量被激活，极性吸引会自然回来。你不需要"做"什么——你只需要"在"。
          </p>
        </motion.blockquote>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.14 }}
              style={{
                padding: '28px 24px',
                background: `linear-gradient(135deg, rgba(212,160,176,0.05) 0%, rgba(250,240,245,0.02) 100%)`,
                border: `1px solid ${C.borderStrong}`,
                borderRadius: 18,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* 卡片背景光 */}
              <div style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${card.color} 0%, transparent 70%)`,
                opacity: 0.07,
              }} />
              <div style={{
                fontSize: 22,
                color: card.color,
                marginBottom: 14,
                opacity: 0.85,
                fontWeight: 300,
                letterSpacing: 2,
              }}>
                {card.symbol}
              </div>
              <div style={{
                fontFamily: FONT_SERIF,
                fontSize: 17,
                fontWeight: 400,
                color: C.white,
                marginBottom: 10,
                letterSpacing: 1.5,
              }}>
                {card.title}
              </div>
              <div style={{
                fontSize: 13,
                lineHeight: 1.9,
                color: C.mid,
              }}>
                {card.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 用户见证 ─── */
function Witness() {
  const voices = [
    {
      quote: `我一定要告诉你，我和我丈夫有多么感激这个内容，让我实现了我连想都不敢想的梦想！\n\n你对我们影响太大了。谢谢你所做的一切。回首这一年，我意识到，因为你，我才能过上梦想中的生活。`,
      name: 'J',
      city: '',
    },
    {
      quote: `通过这个内容练习我明白一切都始于自身！改变我的思维模式和反应方式。\n\n男人并非有意伤害我们，并非所有男人都有毒，他们只是拥有男性的思维方式！\n\n一个有趣的故事：我和妹妹去劳氏五金店给她买些DIY材料，离开时一位男士主动提出帮我们推东西、装车，我欣然接受了他的好意并向他道谢。他离开后，我们上了车，妹妹说：'我一个人来的时候从来没遇到过这种情况！'\n\n这是古老的智慧——无论我们如何努力迎合社会的新标准，我们依然是鲜明的男性和女性。我们的思维和行为方式天生不同，而现在我知道这没什么不好！`,
      name: '',
      city: '',
    },
    {
      quote: `我运用了APP给我的所有方法、思维转变、吸引力法则以及所有的一切，我终于找回了我的男人！\n\n你改变了我、我儿子和他爸爸的生活。`,
      name: '布里特',
      city: '',
    },
  ]

  return (
    <section style={{
      width: '100%',
      position: 'relative',
      padding: '100px 0',
      overflow: 'hidden',
      background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bgAlt} 100%)`,
    }}>
      <StarField />
      <ParticleField count={10} />

      <div style={{ width: '100%', padding: '0 28px', position: 'relative', zIndex: 1 }}>
        <SectionLabel text="用户见证" />
        <SectionTitle>来自她们的真实经历</SectionTitle>

        <Divider variant="rose" />

        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {voices.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.15 }}
              style={{
                padding: '30px 24px',
                background: `linear-gradient(160deg, rgba(212,160,176,0.07) 0%, rgba(250,240,245,0.02) 100%)`,
                border: `1px solid rgba(212,160,176,0.22)`,
                borderRadius: 20,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* 装饰光晕 */}
              <div style={{
                position: 'absolute',
                top: -40,
                right: -40,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(212,160,176,0.10) 0%, transparent 70%)`,
              }} />
              <div style={{
                position: 'absolute',
                top: 12,
                left: 18,
                fontFamily: FONT_SERIF,
                fontSize: 52,
                color: C.rose,
                opacity: 0.12,
                lineHeight: 1,
                userSelect: 'none',
              }}>
                「
              </div>
              <div style={{ paddingLeft: 16, position: 'relative' }}>
                {v.quote.split('\n\n').map((para, j) => (
                  <p
                    key={j}
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: 14,
                      lineHeight: 2,
                      color: j === 0 ? C.white : C.mid,
                      margin: '0 0 14px',
                      fontStyle: 'italic',
                    }}
                  >
                    {para}
                  </p>
                ))}
                {(v.name || v.city) && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginTop: 8,
                  }}>
                    <div style={{
                      width: 20,
                      height: 1,
                      background: `linear-gradient(to right, ${C.rose}, transparent)`,
                    }} />
                    <p style={{
                      fontSize: 11,
                      letterSpacing: 3,
                      color: C.roseDim,
                      margin: 0,
                    }}>
                      {[v.name, v.city].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 结果承诺 ─── */
function Promise() {
  const outcomes = [
    { label: '高标准', desc: '不是挑剔，是清楚自己配得上什么', icon: '✦' },
    { label: '安全感', desc: '从身体里来，不是从他的行为来', icon: '◎' },
    { label: '真实的边界', desc: '不是冷漠，而是知道自己是谁', icon: '❋' },
    { label: '极性吸引', desc: '当你在身体里，他自然会靠近', icon: '∞' },
    { label: '神圣的爱', desc: '不靠委屈换来的，是真正相互流动的', icon: '✦' },
    { label: '与生俱来的价值感', desc: '存在本身就有，不需要他来确认', icon: '◎' },
  ]

  return (
    <section style={{
      width: '100%',
      padding: '100px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120%',
        height: '60%',
        background: `radial-gradient(ellipse, rgba(212,160,176,0.04) 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', padding: '0 28px', position: 'relative', zIndex: 1 }}>
        <SectionLabel text="结果承诺" />
        <SectionTitle>「你将拥有……」</SectionTitle>

        <Divider />

        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {outcomes.map((o, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.09 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '20px 0',
                borderBottom: i === outcomes.length - 1 ? 'none' : `1px solid ${C.border}`,
              }}
            >
              <span style={{
                color: i % 2 === 0 ? C.rose : C.gold,
                fontSize: 13,
                flexShrink: 0,
                marginTop: 3,
                opacity: 0.9,
              }}>
                {o.icon}
              </span>
              <div>
                <span style={{
                  fontFamily: FONT_SERIF,
                  fontSize: 15,
                  color: C.white,
                  fontWeight: 400,
                  letterSpacing: 0.5,
                }}>
                  {o.label}
                </span>
                <span style={{
                  fontSize: 13,
                  color: C.mid,
                  marginLeft: 10,
                }}>
                  — {o.desc}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 定价 ─── */
function Pricing() {
  const benefits = [
    '全部训练章节（含BEING能量、极性、边界、身体感知）',
    '关系模式图谱（识别你在关系里的自动程序）',
    'AI 女性能量陪练（无限次，私密对话）',
    '每日微练习（5分钟，随时随地）',
    '身体热区训练（找回阴性能量的入口）',
    '终身更新权限',
  ]

  return (
    <section style={{
      width: '100%',
      position: 'relative',
      padding: '100px 0',
      overflow: 'hidden',
      background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bgAlt} 100%)`,
    }}>
      <StarField />
      <ParticleField count={12} />

      <div style={{ width: '100%', padding: '0 28px', position: 'relative', zIndex: 1 }}>
        <SectionLabel text="定价" center />

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 24,
            fontWeight: 300,
            lineHeight: 1.65,
            color: C.white,
            letterSpacing: 3,
            textAlign: 'center',
            marginBottom: 44,
          }}
        >
          一次性激活，永久携带
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{
            padding: '40px 28px',
            background: `linear-gradient(160deg, rgba(212,160,176,0.09) 0%, rgba(201,168,124,0.06) 50%, rgba(250,240,245,0.02) 100%)`,
            border: `1px solid rgba(212,160,176,0.30)`,
            borderRadius: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 卡片背景装饰 */}
          <div style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(212,160,176,0.10) 0%, transparent 70%)`,
          }} />
          <div style={{
            position: 'absolute',
            bottom: -40,
            left: -40,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(201,168,124,0.08) 0%, transparent 70%)`,
          }} />

          <div style={{
            fontSize: 11,
            letterSpacing: 5,
            color: C.roseDim,
            marginBottom: 24,
            textAlign: 'center',
            textTransform: 'uppercase',
          }}>
            女性能量完整系统
          </div>

          {/* 价格 */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: 4,
            marginBottom: 8,
          }}>
            <span style={{ fontSize: 16, color: C.mid }}>¥</span>
            <span style={{
              fontFamily: FONT_SERIF,
              fontSize: 56,
              fontWeight: 300,
              background: `linear-gradient(135deg, ${C.gold}, ${C.rose})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: 1,
              lineHeight: 1,
            }}>
              3,888
            </span>
          </div>

          <p style={{
            fontSize: 12,
            color: C.dim,
            textAlign: 'center',
            letterSpacing: 3,
            marginBottom: 36,
          }}>
            一次付款 · 永久使用
          </p>

          <div style={{
            height: 1,
            background: `linear-gradient(to right, transparent, ${C.borderStrong}, transparent)`,
            marginBottom: 28,
          }} />

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {benefits.map((item, i) => (
              <li key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                fontSize: 13,
                lineHeight: 1.75,
                color: C.white,
              }}>
                <span style={{
                  color: i % 2 === 0 ? C.rose : C.gold,
                  fontSize: 11,
                  flexShrink: 0,
                  marginTop: 3,
                }}>
                  ✦
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div style={{
            height: 1,
            background: `linear-gradient(to right, transparent, ${C.borderStrong}, transparent)`,
            margin: '32px 0 24px',
          }} />

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CTAButton label="激活我的女王意识" fullWidth />
          </div>

          <p style={{
            fontSize: 12,
            color: C.roseDim,
            textAlign: 'center',
            letterSpacing: 2,
            marginTop: 20,
          }}>
            7天全额退款保证 · 你的改变，从这一刻开始
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── 底部 CTA ─── */
function BottomCTA() {
  return (
    <section style={{
      width: '100%',
      position: 'relative',
      padding: '100px 0 80px',
      overflow: 'hidden',
    }}>
      <StarField />
      <ParticleField count={16} />

      {/* 中央光晕 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 300,
        height: 300,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(212,160,176,0.10) 0%, rgba(201,168,124,0.05) 40%, transparent 70%)`,
        animation: 'breatheOuter 7s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        padding: '0 28px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 28,
            marginBottom: 28,
            opacity: 0.4,
            letterSpacing: 16,
            color: C.rose,
          }}
        >
          ✦  ✦  ✦
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1 }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 28,
            fontWeight: 300,
            lineHeight: 1.65,
            color: C.white,
            letterSpacing: 2,
            marginBottom: 36,
          }}
        >
          「我已准备好……」
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.25 }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 15,
            lineHeight: 2.2,
            color: C.mid,
            marginBottom: 56,
            padding: '0 4px',
          }}
        >
          我已准备好激活我的女王意识，<br />
          解锁能够创造神圣之爱、<br />
          真实渴望和觉醒关系的内在能量——<br />
          这是我内心深处一直渴望的。<br />
          <br />
          <span style={{
            color: C.rose,
            opacity: 0.9,
          }}>我可以安心地让爱进入我的生命。</span><br />
          <span style={{
            color: C.gold,
            opacity: 0.9,
          }}>我可以全然地去爱，也全然地被爱。</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4 }}
          style={{ width: '100%' }}
        >
          <CTAButton label="现在激活" fullWidth />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{
            marginTop: 20,
            fontSize: 11,
            color: C.dim,
            letterSpacing: 2,
          }}
        >
          ¥3,888 · 一次付款 · 永久使用 · 7天退款保证
        </motion.p>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
  return (
    <div style={{
      padding: '32px 28px 52px',
      textAlign: 'center',
      borderTop: `1px solid ${C.border}`,
    }}>
      <div style={{
        fontSize: 11,
        letterSpacing: 4,
        color: C.dim,
        marginBottom: 12,
      }}>
        LOVE · EGO · AI · 2026
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        opacity: 0.25,
      }}>
        {['✦', '◎', '❋'].map((s, i) => (
          <span key={i} style={{ color: i === 1 ? C.rose : C.gold, fontSize: 10 }}>{s}</span>
        ))}
      </div>
    </div>
  )
}
