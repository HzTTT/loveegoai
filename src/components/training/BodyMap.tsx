import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const ZONES = [
  { id: 'head',    label: '头部',   cx: 100, cy: 44,  r: 28 },
  { id: 'throat',  label: '喉咙',   cx: 100, cy: 85,  r: 16 },
  { id: 'chest',   label: '胸口',   cx: 100, cy: 130, r: 30 },
  { id: 'stomach', label: '腹部',   cx: 100, cy: 185, r: 26 },
  { id: 'belly',   label: '丹田',   cx: 100, cy: 232, r: 22 },
  { id: 'leftArm', label: '左肩',   cx: 54,  cy: 118, r: 18 },
  { id: 'rightArm',label: '右肩',   cx: 146, cy: 118, r: 18 },
]

interface BodyMapProps {
  selected: string[]
  onToggle: (id: string) => void
  label?: string
}

export function BodyMap({ selected, onToggle, label }: BodyMapProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {label && (
        <p style={{ fontSize: 13, color: 'rgba(168,162,158,0.8)', textAlign: 'center', lineHeight: 1.6 }}>{label}</p>
      )}

      <div style={{ position: 'relative', width: 200, height: 320 }}>
        <svg viewBox="0 0 200 320" width={200} height={320}>
          {/* 人体轮廓 */}
          <g opacity={0.2} stroke="#c4a882" fill="none" strokeWidth={1.5}>
            {/* 头 */}
            <ellipse cx={100} cy={44} rx={28} ry={32} />
            {/* 颈 */}
            <rect x={90} y={72} width={20} height={18} rx={4} />
            {/* 躯干 */}
            <rect x={60} y={90} width={80} height={150} rx={10} />
            {/* 左臂 */}
            <rect x={32} y={92} width={28} height={90} rx={10} />
            {/* 右臂 */}
            <rect x={140} y={92} width={28} height={90} rx={10} />
            {/* 左腿 */}
            <rect x={62} y={240} width={32} height={75} rx={10} />
            {/* 右腿 */}
            <rect x={106} y={240} width={32} height={75} rx={10} />
          </g>

          {/* 可点击热区 */}
          {ZONES.map(z => {
            const isSelected = selected.includes(z.id)
            return (
              <g key={z.id} onClick={() => onToggle(z.id)} style={{ cursor: 'pointer' }}>
                <motion.circle
                  cx={z.cx} cy={z.cy} r={z.r}
                  animate={{
                    fill: isSelected ? 'rgba(196,168,130,0.6)' : 'rgba(196,168,130,0.08)',
                    stroke: isSelected ? '#c4a882' : 'rgba(196,168,130,0.2)',
                    scale: isSelected ? 1.15 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  strokeWidth={isSelected ? 2 : 1.5}
                />
                {isSelected && (
                  <motion.circle
                    cx={z.cx} cy={z.cy} r={z.r + 6}
                    fill="none" stroke="rgba(196,168,130,0.2)" strokeWidth={1}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  />
                )}
              </g>
            )
          })}
        </svg>

        {/* 标签 */}
        {ZONES.map(z => {
          const isSelected = selected.includes(z.id)
          const labelX = z.cx > 100 ? z.cx + z.r + 4 : z.cx < 100 ? z.cx - z.r - 4 : z.cx
          const anchor = z.cx > 100 ? 'start' : z.cx < 100 ? 'end' : 'middle'
          return (
            <AnimatePresence key={z.id}>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, x: z.cx < 100 ? 4 : -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    left: z.cx > 100 ? z.cx + z.r + 4 : undefined,
                    right: z.cx < 100 ? 200 - (z.cx - z.r - 4) : undefined,
                    top: z.cy - 8,
                    fontSize: 10,
                    color: '#c4a882',
                    fontWeight: 500,
                    whiteSpace: 'nowrap' as const,
                    textAlign: z.cx < 100 ? 'right' : 'left',
                    ...(z.cx === 100 ? { left: z.cx - 16, top: z.cy + z.r + 4, width: 32 } : {}),
                  }}
                >
                  {z.label}
                </motion.div>
              )}
            </AnimatePresence>
          )
        })}
      </div>

      {selected.length > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 12, color: 'rgba(196,168,130,0.7)', textAlign: 'center' }}
        >
          已标记 {selected.length} 处
        </motion.p>
      )}
    </div>
  )
}
