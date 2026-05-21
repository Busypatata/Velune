'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { MealType, FoodUnit } from '@/types'

interface AddMealModalProps {
  onClose: () => void
  onMealAdded?: (meal: any) => void
  userId: string
  today: string
}

interface FoodResult {
  id: string
  name: string
  emoji: string | null
  calories: number
  protein: number
  carbs: number
  fat: number
  isRare: boolean
}

interface SelectedFood {
  food: FoodResult
  quantity: number
  unit: FoodUnit
}

const MEAL_TYPES: { type: MealType; emoji: string; label: string }[] = [
  { type: 'breakfast', emoji: '🌅', label: 'Breakfast' },
  { type: 'lunch',     emoji: '☀️', label: 'Lunch' },
  { type: 'dinner',    emoji: '🌙', label: 'Dinner' },
  { type: 'snack',     emoji: '🍎', label: 'Snack' },
]

const UNITS: FoodUnit[] = ['g', 'ml', 'piece', 'cup', 'tbsp', 'tsp', 'slice']

export function AddMealModal({ onClose, onMealAdded, userId, today }: AddMealModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<'type' | 'search' | 'plate'>('type')
  const [mealType, setMealType] = useState<MealType>('breakfast')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FoodResult[]>([])
  const [selected, setSelected] = useState<SelectedFood[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const searchFoods = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/nutrients/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.foods ?? [])
    } catch { setResults([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => searchFoods(query), 300)
    return () => clearTimeout(t)
  }, [query, searchFoods])

  function addFood(food: FoodResult) {
    setSelected((prev) => {
      const exists = prev.find((s) => s.food.id === food.id)
      if (exists) return prev
      return [...prev, { food, quantity: 100, unit: 'g' }]
    })
    setStep('plate')
  }

  function updateQuantity(foodId: string, quantity: number) {
    setSelected((prev) => prev.map((s) => s.food.id === foodId ? { ...s, quantity } : s))
  }

  function updateUnit(foodId: string, unit: FoodUnit) {
    setSelected((prev) => prev.map((s) => s.food.id === foodId ? { ...s, unit } : s))
  }

  function removeFood(foodId: string) {
    setSelected((prev) => prev.filter((s) => s.food.id !== foodId))
  }

  function getTotalCalories() {
    return selected.reduce((sum, s) => sum + (s.food.calories * s.quantity / 100), 0)
  }

  function getTotalProtein() {
    return selected.reduce((sum, s) => sum + (s.food.protein * s.quantity / 100), 0)
  }

  async function saveMeal() {
    if (selected.length === 0) return
    setSaving(true)
    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealType,
          date: today,
          foods: selected.map((s) => ({ foodId: s.food.id, quantity: s.quantity, unit: s.unit })),
        }),
      })
      const data = await res.json()
      if (data.meal && onMealAdded) onMealAdded(data.meal)
      router.refresh()
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: 'rgba(31,41,55,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="velune-card w-full sm:max-w-lg relative"
          style={{ borderRadius: '24px 24px 0 0', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(183,167,217,0.4)' }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(183,167,217,0.2)' }}>
            <div>
              <h2 className="font-display text-xl font-semibold" style={{ color: '#374151' }}>Add to Plate 🍽️</h2>
              <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Search ingredients, log your meal</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
              style={{ background: 'rgba(234,231,225,0.8)', color: '#6B7280' }}>✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Step: meal type */}
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: '#6B7280' }}>MEAL TYPE</p>
              <div className="grid grid-cols-4 gap-2">
                {MEAL_TYPES.map((m) => (
                  <button
                    key={m.type}
                    onClick={() => setMealType(m.type)}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-2xl text-center transition-all"
                    style={{
                      background: mealType === m.type ? 'linear-gradient(135deg, rgba(183,167,217,0.4), rgba(143,191,159,0.3))' : 'rgba(234,231,225,0.5)',
                      border: `1.5px solid ${mealType === m.type ? 'rgba(183,167,217,0.6)' : 'rgba(183,167,217,0.2)'}`,
                      boxShadow: mealType === m.type ? '0 4px 12px rgba(183,167,217,0.25)' : 'none',
                    }}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-xs font-bold" style={{ color: '#374151' }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: '#6B7280' }}>SEARCH FOOD</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try: spinach, chicken breast, dragonfruit..."
                  className="input-velune pl-10"
                  autoFocus
                />
              </div>
            </div>

            {/* Search results */}
            {query && (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {loading && (
                  <div className="text-center py-4 text-sm" style={{ color: '#6B7280' }}>
                    <span className="animate-sparkle inline-block">✨</span> Searching...
                  </div>
                )}
                {!loading && results.length === 0 && query && (
                  <p className="text-center py-4 text-sm" style={{ color: '#6B7280' }}>No results for &ldquo;{query}&rdquo;</p>
                )}
                {results.map((food) => (
                  <motion.button
                    key={food.id}
                    whileHover={{ x: 4 }}
                    onClick={() => addFood(food)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all"
                    style={{ border: '1px solid transparent' }}
                    onMouseEnter={(e) => (e.currentTarget.style.border = '1px solid rgba(183,167,217,0.3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.border = '1px solid transparent')}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{food.emoji ?? '🍽️'}</span>
                      <div>
                        <div className="text-sm font-bold" style={{ color: '#374151' }}>
                          {food.name}
                          {food.isRare && <span className="ml-2 text-xs" style={{ color: '#FFD166' }}>✨ Rare</span>}
                        </div>
                        <div className="text-xs" style={{ color: '#6B7280' }}>
                          {food.protein.toFixed(1)}g protein · {food.carbs.toFixed(1)}g carbs · {food.fat.toFixed(1)}g fat
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: '#F4978E' }}>
                      {food.calories.toFixed(0)} kcal
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Selected foods / plate */}
            {selected.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold" style={{ color: '#6B7280' }}>YOUR PLATE</p>
                  <span className="text-xs font-bold" style={{ color: '#F4978E' }}>
                    {getTotalCalories().toFixed(0)} kcal · {getTotalProtein().toFixed(1)}g protein
                  </span>
                </div>
                <div className="space-y-2">
                  {selected.map((s) => (
                    <div key={s.food.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                      style={{ background: 'rgba(234,231,225,0.4)', border: '1px solid rgba(183,167,217,0.2)' }}>
                      <span className="text-xl">{s.food.emoji ?? '🍽️'}</span>
                      <span className="flex-1 text-sm font-bold truncate" style={{ color: '#374151' }}>{s.food.name}</span>
                      <input
                        type="number"
                        value={s.quantity}
                        onChange={(e) => updateQuantity(s.food.id, Number(e.target.value))}
                        className="w-16 text-center rounded-xl px-2 py-1 text-sm font-bold"
                        style={{ background: 'rgba(252,251,248,0.8)', border: '1px solid rgba(183,167,217,0.3)', color: '#374151' }}
                        min={1}
                      />
                      <select
                        value={s.unit}
                        onChange={(e) => updateUnit(s.food.id, e.target.value as FoodUnit)}
                        className="text-xs rounded-xl px-2 py-1"
                        style={{ background: 'rgba(252,251,248,0.8)', border: '1px solid rgba(183,167,217,0.3)', color: '#374151' }}
                      >
                        {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                      </select>
                      <button onClick={() => removeFood(s.food.id)} className="text-sm" style={{ color: '#E07A7A' }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(183,167,217,0.2)' }}>
            <button
              onClick={saveMeal}
              disabled={selected.length === 0 || saving}
              className="btn-primary w-full py-3.5 text-sm disabled:opacity-50"
            >
              {saving ? '✨ Saving...' : `🍽️ Log ${selected.length} food${selected.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
