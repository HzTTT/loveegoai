import { motion } from 'motion/react'

/*
  Paywall A · 企业家方向 · 量子场
  文案：ELENA 原文（msg=696c8429），一字不改
  UI 方向：高净值男性审美 —— 深碳黑 / 冷金属铂金 / 几何精密感
  NOTE: ELENA 原稿模块编号跳过 3（直接给 1/2/4/5），按原样保留
*/

const C = {
  bg: '#07080C',
  bgDeep: '#050609',
  bgNavy: '#0B1221',
  bgCard: 'rgba(184,193,212,0.03)',
  bgCardHi: 'rgba(201,181,138,0.04)',
  border: 'rgba(201,181,138,0.12)',
  borderStrong: 'rgba(201,181,138,0.3)',
  borderCool: 'rgba(184,193,212,0.14)',
  platinum: '#C9B58A',
  platinumDim: 'rgba(201,181,138,0.55)',
  platinumGlow: 'rgba(201,181,138,0.08)',
  silver: '#B8C1D4',
  silverDim: 'rgba(184,193,212,0.55)',
  quantum: '#6E8AB8',
  white: '#F1F2F5',
  textMid: '#9AA0AB',
  textDim: 'rgba(154,160,171,0.5)',
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
      <Hero />
      <Opportunity />
      <Evidence />
      <Learning />
      <Modules />
      <PricingCTA />
      <Footer />
    </div>
  )
}

/* ─── 量子场背景 · 静态星点 ─── */
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
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
    }}>
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

/* ─── 顶部条 ─── */
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
      <span style={{
        fontSize: 11, letterSpacing: 6, color: C.platinumDim,
        fontFamily: FONT_SERIF, fontWeight: 400,
      }}>
        LOVE · EGO · AI
      </span>
      <span style={{ fontSize: 9, letterSpacing: 3, color: C.textDim }}>
        QUANTUM · FIELD · ACCESS
      </span>
    </div>
  )
}

/* ─── Hero ─── */
function Hero() {
  return (
    <Section style={{ minHeight: '100vh', paddingTop: 100, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 620, width: '100%', padding: '0 28px', textAlign: 'center' }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          style={{
            fontSize: 10, letterSpacing: 8, color: C.platinumDim,
            marginBottom: 40, textTransform: 'uppercase',
          }}
        >
          for those ready to transcend
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 40,
            fontWeight: 500,
            lineHeight: 1.4,
            color: C.white,
            marginBottom: 36,
            letterSpacing: 2,
          }}
        >
          深入<span style={{ color: C.platinum }}>量子场</span><br />
          进行<span style={{ color: C.platinum }}>深度内在旅程</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          style={{
            width: 60, height: 1,
            background: `linear-gradient(90deg, transparent, ${C.platinum}, transparent)`,
            margin: '0 auto 36px',
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.8 }}
          style={{
            fontSize: 15,
            lineHeight: 2,
            color: C.textMid,
            marginBottom: 56,
            padding: '0 4px',
            fontFamily: FONT_SERIF,
          }}
        >
          这个无穷无尽、不可估量的源头创造场，<br />
          是所有人类经验作为<span style={{ color: C.silver }}>思想和想象的前兆</span>而存在的地方——<br />
          一个超越我们已知的、可感知的、<br />
          三维时空现实的<span style={{ color: C.platinum }}>无限可能之地</span>。
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
        >
          <CTAButton label="进入量子场" />
          <p style={{ fontSize: 10, color: C.textDim, marginTop: 22, letterSpacing: 2 }}>
            受邀制 · 深度内在旅程
          </p>
        </motion.div>

        <ScrollHint />
      </div>
    </Section>
  )
}

/* ─── 机会段 ─── */
function Opportunity() {
  return (
    <Section style={{ padding: '140px 0', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 620, width: '100%', padding: '0 32px' }}>
        <SectionLabel text="THE OPPORTUNITY" />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1 }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 22,
            lineHeight: 2,
            color: C.white,
            marginTop: 40,
            letterSpacing: 1.5,
            textAlign: 'center',
          }}
        >
          旨在挑战你掌控自己的生活<br />
          将为你提供无数机会，<br />
          让你<span style={{ color: C.platinum }}>超越自我</span>，<br />
          并与这个<span style={{ color: C.platinum }}>无限的、赋予生命的能量源头</span>相连。
        </motion.p>
      </div>
    </Section>
  )
}

