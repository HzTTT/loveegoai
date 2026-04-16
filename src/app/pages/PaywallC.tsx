import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

/*
  Paywall C · 内在工程 · 白色禅意风格
  文案：ELENA 原文 (msg=be977470)，一字不改
  UI：白底 / 暖金点缀 / 大量留白 / 轻盈细字 / 禅意极简
  价格：$1200 USD
*/

const C = {
  bg: '#FAFAF8',
  bgAlt: '#F5F2EE',
  text: '#1C1917',
  textMid: '#78716C',
  textDim: '#A8A29E',
  gold: '#B8956A',
  goldSoft: 'rgba(184,149,106,0.6)',
  goldFaint: 'rgba(184,149,106,0.15)',
  border: 'rgba(28,25,23,0.08)',
  borderMid: 'rgba(28,25,23,0.14)',
}

const FONT = '"Noto Serif SC", "Source Han Serif SC", Georgia, "PingFang SC", serif'
const FONT_SANS = '-apple-system, "PingFang SC", "Hiragino Sans GB", system-ui, sans-serif'
const MODULE_PAD = { maxWidth: 680, margin: '0 auto', padding: '0 24px' } as const

/* ── 呼吸球（浅色版） ── */
const PHASE_LABEL: Record<'inhale' | 'hold' | 'exhale', string> = {
  inhale: '吸气', hold: '停留', exhale: '呼气',
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

  const scale = phase === 'inhale' ? 1.3 : phase === 'hold' ? 1.3 : 0.82
  const dur = phase === 'inhale' ? 4 : phase === 'hold' ? 2 : 6

  return (
    <div style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        animate={{ scale: scale * 0.9, opacity: 0.25 }}
        transition={{ duration: dur, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: 160, height: 160, borderRadius: '50%',
          background: `radial-gradient(circle, ${C.gold} 0%, transparent 70%)`,
        }}
      />
      <motion.div
        animate={{ scale }}
        transition={{ duration: dur, ease: 'easeInOut' }}
        style={{
          width: 110, height: 110, borderRadius: '50%',
          background: `radial-gradient(circle at 38% 38%, rgba(184,149,106,0.55) 0%, rgba(184,149,106,0.2) 100%)`,
          border: `1px solid rgba(184,149,106,0.3)`,
        }}
      />
      <motion.div
        key={phase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ position: 'absolute', color: C.gold, fontSize: 10, letterSpacing: 4, fontFamily: FONT_SANS }}
      >
        {PHASE_LABEL[phase]}
      </motion.div>
    </div>
  )
}

function Divider() {
  return (
    <div style={{ width: 1, height: 48, margin: '72px auto', background: `linear-gradient(to bottom, transparent, ${C.goldFaint}, transparent)` }} />
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 9, letterSpacing: 4, color: C.gold, fontWeight: 400,
      textTransform: 'uppercase', marginBottom: 16, fontFamily: FONT_SANS,
    }}>
      {children}
    </div>
  )
}

