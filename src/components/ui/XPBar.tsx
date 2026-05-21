'use client'

import { motion } from 'framer-motion'
import { getLevelFromXP } from '@/types'

interface XPBarProps {
  xpLifestyle: number
  xpSocial: number
  showDetails?: boolean
}

export function XPBar({ xpLifestyle, xpSocial, showDetails = true }: XPBarProps) {
  const totalXP = xpLifestyle + xpSocial
  const { level, currentXP, nextXP, pct } = getLevelFromXP(totalXP)

  return (
    <div className="w-full">
      {showDetails && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-bold" style={{ color: '#6B7280' }}>
            XP: {currentXP.toLocaleString()} / {nextXP.toLocaleString()}
          </span>
          <span className="text-xs font-bold" style={{ color: '#9D79D6' }}>
            Lv {level + 1} soon ✨
          </span>
        </div>
      )}
      <div className="xp-bar">
        <motion.div
          className="xp-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  )
}
