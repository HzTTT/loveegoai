import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BreathBall } from '../../components/training/BreathBall'
import { BodyMap } from '../../components/training/BodyMap'

// ─── 色系 ────────────────────────────────────────
const C = {
  bg: '#0F0E0D',
  gold: '#c4a882',
  goldDim: 'rgba(196,168,130,0.5)',
  white: '#FAFAF9',
  mid: '#A8A29E',
  dim: '#57534E',
  dialogBg: 'rgba(15,14,13,0.92)',
  warmBg: '#1a1410',
  coolBg: '#0e1118',
}

// ─── 故事节点类型 ─────────────────────────────────
type SceneNode =
  | { type: 'narration'; text: string; speed?: 'slow' | 'normal' }
  | { type: 'dialog'; character: string; text: string }
  | { type: 'chat'; from: 'you' | 'him'; text: string; status?: 'sent' | 'read' }
  | { type: 'wait'; label: string; duration: number }
  | { type: 'pause'; instruction: string }
  | { type: 'bodymap' }
  | { type: 'breath'; rounds?: number }
  | { type: 'choice'; options: { text: string; branch: 'old_A' | 'old_B' | 'new' }[] }
  | { type: 'branch_old_A' }
  | { type: 'branch_old_B' }
  | { type: 'branch_new' }
  | { type: 'ending'; variant: 'old' | 'new' }

// ─── 故事线：完整第一章 ───────────────────────────
const STORY_MAIN: SceneNode[] = [
  // 铺垫：让用户认识这个人
  { type: 'narration', text: '三月的下午。\n\n阳光很好。', speed: 'slow' },
  { type: 'narration', text: '你和林晨在一起三个月了。' },
  { type: 'narration', text: '他不太会说甜话，\n但会在你加班的时候带咖啡来找你。' },
  { type: 'narration', text: '有时候你们就静静坐着，\n什么都不说，也很好。' },

  // 一段正常的日常对话
  { type: 'dialog', character: '林晨', text: '今天还要加班吗？' },
  { type: 'dialog', character: '你', text: '应该8点能走。' },
  { type: 'dialog', character: '林晨', text: '等你。' },

  // 时间过渡：最近有点不一样了
  { type: 'narration', text: '...' },
  { type: 'narration', text: '最近这两周，他明显忙了很多。' },
  { type: 'narration', text: '消息回得慢了。\n\n你告诉自己，没什么大不了。' },
  { type: 'narration', text: '今天是周三，中午十二点。' },

  // 触发现场：聊天界面
  { type: 'chat', from: 'you', text: '你今晚吃什么' },
  { type: 'wait', label: '已读', duration: 2200 },
  { type: 'narration', text: '两个小时过去了。' },
  { type: 'narration', text: '还是没有回。' },

  // 停顿介入
  { type: 'pause', instruction: '停。\n\n你现在，身体有什么感觉？' },
  { type: 'bodymap' },

  // 选择分支
  {
    type: 'choice',
    options: [
      { text: '再发一条："你在忙吗？"', branch: 'old_A' },
      { text: '什么都不发，但开始想很多', branch: 'old_B' },
      { text: '先回到自己身上', branch: 'new' },
    ],
  },
]

const STORY_OLD_A: SceneNode[] = [
  { type: 'branch_old_A' },
  { type: 'chat', from: 'you', text: '你在忙吗？' },
  { type: 'wait', label: '已读', duration: 1800 },
  { type: 'narration', text: '又是已读。\n\n没有回复。' },
  { type: 'narration', text: '你开始觉得自己问错了。\n\n或者说错了什么。' },
  { type: 'narration', text: '头脑开始转：\n\n"他是不是对我冷了"\n"我是不是哪里让他不高兴了"' },
  { type: 'narration', text: '一整个下午，\n你都没办法专心工作。' },
  { type: 'ending', variant: 'old' },
]

const STORY_OLD_B: SceneNode[] = [
  { type: 'branch_old_B' },
  { type: 'narration', text: '你把手机翻过去，\n假装什么都没发生。' },
  { type: 'narration', text: '但脑子里还是在转。\n\n一圈一圈。' },
  { type: 'narration', text: '"不理了"\n"随便"\n"反正也无所谓"' },
  { type: 'narration', text: '你觉得自己应该不在乎，\n但身体还是很紧。' },
  { type: 'ending', variant: 'old' },
]

const STORY_NEW: SceneNode[] = [
  { type: 'branch_new' },
  { type: 'narration', text: '好。\n\n先不动。' },
  { type: 'breath', rounds: 2 },
  { type: 'narration', text: '你注意到：\n\n胸口有一点点沉。\n那是身体在说话，不是故事。' },
  { type: 'narration', text: '"他没回消息"——这是事实。\n\n头脑后面那些，\n是故事。' },
  { type: 'narration', text: '你没有再发消息。\n\n也没有假装不在乎。\n\n你只是……在。' },
  { type: 'ending', variant: 'new' },
]

