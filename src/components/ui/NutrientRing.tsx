'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import type { NutrientRing } from '@/types'

interface NutrientRingProps {
  ring: NutrientRing
  onClick?: () => void
}

const CIRCUMFERENCE = 2 * Math.PI * 28  // r=28

export function NutrientRingItem({ ring, onClick }: NutrientRingProps) {
  const [hovered, setHovered] = useState(false)
  const offset = CIRCUMFERENCE - (ring.pct / 100) * CIRCUMFERENCE

  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-1.5 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="ring-tooltip absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
        >
          <div style={{ color: ring.color }} className="font-bold">{ring.label}</div>
          <div style={{ color: '#6B7280' }}>
            {ring.current.toFixed(ring.unit === 'kcal' ? 0 : 1)}{ring.unit} / {ring.target}{ring.unit}
          </div>
        </motion.div>
      )}

      <div className="relative" style={{ width: 68, height: 68 }}>
        <svg viewBox="0 0 68 68" className="w-full h-full -rotate-90">
          {/* Background ring */}
          <circle
            cx="34" cy="34" r="28"
            fill="none"
            stroke={ring.color}
            strokeWidth="7"
            opacity="0.15"
          />
          {/* Filled ring */}
          <motion.circle
            cx="34" cy="34" r="28"
            fill="none"
            stroke={ring.color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            style={{
              filter: `drop-shadow(0 0 6px ${ring.color}80)`,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-black" style={{ color: ring.color }}>
            {ring.pct}%
          </span>
        </div>
      </div>

      <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>{ring.label}</span>
    </motion.div>
  )
}

interface NutrientRingsGridProps {
  rings: NutrientRing[]
  onRingClick?: (ring: NutrientRing) => void
}

export function NutrientRingsGrid({ rings, onRingClick }: NutrientRingsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {rings.map((ring) => (
        <div key={ring.key} className="relative flex justify-center">
          <NutrientRingItem ring={ring} onClick={() => onRingClick?.(ring)} />
        </div>
      ))}
    </div>
  )
}
