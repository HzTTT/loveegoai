import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface ContractionExpansionProps {
  onSelect: (state: 'contraction' | 'expansion') => void
  selected?: 'contraction' | 'expansion' | null
  label?: string
}

const STATES = [
  {
    id: 'contraction' as const,
    label: '收缩',
    description: '紧、缩、防御、逃避',
    color: '#8B7355',
    bgFrom: 'rgba(139,115,85,0.15)',
    bgTo: 'rgba(139,115,85,0.05)',
    icon: '◉',
    scale: 0.7,
  },
  {
    id: 'expansion' as const,
    label: '扩张',
    description: '松、开、流动、连接',
    color: '#C4A882',
    bgFrom: 'rgba(196,168,130,0.2)',
    bgTo: 'rgba(196,168,130,0.08)',
    icon: '◎',
    scale: 1.3,
  },
]

export function ContractionExpansion({ onSelect, selected, label }: ContractionExpansionProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {label && (
        <p style={{ fontSize: 13, color: 'rgba(168,162,158,0.8)', textAlign: 'center', lineHeight: 1.6 }}>
          {label}
        </p>
      )}

      <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'center' }}>
        {STATES.map(s => {
          const isSelected = selected === s.id
          return (
            <motion.button
              key={s.id}
              onClick={() => onSelect(s.id)}
              whileTap={{ scale: 0.96 }}
              animate={{
                borderColor: isSelected ? s.color : 'rgba(196,168,130,0.15)',
                boxShadow: isSelected
                  ? `0 0 24px ${s.id === 'expansion' ? 'rgba(196,168,130,0.3)' : 'rgba(139,115,85,0.2)'}`
                  : '0 0 0 transparent',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                flex: 1,
                maxWidth: 160,
                padding: '24px 16px',
                borderRadius: 16,
                border: '1.5px solid',
                background: `linear-gradient(160deg, ${s.bgFrom}, ${s.bgTo})`,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* 动态圆形指示器 */}
              <div style={{ position: 'relative', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                  animate={{
                    scale: isSelected ? s.scale : 1,
                    opacity: isSelected ? 1 : 0.4,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: isSelected
                      ? `radial-gradient(circle at 35% 35%, ${s.color}, ${s.id === 'expansion' ? 'rgba(196,168,130,0.5)' : 'rgba(139,115,85,0.4)'})`
                      : 'rgba(196,168,130,0.1)',
                    boxShadow: isSelected
                      ? `0 0 16px ${s.id === 'expansion' ? 'rgba(196,168,130,0.4)' : 'rgba(139,115,85,0.2)'}`
                      : 'none',
                  }}
                />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: s.scale * 1.1, opacity: 0.2 }}
                    transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                    style={{
                      position: 'absolute',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      border: `1px solid ${s.color}`,
                    }}
                  />
                )}
              </div>

              <span style={{
                fontSize: 16,
                fontWeight: 600,
                color: isSelected ? s.color : 'rgba(168,162,158,0.5)',
                letterSpacing: 2,
                transition: 'color 0.3s',
              }}>
                {s.label}
              </span>

              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      fontSize: 11,
                      color: 'rgba(168,162,158,0.6)',
                      lineHeight: 1.5,
                      letterSpacing: 1,
                    }}
                  >
                    {s.description}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              fontSize: 12,
              color: selected === 'expansion' ? '#C4A882' : '#8B7355',
              textAlign: 'center',
              letterSpacing: 1,
            }}
          >
            当前感受到的是「{selected === 'contraction' ? '收缩' : '扩张'}」状态
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