// ─── 打字机 Hook ──────────────────────────────────
function useTypewriter(text: string, speed = 40) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const chars = text.split('')
    function tick() {
      if (i < chars.length) {
        setDisplayed(prev => prev + chars[i])
        i++
        ref.current = setTimeout(tick, chars[i - 1] === '\n' ? speed * 4 : speed)
      } else {
        setDone(true)
      }
    }
    ref.current = setTimeout(tick, 120)
    return () => { if (ref.current) clearTimeout(ref.current) }
  }, [text, speed])

  return { displayed, done }
}

// ─── 场景：叙述文字 ───────────────────────────────
function NarrationScene({ text, onNext }: { text: string; onNext: () => void }) {
  const { displayed, done } = useTypewriter(text, 38)
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px' }}
      onClick={done ? onNext : undefined}
    >
      <p style={{
        color: C.mid, fontSize: 18, lineHeight: 2.0, textAlign: 'center',
        whiteSpace: 'pre-line', letterSpacing: 0.5,
      }}>
        {displayed}
        {!done && <span style={{ opacity: 0.4 }}>|</span>}
      </p>
      {done && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ fontSize: 11, color: C.dim, marginTop: 40, letterSpacing: 2 }}
        >
          轻触继续
        </motion.p>
      )}
    </motion.div>
  )
}

// ─── 场景：对话框 ──────────────────────────────────
function DialogScene({ character, text, onNext }: { character: string; text: string; onNext: () => void }) {
  const { displayed, done } = useTypewriter(text, 36)
  const isYou = character === '你'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 0 24px' }}
      onClick={done ? onNext : undefined}
    >
      {/* 角色名 */}
      <div style={{ padding: '0 20px 8px', color: isYou ? C.mid : C.gold, fontSize: 13, letterSpacing: 1 }}>
        {character}
      </div>
      {/* 对话框 */}
      <div style={{
        margin: '0 20px',
        padding: '16px 20px',
        background: C.dialogBg,
        borderTop: `1px solid ${isYou ? 'rgba(168,162,158,0.15)' : 'rgba(196,168,130,0.2)'}`,
        borderRadius: 4,
        backdropFilter: 'blur(8px)',
      }}>
        <p style={{ color: C.white, fontSize: 17, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
          {displayed}
          {!done && <span style={{ opacity: 0.4 }}>|</span>}
        </p>
      </div>
      {done && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ fontSize: 11, color: C.dim, textAlign: 'right', padding: '8px 28px 0', letterSpacing: 2 }}
        >
          轻触继续
        </motion.p>
      )}
    </motion.div>
  )
}

// ─── 场景：聊天气泡 ───────────────────────────────
function ChatScene({ from, text, status, onNext }: { from: 'you' | 'him'; text: string; status?: string; onNext: () => void }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 400) }, [])
  const isYou = from === 'you'

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px' }}
      onClick={visible ? onNext : undefined}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: isYou ? 'flex-end' : 'flex-start', marginBottom: 8 }}
          >
            <div style={{
              maxWidth: '72%',
              padding: '10px 14px',
              borderRadius: isYou ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: isYou ? C.gold : 'rgba(255,255,255,0.08)',
              color: isYou ? '#1a1208' : C.white,
              fontSize: 16,
            }}>
              {text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {status && visible && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ textAlign: 'right', fontSize: 12, color: C.dim, marginRight: 4 }}
        >
          {status}
        </motion.p>
      )}
    </motion.div>
  )
}

// ─── 场景：等待时间流逝 ───────────────────────────
function WaitScene({ label, duration, onNext }: { label: string; duration: number; onNext: () => void }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const p = Math.min(elapsed / duration, 1)
      setProgress(p)
      if (p < 1) requestAnimationFrame(tick)
      else { setDone(true) }
    }
    requestAnimationFrame(tick)
  }, [duration])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}
      onClick={done ? onNext : undefined}
    >
      <p style={{ color: C.dim, fontSize: 13, letterSpacing: 2 }}>{label}</p>
      <div style={{ width: 120, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 1, overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', background: C.goldDim, borderRadius: 1 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>
      {done && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ fontSize: 11, color: C.dim, letterSpacing: 2 }}
        >
          轻触继续
        </motion.p>
      )}
    </motion.div>
  )
}

