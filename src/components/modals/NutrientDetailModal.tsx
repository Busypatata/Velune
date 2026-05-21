'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { NutrientRing } from '@/types'

interface NutrientDetailModalProps {
  ring: NutrientRing
  dailyLog: any
  blueprint: any
  onClose: () => void
}

const NUTRIENT_DETAIL_DATA: Record<string, {
  rows: (log: any, blueprint: any) => { label: string; current: string; target: string; status: 'complete' | 'warning' | 'low' }[]
}> = {
  calories: {
    rows: (log, bp) => [
      { label: 'Breakfast', current: '-', target: '-', status: 'warning' },
      { label: 'Lunch', current: '-', target: '-', status: 'warning' },
      { label: 'Dinner', current: '-', target: '-', status: 'low' },
      { label: 'Daily Total', current: `${(log?.calories ?? 0).toFixed(0)} kcal`, target: `${bp?.calorieTarget ?? 2000} kcal`, status: (log?.caloriesPct ?? 0) >= 80 ? 'complete' : 'warning' },
    ],
  },
  protein: {
    rows: (log, bp) => [
      { label: 'Animal protein', current: '-', target: '-', status: 'complete' },
      { label: 'Plant protein', current: '-', target: '-', status: 'complete' },
      { label: 'Total', current: `${(log?.protein ?? 0).toFixed(1)}g`, target: `${bp?.proteinTarget ?? 120}g`, status: (log?.proteinPct ?? 0) >= 80 ? 'complete' : 'warning' },
    ],
  },
  vitamins: {
    rows: (log, bp) => {
      const mt = bp?.microTargets ?? {}
      return [
        { label: 'Vitamin A', current: `${(log?.vitaminA ?? 0).toFixed(0)}mcg`, target: `${mt.vitaminA ?? 900}mcg`, status: (log?.vitaminA ?? 0) >= (mt.vitaminA ?? 900) ? 'complete' : (log?.vitaminA ?? 0) >= (mt.vitaminA ?? 900) * 0.5 ? 'warning' : 'low' },
        { label: 'Vitamin C', current: `${(log?.vitaminC ?? 0).toFixed(0)}mg`, target: `${mt.vitaminC ?? 75}mg`, status: (log?.vitaminC ?? 0) >= (mt.vitaminC ?? 75) ? 'complete' : (log?.vitaminC ?? 0) >= 30 ? 'warning' : 'low' },
        { label: 'Vitamin D', current: `${(log?.vitaminD ?? 0).toFixed(1)}mcg`, target: `${mt.vitaminD ?? 15}mcg`, status: (log?.vitaminD ?? 0) >= (mt.vitaminD ?? 15) ? 'complete' : 'low' },
        { label: 'Vitamin B12', current: `${(log?.vitaminB12 ?? 0).toFixed(1)}mcg`, target: `${mt.vitaminB12 ?? 2.4}mcg`, status: (log?.vitaminB12 ?? 0) >= (mt.vitaminB12 ?? 2.4) ? 'complete' : 'warning' },
      ]
    },
  },
  hydration: {
    rows: (log, bp) => [
      { label: 'Water intake', current: `${(log?.water ?? 0)}ml`, target: `${bp?.waterTarget ?? 2000}ml`, status: (log?.water ?? 0) >= (bp?.waterTarget ?? 2000) * 0.75 ? 'complete' : 'low' },
      { label: 'From food', current: '~200ml', target: '~500ml', status: 'warning' },
      { label: 'Net hydration', current: `${(log?.water ?? 0)}ml`, target: `${bp?.waterTarget ?? 2000}ml`, status: (log?.hydrationPct ?? 0) >= 75 ? 'complete' : 'low' },
    ],
  },
  minerals: {
    rows: (log, bp) => {
      const mt = bp?.microTargets ?? {}
      return [
        { label: 'Iron', current: `${(log?.iron ?? 0).toFixed(1)}mg`, target: `${mt.iron ?? 18}mg`, status: (log?.iron ?? 0) >= (mt.iron ?? 18) ? 'complete' : (log?.iron ?? 0) >= 8 ? 'warning' : 'low' },
        { label: 'Calcium', current: `${(log?.calcium ?? 0).toFixed(0)}mg`, target: `${mt.calcium ?? 1000}mg`, status: (log?.calcium ?? 0) >= (mt.calcium ?? 1000) ? 'complete' : 'warning' },
        { label: 'Magnesium', current: `${(log?.magnesium ?? 0).toFixed(0)}mg`, target: `${mt.magnesium ?? 320}mg`, status: (log?.magnesium ?? 0) >= (mt.magnesium ?? 320) ? 'complete' : 'warning' },
        { label: 'Potassium', current: `${(log?.potassium ?? 0).toFixed(0)}mg`, target: `${mt.potassium ?? 3500}mg`, status: (log?.potassium ?? 0) >= (mt.potassium ?? 3500) ? 'complete' : 'warning' },
      ]
    },
  },
  fiber: {
    rows: (log, bp) => [
      { label: 'Soluble fiber', current: '-', target: '~10g', status: 'warning' },
      { label: 'Insoluble fiber', current: '-', target: '~15g', status: 'warning' },
      { label: 'Total fiber', current: `${(log?.fiber ?? 0).toFixed(1)}g`, target: `${bp?.fiberTarget ?? 25}g`, status: (log?.fiberPct ?? 0) >= 80 ? 'complete' : (log?.fiberPct ?? 0) >= 40 ? 'warning' : 'low' },
    ],
  },
}

