import { motion } from 'motion/react'

/*
  Paywall A · 企业家方向 · 量子场
  文案：ELENA 原文（msg=696c8429），一字不改，原顺序整段铺
  UI：SpaceX 官网风 —— 纯黑 / 粗体无衬线 / 高对比 / 大留白 / 稀疏星点
  NOTE: 模块编号 1/2/4/5，原稿缺 3，按原样
*/

const C = {
  bg: '#000000',
  bgDeep: '#050506',
  bgCard: 'rgba(255,255,255,0.03)',
  border: 'rgba(255,255,255,0.12)',
  borderStrong: 'rgba(255,255,255,0.32)',
  white: '#FFFFFF',
  textMid: '#9EA3AA',
  textDim: 'rgba(158,163,170,0.55)',
}

const FONT_SANS = "'Inter', 'Helvetica Neue', Helvetica, -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif"

export default function PaywallA() {
  return (
    <div translate="no" style={{
      width: '100%',
      minHeight: '100vh',
      background: C.bg,
      color: C.white,
      fontFamily: FONT_SANS,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Starfield />
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

/* 稀疏静态星点 · SpaceX 冷感 */
function Starfield() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 1.4 + 0.3,
    opacity: Math.random() * 0.4 + 0.1,
    delay: Math.random() * 4,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {stars.map(s => (
        <motion.div
          key={s.id}
          animate={{ opacity: [s.opacity, s.opacity * 0.2, s.opacity] }}
          transition={{ duration: 5 + s.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: C.white,
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
      padding: '22px 36px',
      background: 'rgba(0,0,0,0.72)',
      backdropFilter: 'blur(14px)',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{
        fontSize: 13, letterSpacing: 4, color: C.white,
        fontWeight: 700, textTransform: 'uppercase',
      }}>
        LOVE · EGO · AI
      </span>
      <span style={{
        fontSize: 10, letterSpacing: 3, color: C.textMid,
        textTransform: 'uppercase', fontWeight: 500,
      }}>
        Quantum Field Access
      </span>
    </div>
  )
}

/* ─── 段 1（Hero）ELENA 原文第一段 ─── */
function Paragraph1() {
  return (
    <Section style={{ minHeight: '100vh', paddingTop: 140, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 900, width: '100%', padding: '0 32px', textAlign: 'center' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          style={{
            fontSize: 'clamp(32px, 6vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: C.white,
            letterSpacing: '-0.02em',
            marginBottom: 48,
            textTransform: 'uppercase',
          }}
        >
          QUANTUM<br />
          FIELD
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            width: 80, height: 2, background: C.white,
            margin: '0 auto 48px',
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            lineHeight: 1.85,
            fontWeight: 400,
            color: C.white,
            letterSpacing: '0.02em',
            marginBottom: 56,
            maxWidth: 760,
            margin: '0 auto 56px',
          }}
        >
          深入量子场进行深度内在旅程的机会。这个无穷无尽、不可估量的源头创造场，是所有人类经验作为思想和想象的前兆而存在的地方——一个超越我们已知的、可感知的、三维时空现实的无限可能之地。
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <CTAButton label="ENTER THE FIELD" />
        </motion.div>

        <ScrollHint />
      </div>
    </Section>
  )
}

/* ─── 段 2 ELENA 原文第二段 ─── */
function Paragraph2() {
  return (
    <Section style={{ padding: '160px 0', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 900, width: '100%', padding: '0 32px', textAlign: 'center' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1 }}
          style={{
            fontSize: 'clamp(20px, 3vw, 32px)',
            lineHeight: 1.55,
            fontWeight: 600,
            color: C.white,
            letterSpacing: '-0.01em',
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
    <Section style={{
      padding: '160px 0', position: 'relative', zIndex: 1,
      borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: 900, width: '100%', padding: '0 32px', textAlign: 'center' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1 }}
          style={{
            fontSize: 'clamp(20px, 3vw, 32px)',
            lineHeight: 1.55,
            fontWeight: 600,
            color: C.white,
            letterSpacing: '-0.01em',
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
    <Section style={{ padding: '160px 0', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 900, width: '100%', padding: '0 32px', textAlign: 'center' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1 }}
          style={{
            fontSize: 'clamp(20px, 3vw, 32px)',
            lineHeight: 1.55,
            fontWeight: 600,
            color: C.white,
            letterSpacing: '-0.01em',
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
    <Section style={{ padding: '180px 0', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1040, width: '100%', padding: '0 32px' }}>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 800,
            color: C.white,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            marginBottom: 80,
            textTransform: 'uppercase',
          }}
        >
          CURRICULUM
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {modules.map((m, i) => (
            <motion.div
              key={m.no}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              style={{
                padding: '56px 4px',
                borderTop: `1px solid ${C.border}`,
                borderBottom: i === modules.length - 1 ? `1px solid ${C.border}` : 'none',
              }}
            >
              <div style={{
                fontSize: 'clamp(26px, 3.2vw, 40px)',
                fontWeight: 800,
                color: C.white,
                marginBottom: 28,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                {m.title}
              </div>
              <ul style={{
                listStyle: 'none', padding: 0, margin: 0,
                display: 'flex', flexDirection: 'column', gap: 14,
                maxWidth: 680,
              }}>
                {m.items.map((it, j) => (
                  <li key={j} style={{
                    fontSize: 17,
                    lineHeight: 1.75,
                    color: C.textMid,
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                    fontWeight: 400,
                  }}>
                    <span style={{
                      color: C.white, fontSize: 12,
                      marginTop: 10, flexShrink: 0,
                      fontWeight: 700,
                    }}>
                      —
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
    <Section style={{
      padding: '180px 0 200px', position: 'relative', zIndex: 1,
      borderTop: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: 760, width: '100%', padding: '0 32px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div style={{
            fontSize: 10, letterSpacing: 5, color: C.textMid,
            marginBottom: 24, textTransform: 'uppercase', fontWeight: 700,
          }}>
            Quantum · Access
          </div>

          <h2 style={{
            fontSize: 'clamp(36px, 6vw, 68px)',
            fontWeight: 800,
            color: C.white,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: 40,
            textTransform: 'uppercase',
          }}>
            ENTER<br />THE FIELD
          </h2>

          <div style={{
            margin: '0 auto 56px', maxWidth: 560,
            fontSize: 15, lineHeight: 1.9, color: C.textMid,
            fontWeight: 400,
          }}>
            完整五模块课程 · 量子场深度内在旅程<br />
            实时见证转化的可衡量证据<br />
            改变你的能量，创造一个新的未来
          </div>

          <div style={{
            display: 'inline-flex', flexDirection: 'column',
            padding: '48px 56px',
            border: `1px solid ${C.borderStrong}`,
            background: C.bgCard,
            marginBottom: 40,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20, color: C.white, fontWeight: 600 }}>$</span>
              <span style={{
                fontSize: 'clamp(64px, 9vw, 104px)',
                fontWeight: 800,
                color: C.white,
                letterSpacing: '-0.04em',
                lineHeight: 1,
              }}>
                ———
              </span>
            </div>
            <div style={{
              fontSize: 10, color: C.textDim,
              letterSpacing: 3, textTransform: 'uppercase', fontWeight: 500,
            }}>
              Price TBD · 价格待 ELENA 确认
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <CTAButton label="ENTER THE FIELD" large />
          </div>

          <p style={{
            fontSize: 11, color: C.textDim, marginTop: 28,
            letterSpacing: 2, fontWeight: 500,
          }}>
            受邀制 · 深度内在旅程
          </p>
        </motion.div>
      </div>
    </Section>
  )
}

function Footer() {
  return (
    <div style={{
      padding: '48px 32px 60px',
      textAlign: 'center',
      borderTop: `1px solid ${C.border}`,
      fontSize: 10, letterSpacing: 4, color: C.textDim,
      position: 'relative', zIndex: 1, fontWeight: 500,
      textTransform: 'uppercase',
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
      whileHover={{ background: C.white, color: C.bg }}
      transition={{ duration: 0.2 }}
      style={{
        padding: large ? '20px 64px' : '16px 52px',
        borderRadius: 0,
        border: `2px solid ${C.white}`,
        background: 'transparent',
        color: C.white,
        fontSize: large ? 14 : 12,
        fontWeight: 700,
        letterSpacing: 4,
        cursor: 'pointer',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        fontFamily: FONT_SANS,
        textTransform: 'uppercase',
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
      transition={{ duration: 2.4, delay: 1.6, repeat: Infinity, repeatDelay: 0.6 }}
      style={{
        marginTop: 96,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}
    >
      <div style={{ width: 1, height: 32, background: C.textMid }} />
      <span style={{
        fontSize: 9, letterSpacing: 4, color: C.textDim,
        textTransform: 'uppercase', fontWeight: 700,
      }}>
        Scroll
      </span>
    </motion.div>
  )
}
