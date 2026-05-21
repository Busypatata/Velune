'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AddMealModal } from '@/components/modals/AddMealModal'
import { useRouter } from 'next/navigation'

const MEAL_TYPES = [
  { type: 'breakfast', emoji: '🌅', label: 'Breakfast' },
  { type: 'lunch',     emoji: '☀️', label: 'Lunch' },
  { type: 'dinner',    emoji: '🌙', label: 'Dinner' },
  { type: 'snack',     emoji: '🍎', label: 'Snack' },
]

interface FoodLogClientProps {
  meals: any[]
  dailyLog: any
  blueprint: any
  savedMeals: any[]
  userId: string
  today: string
}

export function FoodLogClient({ meals: initialMeals, dailyLog, blueprint, savedMeals, userId, today }: FoodLogClientProps) {
  const [showAddMeal, setShowAddMeal] = useState(false)
  const [meals, setMeals] = useState<any[]>(initialMeals)
  const [usingTemplate, setUsingTemplate] = useState<string | null>(null)
  const router = useRouter()

  const mealsByType = MEAL_TYPES.map((mt) => ({
    ...mt,
    meals: meals.filter((m) => m.mealType === mt.type),
  }))

  function getMealCalories(meal: any) {
    return meal.foods.reduce((sum: number, mf: any) => sum + (mf.food.calories * mf.quantity / 100), 0)
  }
  function getMealProtein(meal: any) {
    return meal.foods.reduce((sum: number, mf: any) => sum + (mf.food.protein * mf.quantity / 100), 0)
  }

  async function deleteMeal(mealId: string) {
    // Optimistically remove from local state
    setMeals((prev) => prev.filter((m) => m.id !== mealId))
    await fetch(`/api/meals/${mealId}`, { method: 'DELETE' })
    router.refresh()
  }

  async function useSavedMeal(template: any) {
    setUsingTemplate(template.id)
    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealType: template.mealType,
          date: today,
          name: template.name,
          emoji: template.emoji,
          foods: template.foods.map((mf: any) => ({
            foodId: mf.food.id,
            quantity: mf.quantity,
            unit: mf.unit,
          })),
        }),
      })
      const data = await res.json()
      if (data.meal) setMeals((prev) => [...prev, data.meal])
      router.refresh()
    } catch (e) {
      console.error(e)
    } finally {
      setUsingTemplate(null)
    }
  }

  // Compute totals live from the current meals array so the Daily Summary
  // always reflects the latest logged foods — even before router.refresh() completes.
  const liveTotals = useMemo(() => {
    const allFoods = meals.flatMap((m) => m.foods)
    return {
      calories: allFoods.reduce((s, mf) => s + (mf.food.calories * mf.quantity / 100), 0),
      protein:  allFoods.reduce((s, mf) => s + (mf.food.protein  * mf.quantity / 100), 0),
      carbs:    allFoods.reduce((s, mf) => s + (mf.food.carbs    * mf.quantity / 100), 0),
      fat:      allFoods.reduce((s, mf) => s + (mf.food.fat      * mf.quantity / 100), 0),
      water:    allFoods.reduce((s, mf) => s + ((mf.food.water ?? 0) * mf.quantity / 100), 0),
    }
  }, [meals])

  const macros = [
    { label: 'Calories', current: liveTotals.calories, target: blueprint?.calorieTarget ?? 2000, unit: 'kcal', color: '#FFD166' },
    { label: 'Protein',  current: liveTotals.protein,  target: blueprint?.proteinTarget  ?? 120,  unit: 'g',    color: '#F4978E' },
    { label: 'Carbs',    current: liveTotals.carbs,    target: blueprint?.carbTarget     ?? 200,  unit: 'g',    color: '#FFCB77' },
    { label: 'Fats',     current: liveTotals.fat,      target: blueprint?.fatTarget      ?? 65,   unit: 'g',    color: '#95D5B2' },
    { label: 'Hydration',current: liveTotals.water,    target: blueprint?.waterTarget    ?? 2000, unit: 'ml',   color: '#7BDFF2' },
  ]

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">
      {/* Left: meal sections */}
      <div className="space-y-4">
        {mealsByType.map((mt, idx) => (
          <motion.div
            key={mt.type}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="velune-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base flex items-center gap-2" style={{ color: '#374151' }}>
                <span>{mt.emoji}</span> {mt.label}
                {mt.meals.length > 0 && (
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{ background: 'rgba(183,167,217,0.2)', color: '#9D79D6' }}>
                    {mt.meals.reduce((s, m) => s + getMealCalories(m), 0).toFixed(0)} kcal
                  </span>
                )}
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddMeal(true)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl"
                style={{ background: 'linear-gradient(135deg, rgba(184,242,208,0.6), rgba(143,191,159,0.4))', color: '#374151', border: '1px solid rgba(143,191,159,0.3)' }}
              >
                + Add
              </motion.button>
            </div>

            {mt.meals.length > 0 ? (
              <div className="space-y-2">
                {mt.meals.map((meal: any) => (
                  <div key={meal.id}>
                    {meal.foods.map((mf: any) => (
                      <div key={mf.id} className="food-card group">
                        <span className="text-2xl">{mf.food.emoji ?? '🍽️'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold truncate" style={{ color: '#374151' }}>{mf.food.name}</div>
                          <div className="text-xs" style={{ color: '#6B7280' }}>
                            {mf.quantity}{mf.unit} · {mf.food.protein.toFixed(1)}g protein · {mf.food.carbs.toFixed(1)}g carbs · {mf.food.fat.toFixed(1)}g fat
                          </div>
                        </div>
                        <div className="text-sm font-bold flex-shrink-0" style={{ color: '#F4978E' }}>
                          {(mf.food.calories * mf.quantity / 100).toFixed(0)} kcal
                        </div>
                        <button
                          onClick={() => deleteMeal(meal.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ color: '#E07A7A', background: 'rgba(224,122,122,0.1)' }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-8 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, rgba(184,242,208,0.1), rgba(255,185,151,0.08))', border: '2px dashed rgba(143,191,159,0.3)' }}
              >
                <span className="text-3xl mb-2">🍽️</span>
                <p className="text-sm font-semibold" style={{ color: '#6B7280' }}>Nothing here yet</p>
                <p className="text-xs mt-1" style={{ color: '#B7A7D9' }}>Tap + Add to log {mt.label.toLowerCase()}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Right: daily summary */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="velune-card p-5"
        >
          <div className="section-label text-sm">Daily Summary 📊</div>
          <div className="text-center mb-5">
            <div className="text-4xl font-black" style={{ color: '#374151' }}>
              {(dailyLog?.calories ?? 0).toFixed(0)}
            </div>
            <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
              of {blueprint?.calorieTarget ?? 2000} kcal
            </div>
          </div>

          <div className="space-y-3">
            {macros.map((m) => {
              const pct = Math.min(100, Math.round((m.current / m.target) * 100))
              return (
                <div key={m.label}>
                  <div className="flex justify-between text-xs font-bold mb-1" style={{ color: '#374151' }}>
                    <span>{m.label}</span>
                    <span style={{ color: m.color }}>{m.current.toFixed(m.unit === 'kcal' ? 0 : 1)}{m.unit} / {m.target}{m.unit}</span>
                  </div>
                  <div className="xp-bar">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${m.color}, ${m.color}80)` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Saved meal templates */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="velune-card p-5"
        >
          <div className="section-label text-sm">Saved Meals 🗂️</div>
          {savedMeals.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: '#9CA3AF' }}>
              No saved meals yet. Log a meal and save it as a template!
            </p>
          ) : (
            savedMeals.map((template: any) => {
              const kcal = template.foods.reduce((s: number, mf: any) => s + (mf.food.calories * mf.quantity / 100), 0)
              const protein = template.foods.reduce((s: number, mf: any) => s + (mf.food.protein * mf.quantity / 100), 0)
              const isLoading = usingTemplate === template.id
              return (
                <div key={template.id} className="food-card mb-2">
                  <span className="text-2xl">{template.emoji ?? '🍽️'}</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold" style={{ color: '#374151' }}>{template.name ?? 'Saved Meal'}</div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>{kcal.toFixed(0)} kcal · {protein.toFixed(1)}g protein</div>
                  </div>
                  <button
                    onClick={() => useSavedMeal(template)}
                    disabled={isLoading}
                    className="text-xs font-bold px-2.5 py-1 rounded-xl disabled:opacity-50"
                    style={{ background: 'rgba(143,191,159,0.2)', color: '#8FBF9F', border: '1px solid rgba(143,191,159,0.3)' }}
                  >
                    {isLoading ? '...' : 'Use'}
                  </button>
                </div>
              )
            })
          )}
        </motion.div>
      </div>

      {showAddMeal && (
        <AddMealModal
          onClose={() => setShowAddMeal(false)}
          onMealAdded={(newMeal) => setMeals((prev) => [...prev, newMeal])}
          userId={userId}
          today={today}
        />
      )}
    </div>
  )
}