const STATUS_STYLES = {
  complete: { color: '#95D5B2', label: '✓ Complete' },
  warning:  { color: '#FFCB77', label: '⚠️ Partial' },
  low:      { color: '#E07A7A', label: '↓ Low' },
}

export function NutrientDetailModal({ ring, dailyLog, blueprint, onClose }: NutrientDetailModalProps) {
  const detail = NUTRIENT_DETAIL_DATA[ring.key]
  const rows = detail?.rows(dailyLog, blueprint) ?? []

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(31,41,55,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="velune-card p-6 w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all"
            style={{ background: 'rgba(234,231,225,0.8)', color: '#6B7280' }}
          >✕</button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `${ring.color}20`, border: `1.5px solid ${ring.color}40` }}>
              {ring.key === 'calories' ? '🔥' : ring.key === 'protein' ? '💪' : ring.key === 'vitamins' ? '🌈' : ring.key === 'hydration' ? '💧' : ring.key === 'minerals' ? '🌿' : '🌾'}
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold" style={{ color: '#374151' }}>
                {ring.label}
              </h2>
              <p className="text-xs" style={{ color: '#6B7280' }}>
                {ring.current.toFixed(ring.unit === 'kcal' ? 0 : 1)}{ring.unit} of {ring.target}{ring.unit} — {ring.pct}%
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="xp-bar mb-5">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${ring.color}, ${ring.color}80)` }}
              initial={{ width: 0 }}
              animate={{ width: `${ring.pct}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>

          {/* Table */}
          <div className="space-y-1">
            {rows.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                style={{ background: i % 2 === 0 ? 'rgba(234,231,225,0.3)' : 'transparent' }}
              >
                <span className="text-sm font-semibold" style={{ color: '#374151' }}>{row.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold" style={{ color: '#6B7280' }}>{row.current}</span>
                  <span className="text-xs" style={{ color: '#9B9B9B' }}>/ {row.target}</span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-lg"
                    style={{ color: STATUS_STYLES[row.status].color, background: `${STATUS_STYLES[row.status].color}15` }}
                  >
                    {STATUS_STYLES[row.status].label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {ring.pct < 60 && (
            <div
              className="mt-4 p-3 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(255,229,229,0.5)', border: '1px solid rgba(224,122,122,0.25)', color: '#9B5050' }}
            >
              💡 Tip: Log more meals or tap &ldquo;Complete My Nutrients&rdquo; for personalized suggestions!
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