/* ─── 证据段 ─── */
function Evidence() {
  const pillars = [
    { label: 'REAL-TIME', title: '实时见证', detail: '转化的可衡量证据' },
    { label: 'SCIENCE', title: '潜能的科学', detail: '唤醒大脑和身体潜在系统中存在的潜能' },
    { label: 'REPROGRAM', title: '重新编程', detail: '挑战当前的信念，超越您的局限' },
  ]
  return (
    <Section
      style={{
        padding: '140px 0',
        background: `linear-gradient(180deg, transparent, ${C.bgNavy} 50%, transparent)`,
        position: 'relative', zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 620, width: '100%', padding: '0 32px' }}>
        <SectionLabel text="MEASURABLE EVIDENCE" />
        <SectionTitle>
          实时见证<span style={{ color: C.platinum }}>转化的可衡量证据</span>，<br />
          并学习唤醒大脑和身体潜在系统中<br />
          存在潜能的<span style={{ color: C.platinum }}>科学</span>。
        </SectionTitle>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{
            marginTop: 28,
            fontSize: 14, lineHeight: 2, color: C.textMid,
            textAlign: 'center', letterSpacing: 0.5,
          }}
        >
          帮助您挑战当前的信念，<br />
          并重新编程您的大脑和身体，<br />
          <span style={{ color: C.silver }}>从而超越您的局限</span>。
        </motion.p>

        <div style={{
          marginTop: 64, display: 'grid', gridTemplateColumns: '1fr', gap: 14,
        }}>
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              style={{
                padding: '22px 26px',
                background: C.bgCard,
                border: `1px solid ${C.borderCool}`,
                borderLeft: `2px solid ${C.platinum}`,
                display: 'flex', alignItems: 'center', gap: 20,
              }}
            >
              <div style={{
                fontSize: 9, letterSpacing: 4, color: C.platinumDim,
                minWidth: 78,
              }}>
                {p.label}
              </div>
              <div>
                <div style={{
                  fontFamily: FONT_SERIF, fontSize: 16, color: C.white,
                  marginBottom: 4, letterSpacing: 1,
                }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.6 }}>
                  {p.detail}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ─── 学习段 ─── */
function Learning() {
  return (
    <Section style={{ padding: '140px 0', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 620, width: '100%', padding: '0 32px', textAlign: 'center' }}>
        <SectionLabel text="WHAT YOU WILL LEARN" center />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1 }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 22,
            lineHeight: 2,
            color: C.white,
            marginTop: 40,
            letterSpacing: 1.5,
          }}
        >
          通过学习，<br />
          您将学习如何<span style={{ color: C.platinum }}>改变您的能量</span>，<br />
          从过去中解脱出来，<br />
          并<span style={{ color: C.platinum }}>创造一个新的未来</span>。
        </motion.p>
      </div>
    </Section>
  )
}