// ─── 场景：停顿介入 ───────────────────────────────
function PauseScene({ instruction, onNext }: { instruction: string; onNext: () => void }) {
  const { displayed, done } = useTypewriter(instruction, 50)
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px', gap: 32 }}
    >
      <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, transparent, ${C.goldDim})` }} />
      <p style={{ color: C.gold, fontSize: 20, textAlign: 'center', lineHeight: 2, whiteSpace: 'pre-line', fontWeight: 300 }}>
        {displayed}
        {!done && <span style={{ opacity: 0.4 }}>|</span>}
      </p>
      {done && (
        <motion.button
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          onClick={onNext}
          style={{
            background: 'none', border: `1px solid ${C.goldDim}`,
            color: C.gold, padding: '10px 28px', borderRadius: 24,
            fontSize: 13, cursor: 'pointer', letterSpacing: 1,
          }}
        >
          我感受到了
        </motion.button>
      )}
    </motion.div>
  )
}

// ─── 场景：身体地图 ───────────────────────────────
function BodyMapScene({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = useCallback((id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', gap: 16, overflowY: 'auto' }}
    >
      <p style={{ color: C.mid, fontSize: 14, textAlign: 'center', lineHeight: 1.8 }}>
        点击你感受到紧张或不适的部位
      </p>
      <BodyMap selected={selected} onToggle={toggle} />
      {selected.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          onClick={onNext}
          style={{
            background: 'none', border: `1px solid ${C.goldDim}`,
            color: C.gold, padding: '10px 28px', borderRadius: 24,
            fontSize: 13, cursor: 'pointer', letterSpacing: 1, marginTop: 8,
          }}
        >
          记住了，继续
        </motion.button>
      )}
    </motion.div>
  )
}

// ─── 场景：呼吸球 ──────────────────────────────────
type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'idle'
function BreathScene({ rounds = 2, onNext }: { rounds?: number; onNext: () => void }) {
  const [phase, setPhase] = useState<BreathPhase>('idle')
  const [label, setLabel] = useState('准备好了，轻触开始')
  const [completed, setCompleted] = useState(0)
  const [done, setDone] = useState(false)

  function startBreath() {
    if (done) return
    let round = 0
    function runCycle() {
      setPhase('inhale'); setLabel('吸气…')
      setTimeout(() => {
        setPhase('hold'); setLabel('保持…')
        setTimeout(() => {
          setPhase('exhale'); setLabel('呼气…')
          setTimeout(() => {
            round++
            setCompleted(round)
            if (round < rounds) runCycle()
            else { setPhase('idle'); setLabel('很好。'); setDone(true) }
          }, 6000)
        }, 2000)
      }, 4000)
    }
    runCycle()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}
    >
      <div onClick={phase === 'idle' && !done ? startBreath : undefined} style={{ cursor: phase === 'idle' && !done ? 'pointer' : 'default' }}>
        <BreathBall phase={phase} label={label} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {Array.from({ length: rounds }).map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: 3,
            background: i < completed ? C.gold : 'rgba(255,255,255,0.15)',
          }} />
        ))}
      </div>
      {done && (
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          onClick={onNext}
          style={{
            background: 'none', border: `1px solid ${C.goldDim}`,
            color: C.gold, padding: '10px 28px', borderRadius: 24,
            fontSize: 13, cursor: 'pointer', letterSpacing: 1,
          }}
        >
          继续
        </motion.button>
      )}
    </motion.div>
  )
}

// ─── 场景：选择分支 ───────────────────────────────
function ChoiceScene({ options, onChoose }: { options: { text: string; branch: string }[]; onChoose: (branch: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 24px', gap: 12 }}
    >
      <p style={{ color: C.dim, fontSize: 12, letterSpacing: 2, marginBottom: 8 }}>你会怎么做</p>
      {options.map((opt, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}
          onClick={() => onChoose(opt.branch)}
          style={{
            width: '100%', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
            padding: '14px 18px', color: C.white, fontSize: 15,
            cursor: 'pointer', textAlign: 'left', lineHeight: 1.6,
            transition: 'all 0.2s',
          }}
          whileHover={{ background: 'rgba(196,168,130,0.08)', borderColor: C.goldDim }}
          whileTap={{ scale: 0.98 }}
        >
          {opt.text}
        </motion.button>
      ))}
    </motion.div>
  )
}

// ─── 场景：分支标签 ───────────────────────────────
function BranchLabelScene({ label, color, onNext }: { label: string; color: string; onNext: () => void }) {
  useEffect(() => { const t = setTimeout(onNext, 1800); return () => clearTimeout(t) }, [onNext])
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <p style={{ color, fontSize: 13, letterSpacing: 3 }}>{label}</p>
    </motion.div>
  )
}

// ─── 场景：结局 ───────────────────────────────────
function EndingScene({ variant, onRestart }: { variant: 'old' | 'new'; onRestart: () => void }) {
  const isNew = variant === 'new'
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', gap: 28 }}
    >
      <div style={{ width: 48, height: 1, background: isNew ? C.gold : C.dim }} />
      <p style={{ color: isNew ? C.gold : C.mid, fontSize: 16, textAlign: 'center', lineHeight: 2, whiteSpace: 'pre-line' }}>
        {isNew
          ? '这一次，你没有被旧程序带走。\n\n你只是感受了它，然后继续在。'
          : '旧程序就是这样运作的——\n\n不是你的错，\n只是你现在看见了。'}
      </p>
      <p style={{ color: C.dim, fontSize: 13, textAlign: 'center', lineHeight: 1.8 }}>
        {isNew
          ? '下一个场景里，链条会更深一点。\n同一个人，不同的触发。'
          : '下一关里，\n你可以再来一次。'}
      </p>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onRestart}
        style={{
          background: isNew ? C.gold : 'transparent',
          border: `1px solid ${isNew ? C.gold : C.dim}`,
          color: isNew ? '#1a1208' : C.mid,
          padding: '12px 32px', borderRadius: 24,
          fontSize: 14, cursor: 'pointer', letterSpacing: 1, marginTop: 8,
        }}
      >
        {isNew ? '进入下一场景' : '重新选择'}
      </motion.button>
    </motion.div>
  )
}

// ─── 场景背景色 ───────────────────────────────────
function SceneBg({ nodeIndex, total }: { nodeIndex: number; total: number }) {
  // 前段暖色（铺垫），后段冷色（等待/触发）
  const warmPoint = Math.floor(total * 0.45)
  const isWarm = nodeIndex < warmPoint
  return (
    <motion.div
      animate={{ background: isWarm ? C.warmBg : C.coolBg }}
      transition={{ duration: 2, ease: 'easeInOut' }}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    />
  )
}

// ─── 主引擎 ──────────────────────────────────────
export default function TrainingStory() {
  const [nodes, setNodes] = useState<SceneNode[]>(STORY_MAIN)
  const [idx, setIdx] = useState(0)

  const next = useCallback(() => {
    setIdx(i => Math.min(i + 1, nodes.length - 1))
  }, [nodes.length])

  const handleChoice = useCallback((branch: string) => {
    const suffix =
      branch === 'old_A' ? STORY_OLD_A :
      branch === 'old_B' ? STORY_OLD_B :
      STORY_NEW
    // 把选择后的故事接到当前位置
    setNodes(prev => [...prev.slice(0, idx + 1), ...suffix])
    setIdx(i => i + 1)
  }, [idx])

  const restart = useCallback(() => {
    setNodes(STORY_MAIN)
    setIdx(0)
  }, [])

  const node = nodes[idx]

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: C.bg,
      display: 'flex', flexDirection: 'column',
      maxWidth: 430, margin: '0 auto',
      overflow: 'hidden',
    }}>
      {/* 背景色渐变 */}
      <SceneBg nodeIndex={idx} total={STORY_MAIN.length} />

      {/* 顶部：故事标题 */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '20px 24px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <p style={{ color: C.dim, fontSize: 11, letterSpacing: 2 }}>第一章 · 旧程序</p>
        <p style={{ color: C.dim, fontSize: 11 }}>{idx + 1} / {nodes.length}</p>
      </div>

      {/* 内容区 */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <SceneRenderer key={idx} node={node} onNext={next} onChoose={handleChoice} onRestart={restart} />
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── 场景路由 ─────────────────────────────────────
function SceneRenderer({
  node, onNext, onChoose, onRestart,
}: {
  node: SceneNode
  onNext: () => void
  onChoose: (branch: string) => void
  onRestart: () => void
}) {
  if (!node) return null

  switch (node.type) {
    case 'narration':
      return <NarrationScene text={node.text} onNext={onNext} />
    case 'dialog':
      return <DialogScene character={node.character} text={node.text} onNext={onNext} />
    case 'chat':
      return <ChatScene from={node.from} text={node.text} status={node.status} onNext={onNext} />
    case 'wait':
      return <WaitScene label={node.label} duration={node.duration} onNext={onNext} />
    case 'pause':
      return <PauseScene instruction={node.instruction} onNext={onNext} />
    case 'bodymap':
      return <BodyMapScene onNext={onNext} />
    case 'breath':
      return <BreathScene rounds={node.rounds} onNext={onNext} />
    case 'choice':
      return <ChoiceScene options={node.options} onChoose={onChoose} />
    case 'branch_old_A':
      return <BranchLabelScene label="讨好" color="rgba(168,162,158,0.6)" onNext={onNext} />
    case 'branch_old_B':
      return <BranchLabelScene label="切断" color="rgba(168,162,158,0.6)" onNext={onNext} />
    case 'branch_new':
      return <BranchLabelScene label="停顿" color={C.gold} onNext={onNext} />
    case 'ending':
      return <EndingScene variant={node.variant} onRestart={onRestart} />
    default:
      return null
  }
}
