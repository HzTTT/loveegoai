import { motion } from 'motion/react'

// 付费墙 A：企业家 / 创业者 · 进入心流
// 文案基准：@claude-opt v1
// 七模块：Hero / 当前处境 / 我们做了什么 / 课程结构 / 结果承诺 / 见证 / 定价 CTA

const C = {
  bg: '#1C1917',
  bgAlt: '#242120',
  bgCard: 'rgba(250,250,249,0.04)',
  border: 'rgba(196,168,130,0.15)',
  borderStrong: 'rgba(196,168,130,0.35)',
  gold: '#C4A882',
  goldDim: 'rgba(196,168,130,0.6)',
  goldGlow: 'rgba(196,168,130,0.12)',
  accent: '#C47D6D',
  white: '#FAFAF9',
  textMid: '#A8A29E',
  textDim: 'rgba(168,162,158,0.55)',
}

const FONT_SERIF = "'Noto Serif SC', 'Songti SC', serif"
const FONT_SANS = "'Noto Sans SC', -apple-system, sans-serif"

export default function PaywallA() {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: C.bg,
      color: C.white,
      fontFamily: FONT_SANS,
      overflow: 'hidden',
    }}>
      <TopBar />
      <Hero />
      <CurrentState />
      <WhatWeBuilt />
      <CourseStructure />
      <Promise />
      <Witness />
      <PricingCTA />
      <Footer />
    </div>
  )
}

/* ─── 顶部标签条 ─── */
function TopBar() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      padding: '14px 20px',
      background: 'rgba(28,25,23,0.72)',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{ fontSize: 12, letterSpacing: 3, color: C.goldDim, fontFamily: FONT_SERIF }}>
        LOVE · EGO · AI
      </span>
      <span style={{ fontSize: 10, letterSpacing: 2, color: C.textDim }}>
        创造者模式 · 进入心流
      </span>
    </div>
  )
}

/* ─── Section 1: Hero ─── */
function Hero() {
  return (
    <Section style={{ minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ maxWidth: 520, width: '100%', padding: '0 24px', textAlign: 'center' }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ fontSize: 11, letterSpacing: 6, color: C.goldDim, marginBottom: 32 }}
        >
          给已经很努力的你
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 34,
            fontWeight: 500,
            lineHeight: 1.5,
            color: C.white,
            marginBottom: 28,
            letterSpacing: 1,
          }}
        >
          你的下一次突破<br />
          <span style={{ color: C.gold }}>不会来自更努力</span><br />
          会来自<span style={{ color: C.gold }}>更在当下</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            fontSize: 15,
            lineHeight: 2,
            color: C.textMid,
            marginBottom: 48,
            padding: '0 12px',
          }}
        >
          从生存模式切到创造模式——<br />
          让心流、灵感、清晰判断<br />
          成为你的<span style={{ color: C.gold }}>默认状态</span>，不是偶发状态
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <CTAButton label="开始进入创造者模式" />
          <p style={{ fontSize: 11, color: C.textDim, marginTop: 20, letterSpacing: 1 }}>
            7 天免费体验 · 无需承诺
          </p>
        </motion.div>

        <ScrollHint />
      </div>
    </Section>
  )
}

/* ─── Section 2: 当前处境 ─── */
function CurrentState() {
  const states = [
    '脑子一直在转，但不在当下',
    '重要决策前最慌，越想越不清晰',
    '灵感和创造力——越需要越来不了',
    '精力被担忧未来耗掉，真正要产出时没油了',
    '知道该放松，但身体停不下来',
  ]
  return (
    <Section bg={C.bgAlt} style={{ padding: '120px 0' }}>
      <div style={{ maxWidth: 560, width: '100%', padding: '0 28px' }}>
        <SectionLabel text="当前处境" />
        <SectionTitle>
          不是你<span style={{ color: C.gold }}>不够努力</span>。<br />
          是旧程序一直在<span style={{ color: C.gold }}>后台运行</span>。
        </SectionTitle>

        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {states.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              style={{
                padding: '18px 22px',
                borderLeft: `2px solid ${C.borderStrong}`,
                background: C.bgCard,
                borderRadius: '0 8px 8px 0',
                fontSize: 14,
                lineHeight: 1.7,
                color: C.white,
              }}
            >
              {s}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            marginTop: 48, fontSize: 13, lineHeight: 2, color: C.textDim,
            fontFamily: FONT_SERIF, fontStyle: 'italic', textAlign: 'center',
          }}
        >
          这不是"你出问题了"，<br />
          是身体正在用生存模式运行。
        </motion.p>
      </div>
    </Section>
  )
}

