import { motion } from 'motion/react'

/*
  Paywall A · 企业家方向 · 量子场
  文案：ELENA 原文（msg=696c8429），一字不改，原顺序铺出
  UI：高净值男性审美 —— 深碳黑/深海军 + 铂金冷金属 + 量子星场
  NOTE: ELENA 原稿模块编号为 1/2/4/5（缺 3），按原样保留
*/

const C = {
  bg: '#07080C',
  bgDeep: '#050609',
  bgNavy: '#0B1221',
  bgCard: 'rgba(184,193,212,0.03)',
  bgCardHi: 'rgba(201,181,138,0.04)',
  border: 'rgba(201,181,138,0.14)',
  borderStrong: 'rgba(201,181,138,0.32)',
  platinum: '#C9B58A',
  platinumDim: 'rgba(201,181,138,0.55)',
  platinumGlow: 'rgba(201,181,138,0.08)',
  silver: '#B8C1D4',
  white: '#F1F2F5',
  textMid: '#A5ABB6',
  textDim: 'rgba(165,171,182,0.5)',
}

const FONT_SERIF = "'Noto Serif SC', 'Songti SC', 'Times New Roman', serif"
const FONT_SANS = "'Inter', 'Noto Sans SC', -apple-system, 'Helvetica Neue', sans-serif"

export default function PaywallA() {
  return (
    <div translate="no" style={{
      width: '100%',
      minHeight: '100vh',
      background: `radial-gradient(ellipse at top, ${C.bgNavy} 0%, ${C.bg} 45%, ${C.bgDeep} 100%)`,
      color: C.white,
      fontFamily: FONT_SANS,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <QuantumField />
      <TopBar />
      <Paragraph1 />
      <Paragraph2 />
      <Paragraph3 />
      <Paragraph4 />
      <Modules />
      <PricingCTA />
      <Footer />
    </div>
  )
}

/* 静态量子场星点 */
function QuantumField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 1.8 + 0.4,
    opacity: Math.random() * 0.5 + 0.1,
    delay: Math.random() * 4,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {stars.map(s => (
        <motion.div
          key={s.id}
          animate={{ opacity: [s.opacity, s.opacity * 0.3, s.opacity] }}
          transition={{ duration: 4 + s.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: C.platinum,
            boxShadow: `0 0 ${s.size * 2}px ${C.platinumDim}`,
          }}
        />
      ))}
    </div>
  )
}

function TopBar() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      padding: '18px 28px',
      background: 'rgba(7,8,12,0.76)',
      backdropFilter: 'blur(14px)',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{ fontSize: 11, letterSpacing: 6, color: C.platinumDim, fontFamily: FONT_SERIF }}>
        LOVE · EGO · AI
      </span>
      <span style={{ fontSize: 9, letterSpacing: 3, color: C.textDim }}>
        QUANTUM · FIELD · ACCESS
      </span>
    </div>
  )
}

/* ─── 段 1（Hero） ELENA 原文第一段 ─── */
function Paragraph1() {
  return (
    <Section style={{ minHeight: '100vh', paddingTop: 120, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 680, width: '100%', padding: '0 28px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{
            width: 60, height: 1,
            background: `linear-gradient(90deg, transparent, ${C.platinum}, transparent)`,
            margin: '0 auto 40px',
          }}
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.6 }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 22,
            lineHeight: 2.1,
            color: C.white,
            letterSpacing: 1.2,
            marginBottom: 56,
          }}
        >
          深入量子场进行深度内在旅程的机会。这个无穷无尽、不可估量的源头创造场，是所有人类经验作为思想和想象的前兆而存在的地方——一个超越我们已知的、可感知的、三维时空现实的无限可能之地。
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.1 }}
        >
          <CTAButton label="进入量子场" />
        </motion.div>

        <ScrollHint />
      </div>
    </Section>
  )
}

/* ─── 段 2 ELENA 原文第二段 ─── */
function Paragraph2() {
  return (
    <Section
      style={{
        padding: '140px 0',
        background: `linear-gradient(180deg, transparent, ${C.bgNavy} 50%, transparent)`,
        position: 'relative', zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 680, width: '100%', padding: '0 32px' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1 }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 22,
            lineHeight: 2.1,
            color: C.white,
            letterSpacing: 1.2,
            textAlign: 'center',
          }}
        >
          旨在挑战你掌控自己的生活将为你提供无数机会，让你超越自我，并与这个无限的、赋予生命的能量源头相连。
        </motion.p>
      </div>
    </Section>
  )
}

/* ─── 段 3 ELENA 原文第三段 ─── */
function Paragraph3() {
  return (
    <Section style={{ padding: '140px 0', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 680, width: '100%', padding: '0 32px' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1 }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 22,
            lineHeight: 2.1,
            color: C.white,
            letterSpacing: 1.2,
            textAlign: 'center',
          }}
        >
          实时见证转化的可衡量证据，并学习唤醒大脑和身体潜在系统中存在的潜能的科学。帮助您挑战当前的信念，并重新编程您的大脑和身体，从而超越您的局限。
        </motion.p>
      </div>
    </Section>
  )
}

