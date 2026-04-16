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
      <VisionSection />
      <Modules />
      <CasesSection />
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

/* ─── 愿景段（ELENA 原文方向：画饼 · 融资 / 上市 / 全世界喜爱的产品） ─── */
function VisionSection() {
  const lines = [
    '你也可以融资。',
    '你也可以上市。',
    '你也可以做全世界人都喜爱的产品。',
  ]
  return (
    <Section style={{
      padding: '180px 0',
      position: 'relative', zIndex: 1,
      borderTop: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: 900, width: '100%', padding: '0 32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 72 }}>
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, delay: i * 0.15 }}
              style={{
                fontSize: 'clamp(28px, 4.5vw, 56px)',
                fontWeight: 800,
                color: C.white,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ width: 60, height: 2, background: C.white, margin: '0 auto 48px' }}
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7 }}
          style={{
            fontSize: 'clamp(18px, 2.5vw, 26px)',
            fontWeight: 400,
            color: C.textMid,
            letterSpacing: '0.04em',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          你需要的只是让灵光流过你。
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

/* ─── 用户 CASE（ELENA 确认文案） ─── */
function CasesSection() {
  const cases = [
    {
      tag: '灵感创造',
      body: '练到第三周，脑子里突然冒出一个产品 idea——不是从市场分析里挤出来的，是在停顿的那几秒里来的。上线第一年 ARR 就做到了 $10M，团队至今不敢相信节奏这么顺。不是我变聪明，是我不再挡自己的路。',
      author: 'SaaS 创始人 · B2B 赛道 · 38',
    },
    {
      tag: '第一性原理',
      body: '我在供应链里卡了两年，一直用战术思维堆方案。进入量子场那次深度旅程之后，第一次真的把问题抽到了第一性原理——同一个月砍掉了 37% 的冗余成本，毛利率翻倍。不是多想了一步，是站到了"从未想过的那一层"。',
      author: '消费品创始人 · 41',
    },
    {
      tag: '能量转换 · 销售额',
      body: '我一直在推销售团队"更努力"。自己先从生存模式切到创造模式之后，团队也松了，Q3 销售额环比 +62%。我以为是方法问题，其实是能量问题。',
      author: '区域销售总监 · 34',
    },
    {
      tag: '决策清晰 · 融资',
      body: '融资轮卡了 11 个月，一直在"更努力证明自己"。放下之后第一次 pitch，估值从 $8M 跳到 $22M。不是 deck 改了，是我终于不想从他们那里拿东西了。',
      author: 'Pre-A 创始人 · 36',
    },
  ]
  return (
    <Section style={{
      padding: '180px 0',
      position: 'relative', zIndex: 1,
      borderTop: `1px solid ${C.border}`,
    }}>
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
          FIELD REPORTS
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              style={{
                padding: '56px 4px',
                borderTop: `1px solid ${C.border}`,
                borderBottom: i === cases.length - 1 ? `1px solid ${C.border}` : 'none',
              }}
            >
              <div style={{
                fontSize: 10, letterSpacing: 4, color: C.textMid,
                fontWeight: 700, textTransform: 'uppercase', marginBottom: 20,
              }}>
                {c.tag}
              </div>
              <p style={{
                fontSize: 'clamp(16px, 1.8vw, 20px)',
                lineHeight: 1.8,
                color: C.white,
                fontWeight: 400,
                margin: '0 0 28px',
                maxWidth: 740,
              }}>
                {c.body}
              </p>
              <div style={{
                fontSize: 11, letterSpacing: 3, color: C.textDim,
                fontWeight: 500,
              }}>
                — {c.author}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ─── 定价 CTA ─── */
function PricingCTA() {
  const includes = [
    '改变的科学',
    '超越自我',
    '重新编程你的潜意识',
    '活出你的新现实',
  ]
  return (
    <Section style={{
      padding: '180px 0 200px', position: 'relative', zIndex: 1,
      borderTop: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: 680, width: '100%', padding: '0 32px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div style={{
            fontSize: 10, letterSpacing: 5, color: C.textMid,
            marginBottom: 32, textTransform: 'uppercase', fontWeight: 700,
          }}>
            Quantum · Access
          </div>

          <h2 style={{
            fontSize: 'clamp(36px, 6vw, 68px)',
            fontWeight: 800,
            color: C.white,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: 64,
            textTransform: 'uppercase',
          }}>
            ENTER<br />THE FIELD
          </h2>

          {/* 定价卡片 */}
          <div style={{
            padding: '48px 36px',
            border: `1px solid ${C.borderStrong}`,
            background: C.bgCard,
            marginBottom: 48,
          }}>
            {/* 价格 */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{
                display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4,
                marginBottom: 14,
              }}>
                <span style={{
                  fontSize: 'clamp(22px, 3vw, 32px)',
                  fontWeight: 700,
                  color: C.white,
                }}>$</span>
                <span style={{
                  fontSize: 'clamp(48px, 8vw, 80px)',
                  fontWeight: 800,
                  color: C.white,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}>
                  888
                </span>
              </div>
              <div style={{
                fontSize: 10, color: C.textDim,
                letterSpacing: 3, textTransform: 'uppercase', fontWeight: 500,
              }}>
                USD · 美金
              </div>
            </div>

            {/* 分隔线 */}
            <div style={{ height: 1, background: C.border, marginBottom: 32 }} />

            {/* 课程包含（4 个模块标题，来自原文） */}
            <div style={{
              fontSize: 10, letterSpacing: 4, color: C.textMid,
              marginBottom: 20, textTransform: 'uppercase', fontWeight: 700,
              textAlign: 'center',
            }}>
              课程包含
            </div>
            <ul style={{
              listStyle: 'none', padding: 0, margin: 0,
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {includes.map((item, i) => (
                <li key={i} style={{
                  display: 'flex', gap: 14, alignItems: 'center',
                  fontSize: 15, color: C.white, lineHeight: 1.4,
                  fontWeight: 500, justifyContent: 'center',
                }}>
                  <span style={{ color: C.white, fontWeight: 700, flexShrink: 0 }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <CTAButton label="ENTER THE FIELD" large />

          <p style={{
            fontSize: 11, color: C.textDim, marginTop: 24,
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