/* ─── Section 3: 我们做了什么 ─── */
function WhatWeBuilt() {
  const mechanism = [
    {
      label: '情绪链条',
      desc: '事件 → 身体感受 → 判断 → 情绪 → 自动反应',
      detail: '你以为的决策，其实是链条跑完的结果。',
    },
    {
      label: '生存模式',
      desc: '交感神经持续激活 · 战/逃/冻',
      detail: '这种状态下，创造力、直觉、大局观都会被压制。',
    },
    {
      label: '创造模式',
      desc: '副交感神经激活 · 回到当下',
      detail: '身体松开的那一刻，判断力、灵感、心流才会回来。',
    },
  ]
  return (
    <Section style={{ padding: '120px 0' }}>
      <div style={{ maxWidth: 560, width: '100%', padding: '0 28px' }}>
        <SectionLabel text="我们做了什么" />
        <SectionTitle>
          不是"教你怎么做"，<br />
          是训练身体<span style={{ color: C.gold }}>自动切换模式</span>。
        </SectionTitle>

        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {mechanism.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              style={{
                padding: '24px 22px',
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
              }}
            >
              <div style={{
                fontSize: 11, letterSpacing: 3, color: C.goldDim,
                marginBottom: 8,
              }}>
                STEP {i + 1}
              </div>
              <div style={{
                fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 500,
                color: C.white, marginBottom: 8, letterSpacing: 1,
              }}>
                {m.label}
              </div>
              <div style={{ fontSize: 13, color: C.gold, marginBottom: 10, letterSpacing: 0.5 }}>
                {m.desc}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.8, color: C.textMid }}>
                {m.detail}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            marginTop: 40,
            padding: '24px 22px',
            borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 11, letterSpacing: 3, color: C.goldDim, marginBottom: 12 }}>
            三把钥匙
          </p>
          <p style={{
            fontFamily: FONT_SERIF, fontSize: 18, lineHeight: 2,
            color: C.white, letterSpacing: 2,
          }}>
            活在当下 · BEING 能量 · 臣服更大的力量
          </p>
        </motion.div>
      </div>
    </Section>
  )
}

