import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const C = {
  bg: '#14110F',
  bgSoft: '#1C1917',
  card: 'rgba(250,250,249,0.04)',
  cardBorder: 'rgba(196,168,130,0.12)',
  gold: '#C4A882',
  goldSoft: 'rgba(196,168,130,0.7)',
  goldFaint: 'rgba(196,168,130,0.15)',
  accent: '#A8C4B8',
  white: '#FAFAF9',
  textMid: '#A8A29E',
  textDim: '#78716C',
}

const MODULE_PAD = { maxWidth: 720, margin: '0 auto', padding: '0 24px' } as const

const PHASE_LABEL: Record<'inhale' | 'hold' | 'exhale', string> = {
  inhale: '吸气',
  hold: '停留',
  exhale: '呼气',
}

function BreathingOrb() {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  useEffect(() => {
    const seq: ('inhale' | 'hold' | 'exhale')[] = ['inhale', 'hold', 'exhale']
    const dur = [4000, 2000, 6000]
    let i = 0
    const tick = () => {
      setPhase(seq[i])
      const next = dur[i]
      i = (i + 1) % 3
      return setTimeout(tick, next)
    }
    const id = tick()
    return () => clearTimeout(id)
  }, [])

  const scale = phase === 'inhale' ? 1.35 : phase === 'hold' ? 1.35 : 0.85
  const duration = phase === 'inhale' ? 4 : phase === 'hold' ? 2 : 6

  return (
    <div style={{ position: 'relative', width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        animate={{ scale: scale * 0.88, opacity: 0.18 }}
        transition={{ duration, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: 260, height: 260, borderRadius: '50%',
          background: `radial-gradient(circle, ${C.gold} 0%, transparent 70%)`,
        }}
      />
      <motion.div
        animate={{ scale }}
        transition={{ duration, ease: 'easeInOut' }}
        style={{
          width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(196,168,130,0.85) 0%, rgba(120,113,108,0.5) 100%)',
          boxShadow: '0 0 60px rgba(196,168,130,0.25)',
        }}
      />
      <motion.div
        key={phase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute', color: 'rgba(255,255,255,0.85)',
          fontSize: 13, letterSpacing: 4, fontWeight: 300,
        }}
      >
        {PHASE_LABEL[phase]}
      </motion.div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, letterSpacing: 3, color: C.goldSoft, fontWeight: 500,
      textTransform: 'uppercase', marginBottom: 16,
    }}>
      {children}
    </div>
  )
}

function Divider() {
  return (
    <div style={{
      width: 1, height: 60, margin: '80px auto',
      background: `linear-gradient(to bottom, transparent, ${C.goldFaint}, transparent)`,
    }} />
  )
}

const STATES = [
  '明明拥有了该拥有的，却还是感觉不对',
  '安静不下来——脑子像有个停不下来的广播',
  '容易被一件小事带走一整天',
  '快乐总在"等某一天"——等忙完、等稳定了、等结果来',
  '到了那里又空了，下一个目标继续在前面',
]

const FEATURES = [
  {
    icon: '◐',
    title: '收缩 / 扩张觉察',
    desc: '不靠情绪词汇——身体是收着还是松的，这是进入当下最直接的指针。',
  },
  {
    icon: '◯',
    title: '回到身体微练习',
    desc: '3 分钟副交感激活。吸气、停留、呼气——让神经系统知道"现在是安全的"。',
  },
  {
    icon: '❋',
    title: '臣服与接纳引导',
    desc: '不是算了、不是放弃。是停止和生命对抗——把"应该"换成"就这样"。',
  },
  {
    icon: '✦',
    title: '存在快乐捕捉',
    desc: '每天记下一个"没有理由也在"的瞬间。喜悦从这些缝隙里长出来。',
  },
]

const PROMISES = [
  '从环境驱动切回内在驱动——外界怎么样，你知道自己在哪里',
  '副交感神经被激活——身体开始真正修复和放松',
  '喜悦不是"事情变好了"，是"事情没变但你身体松了"',
  '对未来的担忧自然松掉——不是想通了，是身体信任了',
  '活着本身成为源头——不再需要理由才能开心',
]