/* ─── 段 4 ELENA 原文第四段 ─── */
function Paragraph4() {
  return (
    <Section
      style={{
        padding: '140px 0',
        background: `linear-gradient(180deg, transparent, ${C.bgNavy} 50%, transparent)`,
        position: 'relative', zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 680, width: '100%', padding: '0 32px' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1 }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 22,
            lineHeight: 2.1,
            color: C.white,
            letterSpacing: 1.2,
            textAlign: 'center',
          }}
        >
          通过学习，您将学习如何改变您的能量，从过去中解脱出来，并创造一个新的未来。
        </motion.p>
      </div>
    </Section>
  )
}

/* ─── 模块 1 / 2 / 4 / 5（ELENA 原文） ─── */
function Modules() {
  const modules = [
    {
      no: '1',
      title: '改变的科学',
      items: [
        '了解大脑、身体和能量是如何相互作用的。',
        '探索为什么改变如此困难，以及如何克服旧的习惯。',
        '学习如何从"生存模式"切换到"创造模式"。',
      ],
    },
    {
      no: '2',
      title: '超越自我',
      items: [
        '学习如何超越你的环境、你的身体和时间。',
        '发现如何进入量子场——一个充满无限可能性的领域。',
        '练习将你的注意力从已知世界转移到未知世界。',
      ],
    },
    {
      no: '4',
      title: '重新编程你的潜意识',
      items: [
        '了解潜意识是如何运作的，以及如何进入它。',
        '学习如何打破旧的情绪链条和自动反应。',
      ],
    },
    {
      no: '5',
      title: '活出你的新现实',
      items: [
        '学习如何将这些教学应用到你的日常生活中。',
        '发现如何保持你的新状态，无论外部环境如何。',
        '体验作为自己生活的创造者所带来的力量和自由。',
      ],
    },
  ]
  return (
    <Section style={{ padding: '140px 0', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 680, width: '100%', padding: '0 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {modules.map((m, i) => (
            <motion.div
              key={m.no}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              style={{
                padding: '30px 28px',
                background: C.bgCardHi,
                border: `1px solid ${C.border}`,
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute', top: 20, right: 24,
                fontFamily: FONT_SERIF, fontSize: 44, fontWeight: 300,
                color: C.platinumGlow, lineHeight: 1,
                letterSpacing: 2,
              }}>
                0{m.no}
              </div>
              <div style={{
                fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 500,
                color: C.white, marginBottom: 20, letterSpacing: 1.2,
              }}>
                模块 {m.no}：{m.title}
              </div>
              <ul style={{
                listStyle: 'none', padding: 0, margin: 0,
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                {m.items.map((it, j) => (
                  <li key={j} style={{
                    fontSize: 14, lineHeight: 1.85, color: C.textMid,
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    fontFamily: FONT_SERIF,
                  }}>
                    <span style={{
                      color: C.platinum, fontSize: 9,
                      marginTop: 9, flexShrink: 0,
                    }}>
                      ◆
                    </span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ─── 定价 CTA ─── */
function PricingCTA() {
  return (
    <Section style={{ padding: '140px 0 160px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 520, width: '100%', padding: '0 32px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{
            padding: '48px 32px',
            background: `linear-gradient(160deg, ${C.platinumGlow}, ${C.bgCard})`,
            border: `1px solid ${C.borderStrong}`,
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: '50%', width: 40, height: 1,
            background: C.platinum, transform: 'translateX(-50%)',
          }} />

          <div style={{ fontSize: 10, letterSpacing: 5, color: C.platinumDim, marginBottom: 24 }}>
            QUANTUM · ACCESS
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: C.silver }}>$</span>
            <span style={{
              fontFamily: FONT_SERIF, fontSize: 54, fontWeight: 400,
              color: C.platinum, letterSpacing: 2,
            }}>
              ———
            </span>
          </div>
          <div style={{ fontSize: 10, color: C.textDim, marginBottom: 40, letterSpacing: 2 }}>
            PRICE TBD · 价格待确认
          </div>

          <CTAButton label="进入量子场" large />
        </motion.div>
      </div>
    </Section>
  )
}

function Footer() {
  return (
    <div style={{
      padding: '40px 28px 60px',
      textAlign: 'center',
      borderTop: `1px solid ${C.border}`,
      fontSize: 10, letterSpacing: 4, color: C.textDim,
      position: 'relative', zIndex: 1,
    }}>
      LOVE · EGO · AI · 2026
    </div>
  )
}

function Section({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <section style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...style,
    }}>
      {children}
    </section>
  )
}

function CTAButton({ label, large }: { label: string; large?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      style={{
        padding: large ? '18px 52px' : '15px 44px',
        borderRadius: 0,
        border: `1px solid ${C.platinum}`,
        background: 'transparent',
        color: C.platinum,
        fontSize: large ? 14 : 12,
        fontWeight: 500,
        letterSpacing: 5,
        cursor: 'pointer',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        fontFamily: FONT_SERIF,
      }}
    >
      {label}
    </motion.button>
  )
}

function ScrollHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0.3] }}
      transition={{ duration: 2.4, delay: 1.8, repeat: Infinity, repeatDelay: 0.6 }}
      style={{
        marginTop: 80,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}
    >
      <div style={{ width: 1, height: 28, background: C.platinumDim }} />
      <span style={{ fontSize: 9, letterSpacing: 4, color: C.textDim }}>
        SCROLL
      </span>
    </motion.div>
  )
}