/* ─── Section 4: 课程结构 ─── */
function CourseStructure() {
  const maps = [
    { name: '旧程序地图', desc: '识别并松动：讨好 / 控制 / 被否定等自动反应', icon: '◐' },
    { name: '身体反应地图', desc: '看到身体里收缩的具体位置和变化', icon: '◉' },
    { name: '新身份成长树', desc: '稳定感 · 边界感 · 丰盛感——长出来的枝叶', icon: '✦' },
    { name: '关系模式图谱', desc: '看到在关系里反复跑的那套剧本', icon: '◈' },
  ]
  const practices = [
    '呼吸球 · 身体回到当下',
    '身体感知 · 识别旧程序启动',
    '情境停顿 · 在反应之前多一秒',
    '送去未来 · 每天给未来的自己寄一片',
  ]
  return (
    <Section bg={C.bgAlt} style={{ padding: '120px 0' }}>
      <div style={{ maxWidth: 560, width: '100%', padding: '0 28px' }}>
        <SectionLabel text="课程结构" />
        <SectionTitle>
          四张<span style={{ color: C.gold }}>地图</span>，<br />
          养一个<span style={{ color: C.gold }}>未来版本的你</span>。
        </SectionTitle>

        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {maps.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                padding: '20px 16px',
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                minHeight: 140,
              }}
            >
              <div style={{ fontSize: 22, color: C.gold, marginBottom: 10 }}>{m.icon}</div>
              <div style={{
                fontFamily: FONT_SERIF, fontSize: 15, fontWeight: 500,
                color: C.white, marginBottom: 8, letterSpacing: 1,
              }}>
                {m.name}
              </div>
              <div style={{ fontSize: 11, lineHeight: 1.7, color: C.textMid }}>
                {m.desc}
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          <p style={{ fontSize: 11, letterSpacing: 3, color: C.goldDim, marginBottom: 16 }}>
            核心训练
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {practices.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  fontSize: 13, color: C.white,
                  padding: '10px 0',
                  borderBottom: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <span style={{ color: C.gold, fontSize: 10 }}>◇</span>
                {p}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ─── Section 5: 结果承诺 ─── */
function Promise() {
  const outcomes = [
    { before: '心流靠运气', after: '心流成为可以按下的开关' },
    { before: '压力下判断模糊', after: '压力下判断反而更清晰' },
    { before: '灵感等不来', after: '头脑安静了，灵感回来了' },
    { before: '被事情推着跑', after: '事情从你这里流出来' },
    { before: '同样时间同样产出', after: '质量和速度同时改变' },
  ]
  return (
    <Section style={{ padding: '120px 0' }}>
      <div style={{ maxWidth: 560, width: '100%', padding: '0 28px' }}>
        <SectionLabel text="结果承诺" />
        <SectionTitle>
          当你进入<span style={{ color: C.gold }}>创造者模式</span>——
        </SectionTitle>

        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {outcomes.map((o, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 0',
                borderBottom: i === outcomes.length - 1 ? 'none' : `1px solid ${C.border}`,
              }}
            >
              <div style={{ flex: 1, fontSize: 13, color: C.textDim, textDecoration: 'line-through' }}>
                {o.before}
              </div>
              <div style={{ color: C.gold, fontSize: 14 }}>→</div>
              <div style={{
                flex: 1.2, fontSize: 14, color: C.white, fontWeight: 500,
                fontFamily: FONT_SERIF, lineHeight: 1.5,
              }}>
                {o.after}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ─── Section 6: 见证 / 对话片段 ─── */
function Witness() {
  const voices = [
    {
      quote: '练了两周，第一次在融资 pitch 前没失眠。不是准备得更多，是身体先松下来了。',
      meta: '连续创业者 · 35',
    },
    {
      quote: '以前灵感像乞讨，现在像订阅。不是我变聪明了，是头脑终于安静了。',
      meta: 'SaaS 创始人 · 41',
    },
    {
      quote: '同样的 12 小时，产出翻倍，还没那么累。因为我不再跟自己打架。',
      meta: 'VC · 33',
    },
  ]
  return (
    <Section bg={C.bgAlt} style={{ padding: '120px 0' }}>
      <div style={{ maxWidth: 560, width: '100%', padding: '0 28px' }}>
        <SectionLabel text="见证" />
        <SectionTitle>
          他们<span style={{ color: C.gold }}>先一步</span>回到了当下。
        </SectionTitle>

        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {voices.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              style={{
                padding: '24px 22px',
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute', top: 14, left: 18,
                fontSize: 32, color: C.gold, opacity: 0.25,
                fontFamily: FONT_SERIF, lineHeight: 1,
              }}>
                "
              </div>
              <p style={{
                fontSize: 14, lineHeight: 1.9, color: C.white,
                marginBottom: 16, paddingLeft: 20,
                fontFamily: FONT_SERIF, fontStyle: 'italic',
              }}>
                {v.quote}
              </p>
              <p style={{
                fontSize: 11, letterSpacing: 2, color: C.goldDim,
                paddingLeft: 20,
              }}>
                — {v.meta}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            marginTop: 40, fontSize: 11, letterSpacing: 2,
            color: C.textDim, textAlign: 'center',
          }}
        >
          见证匿名化处理 · 征得本人同意使用
        </motion.p>
      </div>
    </Section>
  )
}

/* ─── Section 7: 定价 CTA ─── */
function PricingCTA() {
  return (
    <Section style={{ padding: '120px 0 140px' }}>
      <div style={{ maxWidth: 440, width: '100%', padding: '0 28px', textAlign: 'center' }}>
        <SectionLabel text="开始" center />

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 500,
            lineHeight: 1.5, color: C.white, marginBottom: 24, letterSpacing: 1,
          }}
        >
          你不用等<span style={{ color: C.gold }}>所有条件都具备</span>。<br />
          你只需要<span style={{ color: C.gold }}>开始</span>。
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            marginTop: 40,
            padding: '36px 28px',
            background: `linear-gradient(160deg, ${C.goldGlow}, ${C.bgCard})`,
            border: `1px solid ${C.borderStrong}`,
            borderRadius: 16,
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: 3, color: C.goldDim, marginBottom: 14 }}>
            创造者模式 · 完整训练
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 14, color: C.textMid }}>¥</span>
            <span style={{
              fontFamily: FONT_SERIF, fontSize: 48, fontWeight: 500,
              color: C.gold, letterSpacing: 1,
            }}>
              ———
            </span>
            <span style={{ fontSize: 13, color: C.textDim }}>/ 月</span>
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 28, letterSpacing: 1 }}>
            价格待 ELENA 确认
          </div>

          <ul style={{
            listStyle: 'none', padding: 0, margin: '0 0 32px',
            display: 'flex', flexDirection: 'column', gap: 12,
            fontSize: 13, color: C.white, textAlign: 'left',
          }}>
            {[
              '四张地图 · 完整训练系统',
              '核心 UX · 每日 3~5 分钟',
              '未来自己 · 每天回来看你',
              '7 天免费体验 · 随时取消',
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ color: C.gold, fontSize: 10 }}>✦</span>
                {item}
              </li>
            ))}
          </ul>

          <CTAButton label="开始进入创造者模式" large />
          <p style={{ fontSize: 10, color: C.textDim, marginTop: 16, letterSpacing: 1 }}>
            不是课程 · 是训练系统 · 养一个未来版本的你
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
      fontSize: 10, letterSpacing: 2, color: C.textDim,
    }}>
      LOVE · EGO · AI · 2026
    </div>
  )
}