export default function PaywallC() {
  return (
    <div translate="no" style={{
      minHeight: '100vh', background: C.bg, color: C.text,
      fontFamily: FONT, lineHeight: 1.9, paddingBottom: 120,
    }}>
      {/* 顶部 bar */}
      <div style={{
        maxWidth: 960, margin: '0 auto', padding: '24px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: `1px solid ${C.border}`,
        fontFamily: FONT_SANS,
      }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.gold }}>LOVE · EGO · AI</div>
        <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 2 }}>内在工程</div>
      </div>

      {/* ── 1. HERO ── */}
      <section style={{ paddingTop: 96, paddingBottom: 56 }}>
        <div style={{ ...MODULE_PAD, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          >
            <Label>什么是内在工程</Label>
            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 300, letterSpacing: '0.04em',
              lineHeight: 1.55, margin: '0 0 36px', color: C.text,
            }}>
              一门源自创造<br />
              <em style={{ color: C.gold, fontStyle: 'italic' }}>内在幸福</em>的技术
            </h1>
            <p style={{ fontSize: 14, color: C.textMid, fontFamily: FONT_SANS, letterSpacing: 0.5, lineHeight: 2 }}>
              改变你对生活、工作<br />以及所生活的世界的认知与感受
            </p>
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '48px 0' }}>
            <BreathingOrb />
          </div>

          <motion.a
            href="#pricing"
            whileHover={{ background: C.gold, color: C.bg }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'inline-block', padding: '14px 44px',
              border: `1px solid ${C.gold}`, color: C.gold,
              background: 'transparent', textDecoration: 'none',
              fontSize: 11, fontFamily: FONT_SANS, letterSpacing: 3,
            }}
          >
            现在就可以开始
          </motion.a>
        </div>
      </section>

      <Divider />

      {/* ── 2. 介绍段落 ── */}
      <section style={{ background: C.bgAlt, padding: '72px 0' }}>
        <div style={{ ...MODULE_PAD }}>
          {[
            '内在工程是一门个人成长的综合课程，会改变你对生活、工作、以及所生活的世界的认知与感受。',
            '让你通过强大的自我转化过程、探索自己最大的潜能，解决生活中的关键问题，获取古代智慧的秘密。内在工程为自我探索和转化提供了一个独特的机会，带领我们走向充实和快乐的生活。',
            '这些工具具备改变你生活、行为和体验生命的方式的潜力。你可以在自己的空间里，按你自己的节奏与我们一起体验内在工程课程。',
          ].map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 1, delay: i * 0.12 }}
              style={{
                fontSize: i === 0 ? 18 : 15,
                color: i === 0 ? C.text : C.textMid,
                fontWeight: i === 0 ? 400 : 300,
                lineHeight: 2, margin: '0 0 28px',
                fontFamily: i === 0 ? FONT : FONT_SANS,
              }}
            >
              {p}
            </motion.p>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── 3. 六项益处 ── */}
      <section>
        <div style={{ ...MODULE_PAD }}>
          <Label>你将获得</Label>
          {[
            '保持一整天的精力充沛和机敏',
            '改善沟通和人际关系',
            '提高思维清晰度，情绪平衡和工作效率',
            '消除压力、恐惧和焦虑',
            '能缓解慢性疾病的无压力的生活',
            '获得喜悦、宁静和满足',
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.07 }}
              style={{
                padding: '18px 0', borderBottom: `1px solid ${C.border}`,
                fontSize: 15, color: C.text, fontWeight: 300,
                display: 'flex', alignItems: 'baseline', gap: 18,
                fontFamily: FONT_SANS,
              }}
            >
              <span style={{ color: C.goldSoft, fontSize: 9, minWidth: 20, letterSpacing: 1 }}>0{i + 1}</span>
              <span>{item}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── 4. 研究数据 ── */}
      <section style={{ background: C.bgAlt, padding: '80px 0' }}>
        <div style={{ ...MODULE_PAD, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            <div style={{
              fontSize: 'clamp(64px, 12vw, 112px)',
              fontWeight: 200, color: C.gold,
              letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 24,
              fontFamily: FONT_SANS,
            }}>
              50%
            </div>
            <p style={{
              fontSize: 13, color: C.textMid, letterSpacing: 1,
              lineHeight: 2, margin: 0, fontFamily: FONT_SANS,
            }}>
              内在工程在线课程让受试参与者<br />压力减轻 50% 以上
            </p>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ── 5. 用户分享 ── */}
      <section>
        <div style={{ ...MODULE_PAD }}>
          <Label>用户分享</Label>
          {[
            {
              quote: '给予人一整天不受压力过度干扰的力量和稳定性。在面对生活扔给我的各种挑战时，我的镇定和平静感绝对是提高了很多。',
              name: 'Ravi Venkatesan（维文卡特桑）',
              title: '印度微软前主席',
            },
            {
              quote: '我发现活在这个时代特别奇妙，因为灵性和科学之间有了一个崭新的交汇点。这就是我很喜欢你把它称为内在工程的原因。',
              name: 'Arianna Huffington（阿丽安娜·赫芬顿）',
              title: '赫芬顿邮报创始人',
            },
            {
              quote: '内在工程教我们抛弃自己的痛苦并去喜悦地生活。学到的最重要一点是，我们需要"创造生活"，而不是"维持生计"。',
              name: 'Chandrababu Naidu',
              title: '印度安德拉邦首席部长',
            },
          ].map((w, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: i * 0.1 }}
              style={{ padding: '44px 0', borderBottom: `1px solid ${C.border}` }}
            >
              <p style={{
                fontSize: 16, color: C.text, fontWeight: 300,
                lineHeight: 2, margin: '0 0 18px', fontStyle: 'italic',
              }}>
                "{w.quote}"
              </p>
              <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2, fontFamily: FONT_SANS }}>
                — {w.name}，{w.title}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── 6. 智慧语录 ── */}
      <section style={{ background: C.bgAlt, padding: '72px 0' }}>
        <div style={{ ...MODULE_PAD }}>
          <Label>生命的智慧</Label>
          {[
            { title: '生命的机制', quote: '世界上最精密的机器是人体。但你还没看过用户手册。让我们来一起探索。' },
            { title: '唯一的束缚', quote: '释放你的欲望，不要把它限制在有限之中。在欲望的无限里面，是你的终极本性。' },
            { title: '活着并全然地活', quote: '只有当"你是谁"不断地扩展，生命才允许你全然地活。全然地活或者活到极致，是你这个生命所能知晓的唯一成就。' },
            { title: '你不是你所想的', quote: '在绝对的自愿中度过你生命的每一刻，你会创造出天堂。你在不情愿中所做的一切必然是地狱。' },
            { title: '头脑·奇迹', quote: '大多数人都在试图控制自己的头脑。我想让你解放你的头脑，让它达到最高的可能性。' },
            { title: '创造的声音', quote: '文字和意义属于人类头脑的领域，声音则是创造必不可少的一部分。' },
            { title: '创造你想要的', quote: '你的健康和你的疾病，你的快乐和你的痛苦，都来自于内在。如果你想要幸福，是时候转向内在了。' },
          ].map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              style={{ padding: '32px 0', borderBottom: `1px solid ${C.border}` }}
            >
              <div style={{
                fontSize: 9, color: C.gold, letterSpacing: 4,
                textTransform: 'uppercase', marginBottom: 12, fontFamily: FONT_SANS,
              }}>
                {q.title}
              </div>
              <p style={{ fontSize: 15, color: C.textMid, fontWeight: 300, lineHeight: 2, margin: 0, fontStyle: 'italic' }}>
                "{q.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── 7. 定价 CTA ── */}
      <section id="pricing">
        <div style={{ ...MODULE_PAD, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            <Label>开始你的内在旅程</Label>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 300,
              color: C.text, letterSpacing: '0.04em', marginBottom: 56,
            }}>
              内在工程
            </h2>

            <div style={{
              border: `1px solid ${C.borderMid}`,
              padding: '56px 40px', marginBottom: 36,
              background: C.bgAlt,
            }}>
              <div style={{
                fontSize: 'clamp(48px, 8vw, 80px)',
                fontWeight: 200, color: C.gold,
                letterSpacing: '-0.02em', lineHeight: 1,
                marginBottom: 10, fontFamily: FONT_SANS,
              }}>
                $1,200
              </div>
              <div style={{
                fontSize: 10, color: C.textDim,
                letterSpacing: 3, marginBottom: 44,
                fontFamily: FONT_SANS,
              }}>
                USD · 一次付款 · 永久使用
              </div>

              <div style={{ height: 1, background: C.border, marginBottom: 32 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  '内在工程完整课程',
                  '古代智慧与现代科学的融合',
                  'AI 内在工程陪练（私密对话）',
                  '呼吸练习 · 冥想引导音频',
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 14, alignItems: 'center',
                    fontSize: 13, color: C.text, lineHeight: 1.6,
                    fontFamily: FONT_SANS,
                  }}>
                    <span style={{ color: C.goldSoft, flexShrink: 0 }}>—</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <motion.a
              href="#"
              whileHover={{ background: C.gold, color: C.bg, borderColor: C.gold }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'inline-block', padding: '16px 52px',
                border: `1px solid ${C.gold}`, color: C.gold,
                background: 'transparent', textDecoration: 'none',
                fontSize: 11, fontFamily: FONT_SANS, letterSpacing: 3,
              }}
            >
              现在就可以开始
            </motion.a>

            <p style={{ fontSize: 10, color: C.textDim, marginTop: 20, letterSpacing: 2, fontFamily: FONT_SANS }}>
              你可以在自己的空间里，按你自己的节奏开始
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <div style={{
        padding: '48px 24px', textAlign: 'center',
        borderTop: `1px solid ${C.border}`, marginTop: 80,
        fontSize: 9, letterSpacing: 4, color: C.textDim, fontFamily: FONT_SANS,
      }}>
        LOVE · EGO · AI · 2026
      </div>
    </div>
  )
}