/* ─── 模块 1 / 2 / 4 / 5 ─── */
function Modules() {
  const modules = [
    {
      no: '01',
      title: '改变的科学',
      items: [
        '了解大脑、身体和能量是如何相互作用的。',
        '探索为什么改变如此困难，以及如何克服旧的习惯。',
        '学习如何从"生存模式"切换到"创造模式"。',
      ],
    },
    {
      no: '02',
      title: '超越自我',
      items: [
        '学习如何超越你的环境、你的身体和时间。',
        '发现如何进入量子场——一个充满无限可能性的领域。',
        '练习将你的注意力从已知世界转移到未知世界。',
      ],
    },
    {
      no: '04',
      title: '重新编程你的潜意识',
      items: [
        '了解潜意识是如何运作的，以及如何进入它。',
        '学习如何打破旧的情绪链条和自动反应。',
      ],
    },
    {
      no: '05',
      title: '活出你的新现实',
      items: [
        '学习如何将这些教学应用到你的日常生活中。',
        '发现如何保持你的新状态，无论外部环境如何。',
        '体验作为自己生活的创造者所带来的力量和自由。',
      ],
    },
  ]
  return (
    <Section
      style={{
        padding: '140px 0',
        background: `linear-gradient(180deg, transparent, ${C.bgNavy} 50%, transparent)`,
        position: 'relative', zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 620, width: '100%', padding: '0 32px' }}>
        <SectionLabel text="CURRICULUM" />
        <SectionTitle>
          五个<span style={{ color: C.platinum }}>模块</span>，<br />
          一次彻底的<span style={{ color: C.platinum }}>内在重构</span>。
        </SectionTitle>

        <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {modules.map((m, i) => (
            <motion.div
              key={m.no}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              style={{
                padding: '28px 26px',
                background: C.bgCardHi,
                border: `1px solid ${C.border}`,
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute', top: 20, right: 22,
                fontFamily: FONT_SERIF, fontSize: 40, fontWeight: 300,
                color: C.platinumGlow, lineHeight: 1,
                letterSpacing: 2,
              }}>
                {m.no}
              </div>
              <div style={{
                fontSize: 9, letterSpacing: 4, color: C.platinumDim,
                marginBottom: 10,
              }}>
                模块 {m.no.replace(/^0/, '')}
              </div>
              <div style={{
                fontFamily: FONT_SERIF, fontSize: 22, fontWeight: 500,
                color: C.white, marginBottom: 18, letterSpacing: 1.5,
              }}>
                {m.title}
              </div>
              <ul style={{
                listStyle: 'none', padding: 0, margin: 0,
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                {m.items.map((it, j) => (
                  <li key={j} style={{
                    fontSize: 13.5, lineHeight: 1.8, color: C.textMid,
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}>
                    <span style={{
                      color: C.platinum, fontSize: 9,
                      marginTop: 8, flexShrink: 0,
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

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            marginTop: 28, fontSize: 10, letterSpacing: 2,
            color: C.textDim, textAlign: 'center',
          }}
        >
          * 原稿模块顺序 01 / 02 / 04 / 05
        </motion.p>
      </div>
    </Section>
  )
}

/* ─── 定价 CTA ─── */
function PricingCTA() {
  return (
    <Section style={{ padding: '140px 0 160px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 500, width: '100%', padding: '0 32px', textAlign: 'center' }}>
        <SectionLabel text="BEGIN" center />

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{
            fontFamily: FONT_SERIF, fontSize: 28, fontWeight: 500,
            lineHeight: 1.6, color: C.white, marginBottom: 40,
            letterSpacing: 2, marginTop: 28,
          }}
        >
          <span style={{ color: C.platinum }}>超越自我</span><br />
          从当下这一刻开始
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{
            marginTop: 28,
            padding: '44px 32px',
            background: `linear-gradient(160deg, ${C.platinumGlow}, ${C.bgCard})`,
            border: `1px solid ${C.borderStrong}`,
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: '50%', width: 40, height: 1,
            background: C.platinum, transform: 'translateX(-50%)',
          }} />

          <div style={{ fontSize: 10, letterSpacing: 5, color: C.platinumDim, marginBottom: 20 }}>
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
          <div style={{ fontSize: 10, color: C.textDim, marginBottom: 36, letterSpacing: 2 }}>
            PRICE TBD · 价格待确认
          </div>

          <ul style={{
            listStyle: 'none', padding: 0, margin: '0 0 40px',
            display: 'flex', flexDirection: 'column', gap: 14,
            fontSize: 13, color: C.white, textAlign: 'left',
          }}>
            {[
              '五个模块 · 完整课程',
              '深度内在旅程 · 量子场实操',
              '实时可衡量的转化证据',
              '重新编程大脑与身体的科学',
            ].map((item, i) => (
              <li key={i} style={{
                display: 'flex', gap: 12, alignItems: 'center',
                paddingBottom: 10, borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{ color: C.platinum, fontSize: 9 }}>◆</span>
                <span style={{ letterSpacing: 0.5 }}>{item}</span>
              </li>
            ))}
          </ul>

          <CTAButton label="进入量子场" large />
          <p style={{
            fontSize: 10, color: C.textDim, marginTop: 20,
            letterSpacing: 2, lineHeight: 1.8,
          }}>
            超越自我 · 重写未来
          </p>
        </motion.div>
      </div>
    </Section>
  )
}

/* ─── Footer ─── */
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

/* ─── 共用 ─── */
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

function SectionLabel({ text, center }: { text: string; center?: boolean }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      style={{
        fontSize: 10, letterSpacing: 8, color: C.platinumDim,
        textAlign: center ? 'center' : 'left',
        display: 'flex', alignItems: 'center',
        gap: 14,
        justifyContent: center ? 'center' : 'flex-start',
      }}
    >
      <span style={{
        width: 24, height: 1, background: C.platinumDim,
      }} />
      {text}
      <span style={{
        width: 24, height: 1, background: C.platinumDim,
      }} />
    </motion.p>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9 }}
      style={{
        fontFamily: FONT_SERIF,
        fontSize: 26,
        fontWeight: 500,
        lineHeight: 1.6,
        color: C.white,
        letterSpacing: 1.5,
        marginTop: 24,
        textAlign: 'center',
      }}
    >
      {children}
    </motion.h2>
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
        position: 'relative',
        overflow: 'hidden',
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