/* ─── 共用组件 ─── */
function Section({
  children,
  bg,
  style,
}: {
  children: React.ReactNode
  bg?: string
  style?: React.CSSProperties
}) {
  return (
    <section style={{
      width: '100%',
      background: bg || 'transparent',
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
      transition={{ duration: 0.6 }}
      style={{
        fontSize: 11, letterSpacing: 6, color: C.goldDim,
        marginBottom: 20, textAlign: center ? 'center' : 'left',
      }}
    >
      — {text} —
    </motion.p>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8 }}
      style={{
        fontFamily: FONT_SERIF,
        fontSize: 24,
        fontWeight: 500,
        lineHeight: 1.6,
        color: C.white,
        letterSpacing: 1,
      }}
    >
      {children}
    </motion.h2>
  )
}

function CTAButton({ label, large }: { label: string; large?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      style={{
        padding: large ? '16px 48px' : '14px 40px',
        borderRadius: 32,
        border: 'none',
        background: `linear-gradient(135deg, ${C.gold}, #B8956A)`,
        color: '#1C1917',
        fontSize: large ? 15 : 14,
        fontWeight: 600,
        letterSpacing: 2,
        cursor: 'pointer',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: `0 8px 28px rgba(196,168,130,0.25)`,
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
      transition={{ duration: 2.4, delay: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
      style={{
        marginTop: 72,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}
    >
      <div style={{ width: 1, height: 24, background: C.goldDim }} />
      <span style={{ fontSize: 10, letterSpacing: 3, color: C.textDim }}>
        向下了解
      </span>
    </motion.div>
  )
}