const WITNESS = [
  {
    quote: '第一次在一杯水里感到满足。不是觉得"我应该知足"，是身体自己松下来了。',
    label: '学员 L · 第 17 天',
  },
  {
    quote: '我没有变富，也没有换工作。但我不再等待某一天才开始快乐——这比我想象的轻得多。',
    label: '学员 W · 第 34 天',
  },
  {
    quote: '以前以为紧张是"认真"。松开之后才知道，我之前一直在用力活着。',
    label: '学员 M · 第 21 天',
  },
]

export default function PaywallC() {
  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.white,
      fontFamily: '-apple-system, "PingFang SC", system-ui, sans-serif',
      lineHeight: 1.7, paddingBottom: 120,
    }}>
      {/* 顶部 bar */}
      <div style={{ ...MODULE_PAD, display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '24px 24px', maxWidth: 960 }}>
        <div style={{ fontSize: 13, letterSpacing: 3, color: C.goldSoft }}>LOVE EGO · C</div>
        <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 1 }}>存在快乐 / 臣服生命之流</div>
      </div>

      {/* ========== 1. HERO ========== */}
      <section style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div style={{ ...MODULE_PAD, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <SectionLabel>退出抗拒 · 进入内在喜悦</SectionLabel>
            <h1 style={{
              fontSize: 44, fontWeight: 300, letterSpacing: 2, lineHeight: 1.4,
              margin: '0 0 24px', color: C.white,
            }}>
              快乐不是追来的。<br />
              是松开之后<br />
              <span style={{ color: C.gold }}>涌上来的。</span>
            </h1>
            <p style={{
              fontSize: 15, color: C.textMid, maxWidth: 520, margin: '0 auto 48px',
              lineHeight: 1.9, letterSpacing: 0.5,
            }}>
              从抗拒生命到臣服生命——从交感神经到副交感，<br />
              从战逃模式到消化吸收。喜悦从身体里长出来。
            </p>
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 40px' }}>
            <BreathingOrb />
          </div>

          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'inline-block', padding: '16px 44px',
              background: C.gold, color: C.bg, textDecoration: 'none',
              fontSize: 14, fontWeight: 500, letterSpacing: 2, borderRadius: 2,
            }}
          >
            现在就可以开始
          </motion.a>
          <div style={{ marginTop: 16, fontSize: 11, color: C.textDim, letterSpacing: 1 }}>
            ——呼应"活在当下"，不用等
          </div>
        </div>
      </section>

      <Divider />

      {/* ========== 2. 当前处境 ========== */}
      <section>
        <div style={{ ...MODULE_PAD }}>
          <SectionLabel>当前处境</SectionLabel>
          <h2 style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.6, margin: '0 0 40px', color: C.white }}>
            如果这几句里有一句是你的——<br />不是你有问题，<span style={{ color: C.goldSoft }}>是生存模式在自动运行。</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {STATES.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{
                  padding: '22px 0', borderBottom: `1px solid ${C.goldFaint}`,
                  fontSize: 17, color: C.white, fontWeight: 300,
                  display: 'flex', alignItems: 'baseline', gap: 16,
                }}
              >
                <span style={{ color: C.goldSoft, fontSize: 11, minWidth: 24 }}>
                  0{i + 1}
                </span>
                <span style={{ lineHeight: 1.7 }}>{s}</span>
              </motion.div>
            ))}
          </div>
          <p style={{ marginTop: 32, fontSize: 13, color: C.textDim, lineHeight: 1.9 }}>
            这不是你"不够好"，也不是"想太多"。<br />
            这是神经系统长期在交感主导下的正常反应——<br />
            你只是一直没有机会，切换到另一边。
          </p>
        </div>
      </section>

      <Divider />

      {/* ========== 3. 底层原理 ========== */}
      <section>
        <div style={{ ...MODULE_PAD }}>
          <SectionLabel>这里发生了什么</SectionLabel>
          <h2 style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.6, margin: '0 0 32px', color: C.white }}>
            情绪链条在毫秒间替你做了选择。
          </h2>
          <p style={{ fontSize: 15, color: C.textMid, lineHeight: 2, marginBottom: 40 }}>
            过去的经历 → 形成对世界的评判 → 产生身体感受 → 产生情绪 → 固化成自动反应。<br />
            所以即使事情变了、环境变了、人变了，只要这条链条没变——<br />
            历史就会重演。
          </p>

          <div style={{
            background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 4,
            padding: '28px 24px', marginTop: 8,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 2, marginBottom: 8 }}>
                  生存模式
                </div>
                <div style={{ fontSize: 15, color: C.white, fontWeight: 300, lineHeight: 1.9 }}>
                  交感神经主导<br />
                  用过去预测未来<br />
                  被恐惧、匮乏驱动<br />
                  <span style={{ color: C.textDim }}>→ 持续紧张</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.gold, letterSpacing: 2, marginBottom: 8 }}>
                  创造模式
                </div>
                <div style={{ fontSize: 15, color: C.white, fontWeight: 300, lineHeight: 1.9 }}>
                  副交感神经激活<br />
                  消化 · 吸收 · 修复<br />
                  被信任、接纳带动<br />
                  <span style={{ color: C.gold }}>→ 内在喜悦涌现</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ========== 4. 产品怎么帮 ========== */}
      <section>
        <div style={{ ...MODULE_PAD }}>
          <SectionLabel>产品怎么帮你</SectionLabel>
          <h2 style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.6, margin: '0 0 40px', color: C.white }}>
            四件事，每天十分钟。<br />
            <span style={{ color: C.goldSoft }}>不是努力去快乐，是让神经系统重新认识"安全"。</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{
                  display: 'flex', gap: 24, padding: '24px 28px',
                  background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 4,
                }}
              >
                <div style={{
                  fontSize: 28, color: C.gold, minWidth: 40,
                  display: 'flex', alignItems: 'flex-start', paddingTop: 2,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 16, color: C.white, marginBottom: 8, fontWeight: 500 }}>
                    {f.title}
                  </div>
                  <div style={{ fontSize: 14, color: C.textMid, lineHeight: 1.9 }}>
                    {f.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ========== 5. 结果承诺 ========== */}
      <section>
        <div style={{ ...MODULE_PAD }}>
          <SectionLabel>训练之后会发生什么</SectionLabel>
          <h2 style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.6, margin: '0 0 40px', color: C.white }}>
            不是消除问题，<br />
            <span style={{ color: C.gold }}>是打开本就有的东西。</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {PROMISES.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                style={{
                  display: 'flex', alignItems: 'baseline', gap: 20,
                  padding: '20px 0', borderTop: i === 0 ? `1px solid ${C.goldFaint}` : 'none',
                  borderBottom: `1px solid ${C.goldFaint}`,
                }}
              >
                <span style={{ fontSize: 16, color: C.gold }}>✦</span>
                <span style={{ fontSize: 16, color: C.white, fontWeight: 300, lineHeight: 1.8 }}>
                  {p}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ========== 6. 见证 ========== */}
      <section>
        <div style={{ ...MODULE_PAD }}>
          <SectionLabel>已经进来的人说</SectionLabel>
          <h2 style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.6, margin: '0 0 40px', color: C.white }}>
            不是"治好了"。<br />
            <span style={{ color: C.goldSoft }}>是"没那么紧了"。</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {WITNESS.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                style={{
                  borderLeft: `2px solid ${C.gold}`,
                  paddingLeft: 20, paddingTop: 6, paddingBottom: 6,
                }}
              >
                <div style={{ fontSize: 16, color: C.white, lineHeight: 1.9, fontWeight: 300, marginBottom: 10 }}>
                  "{w.quote}"
                </div>
                <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 2 }}>
                  — {w.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ========== 7. 定价 + CTA ========== */}
      <section id="pricing">
        <div style={{ ...MODULE_PAD }}>
          <SectionLabel>开始你的内在驱动</SectionLabel>
          <h2 style={{ fontSize: 28, fontWeight: 300, lineHeight: 1.5, margin: '0 0 12px', color: C.white, textAlign: 'center' }}>
            同一个训练系统。<br />
            <span style={{ color: C.gold }}>从今天开始，让身体重新认识松。</span>
          </h2>
          <p style={{ fontSize: 13, color: C.textDim, textAlign: 'center', marginBottom: 48, letterSpacing: 1 }}>
            30 天内任意时刻退款 · 不用理由
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { name: '月卡', price: '¥99', per: '/月', note: '先试试', featured: false },
              { name: '年卡', price: '¥599', per: '/年', note: '完整的神经系统重塑周期', featured: true },
              { name: '终身', price: '¥1999', per: '一次', note: '为以后的每一个现在', featured: false },
            ].map((tier) => (
              <div
                key={tier.name}
                style={{
                  padding: '28px 20px',
                  background: tier.featured ? 'rgba(196,168,130,0.08)' : C.card,
                  border: `1px solid ${tier.featured ? C.gold : C.cardBorder}`,
                  borderRadius: 4, position: 'relative',
                }}
              >
                {tier.featured && (
                  <div style={{
                    position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                    background: C.gold, color: C.bg, fontSize: 10, letterSpacing: 2,
                    padding: '3px 10px', borderRadius: 2, fontWeight: 500,
                  }}>
                    最推荐
                  </div>
                )}
                <div style={{ fontSize: 13, color: C.textMid, letterSpacing: 2, marginBottom: 12 }}>
                  {tier.name}
                </div>
                <div style={{ fontSize: 32, color: C.white, fontWeight: 300, marginBottom: 4 }}>
                  {tier.price}
                  <span style={{ fontSize: 12, color: C.textDim, marginLeft: 4 }}>{tier.per}</span>
                </div>
                <div style={{ fontSize: 11, color: tier.featured ? C.gold : C.textDim, lineHeight: 1.6 }}>
                  {tier.note}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, padding: '28px 24px', background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 4 }}>
            <div style={{ fontSize: 12, color: C.goldSoft, letterSpacing: 2, marginBottom: 14 }}>
              所有方案都包含
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13, color: C.textMid, lineHeight: 2 }}>
              <div>✦ 存在快乐训练 · 21 节</div>
              <div>✦ 收缩 / 扩张觉察日记</div>
              <div>✦ 回到身体微练习库</div>
              <div>✦ 接纳与臣服引导音频</div>
              <div>✦ 每日 BEING 时刻捕捉</div>
              <div>✦ AI 陪伴对话（24 小时）</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-block', padding: '18px 56px',
                background: C.gold, color: C.bg, textDecoration: 'none',
                fontSize: 15, fontWeight: 500, letterSpacing: 3, borderRadius: 2,
              }}
            >
              现在就可以开始
            </motion.a>
            <div style={{ marginTop: 18, fontSize: 12, color: C.textDim, letterSpacing: 1, lineHeight: 1.9 }}>
              不用等"准备好"。<br />
              活在当下——从按下这一下开始。
            </div>
          </div>
        </div>
      </section>

      {/* 底部品牌 */}
      <footer style={{ ...MODULE_PAD, textAlign: 'center', marginTop: 80, paddingTop: 32, borderTop: `1px solid ${C.goldFaint}` }}>
        <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 3, lineHeight: 2 }}>
          LOVE EGO AI · 同一套底层训练 · 三个入口
        </div>
        <div style={{ fontSize: 10, color: C.textDim, marginTop: 8, letterSpacing: 1 }}>
          心流创造 / BEING 魅力 / 存在快乐 ← 你在这
        </div>
      </footer>
    </div>
  )
}
