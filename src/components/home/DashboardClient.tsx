'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { NutrientRingsGrid } from '@/components/ui/NutrientRing'
import { XPBar } from '@/components/ui/XPBar'
import { MascotCard } from '@/components/mascot/MascotCard'
import { NutrientDetailModal } from '@/components/modals/NutrientDetailModal'
import { AddMealModal } from '@/components/modals/AddMealModal'
import type { NutrientRing, Deficiency } from '@/types'
import { getLevelFromXP } from '@/types'
import Link from 'next/link'

interface DashboardClientProps {
  user: any
  rings: NutrientRing[]
  deficiencies: Deficiency[]
  recentMeals: any[]
  dailyLog: any
  today: string
  longestActiveStreak: number
}

const MEAL_TYPE_EMOJIS: Record<string, string> = {
  breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎'
}

export function DashboardClient({
  user, rings, deficiencies, recentMeals, dailyLog, today, longestActiveStreak
}: DashboardClientProps) {
  const [selectedRing, setSelectedRing] = useState<NutrientRing | null>(null)
  const [showAddMeal, setShowAddMeal] = useState(false)
  const [showRec, setShowRec] = useState(false)

  const { level, pct } = getLevelFromXP(user.xpLifestyle + user.xpSocial)
  const equippedTitle = user.titles?.[0]?.title

  // Alert: hydration low
  const hydrationRing = rings.find(r => r.key === 'hydration')
  const showHydrationAlert = (hydrationRing?.pct ?? 0) < 50

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">

      {/* ── Left column ── */}
      <div className="flex flex-col gap-4">

        {/* Alert banner */}
        {showHydrationAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert-velune"
          >
            <span className="text-xl">💧</span>
            <span>
              Your hydration is at {hydrationRing?.pct ?? 0}% —{' '}
              {user.mascot?.name ?? 'Lumie'} is getting thirsty! Drink{' '}
              {Math.round(((user.blueprint?.waterTarget ?? 2000) - (dailyLog?.water ?? 0)) / 250)} more glasses today.
            </span>
          </motion.div>
        )}

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="velune-card p-5 flex items-center gap-4 relative"
          style={{ background: 'linear-gradient(135deg, rgba(183,167,217,0.2), rgba(143,191,159,0.15), rgba(255,185,151,0.15))' }}
        >
          {/* Sparkle */}
          <span className="absolute right-5 top-4 text-xl animate-sparkle">✨</span>

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ background: 'linear-gradient(135deg, #B7A7D9, #B8F2D0)', border: '3px solid rgba(255,255,255,0.8)', boxShadow: '0 4px 15px rgba(167,139,250,0.3)' }}
            >
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
              ) : '🧚'}
            </div>
            <div
              className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-xs font-black text-white"
              style={{ background: 'linear-gradient(135deg, #FFD166, #FFB997)', border: '2px solid white', fontSize: 9 }}
            >
              Lv {level}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="font-black text-lg" style={{ color: '#374151' }}>
              @{user.username}
            </div>
            {equippedTitle && (
              <div
                className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mt-1"
                style={{ background: 'linear-gradient(90deg, rgba(183,167,217,0.35), rgba(143,191,159,0.25))', color: '#9D79D6', border: '1px solid rgba(183,167,217,0.4)' }}
              >
                {equippedTitle.emoji} {equippedTitle.name}
              </div>
            )}
            <div className="mt-2">
              <XPBar xpLifestyle={user.xpLifestyle} xpSocial={user.xpSocial} />
            </div>
          </div>

          {/* Streak */}
          <div className="text-center flex-shrink-0">
            <div className="text-xs font-bold mb-0.5" style={{ color: '#6B7280' }}>STREAK</div>
            <div className="text-3xl font-black" style={{ color: '#374151' }}>🔥 {longestActiveStreak}</div>
            <div className="text-xs" style={{ color: '#6B7280' }}>days</div>
          </div>
        </motion.div>

        {/* Nutrient rings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="velune-card p-5"
        >
          <div className="section-label">Today's Nutrient Bloom 🌸</div>
          <NutrientRingsGrid rings={rings} onRingClick={setSelectedRing} />
          <p className="text-xs text-center mt-3" style={{ color: '#6B7280' }}>
            Tap any ring for detailed breakdown
          </p>
        </motion.div>

        {/* Streaks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="velune-card p-5"
        >
          <div className="section-label">Active Streaks 🔥</div>
          <div className="flex flex-wrap gap-2">
            {user.streaks?.filter((s: any) => s.isActive).map((streak: any) => (
              <div key={streak.id} className="streak-chip">
                <span className="text-lg">{streak.type === 'hydration' ? '💧' : streak.type === 'breakfast' ? '🌅' : streak.type === 'balanced' ? '🌈' : '🔥'}</span>
                <div>
                  <div className="font-black text-sm" style={{ color: '#374151' }}>{streak.currentDays} days</div>
                  <div className="text-xs capitalize" style={{ color: '#6B7280' }}>{streak.type} streak</div>
                </div>
              </div>
            ))}
            {(!user.streaks || user.streaks.filter((s: any) => s.isActive).length === 0) && (
              <p className="text-sm" style={{ color: '#6B7280' }}>Start logging meals to build streaks! 🌱</p>
            )}
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          <motion.button
            whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(143,191,159,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddMeal(true)}
            className="btn-primary w-full py-4 text-base"
          >
            <span className="text-xl">+</span> Log a Meal
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowRec(!showRec)}
            className="w-full py-3 text-sm font-bold rounded-2xl transition-all"
            style={{
              background: 'transparent',
              border: '1.5px dashed rgba(143,191,159,0.6)',
              color: '#8FBF9F',
            }}
          >
            🌿 Complete My Nutrients — see what&apos;s missing
          </motion.button>
        </motion.div>

        {/* Recommendation panel */}
        {showRec && deficiencies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="velune-card p-5"
          >
            <div className="section-label text-sm">Complete Your Nutrients 🌿</div>
            <p className="text-xs mb-3" style={{ color: '#6B7280' }}>
              You&apos;re running low on {deficiencies.slice(0, 2).map(d => d.nutrient).join(' & ')} today:
            </p>
            <div className="flex flex-wrap gap-2">
              {deficiencies[0]?.suggestions.slice(0, 5).map((food) => (
                <span
                  key={food}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold"
                  style={{ background: 'rgba(143,191,159,0.15)', border: '1px solid rgba(143,191,159,0.3)', color: '#374151' }}
                >
                  {food}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {showRec && deficiencies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="velune-card p-4 text-center"
            style={{ background: 'rgba(184,242,208,0.2)' }}
          >
            <span className="text-2xl">🎉</span>
            <p className="text-sm font-bold mt-1" style={{ color: '#374151' }}>Amazing! All nutrients on track today!</p>
          </motion.div>
        )}
      </div>

      {/* ── Right column ── */}
      <div className="flex flex-col gap-4">

        {/* Mascot */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <MascotCard
            mascotType={user.mascot?.mascotType ?? 'fox'}
            mascotName={user.mascot?.name ?? 'Lumie'}
            mood={user.mascot?.mood ?? 'happy'}
          />
        </motion.div>

        {/* Today's meals */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="velune-card p-5"
        >
          <div className="section-label text-sm">Today&apos;s Meals</div>
          {recentMeals.length > 0 ? (
            <div className="space-y-2">
              {recentMeals.map((meal: any) => {
                const totalCal = meal.foods.reduce((sum: number, mf: any) => {
                  return sum + (mf.food.calories * mf.quantity / 100)
                }, 0)
                const totalProtein = meal.foods.reduce((sum: number, mf: any) => {
                  return sum + (mf.food.protein * mf.quantity / 100)
                }, 0)
                return (
                  <div key={meal.id} className="food-card">
                    <span className="text-2xl">{meal.emoji ?? MEAL_TYPE_EMOJIS[meal.mealType] ?? '🍽️'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate" style={{ color: '#374151' }}>
                        {meal.name ?? `${meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}`}
                      </div>
                      <div className="text-xs" style={{ color: '#6B7280' }}>
                        {totalProtein.toFixed(0)}g protein
                      </div>
                    </div>
                    <div className="text-sm font-bold flex-shrink-0" style={{ color: '#F4978E' }}>
                      {totalCal.toFixed(0)} kcal
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <span className="text-3xl">🍽️</span>
              <p className="text-xs mt-2" style={{ color: '#6B7280' }}>No meals logged yet today</p>
            </div>
          )}

          <Link
            href="/dashboard/log"
            className="block text-center text-xs font-bold mt-3 py-2 rounded-xl transition-all"
            style={{ color: '#9D79D6', background: 'rgba(183,167,217,0.1)' }}
          >
            View full journal →
          </Link>
        </motion.div>

        {/* Quick garden preview */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="velune-card p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(184,242,208,0.2), rgba(183,167,217,0.15))' }}
        >
          <div className="section-label text-sm">Your Garden 🌻</div>
          <div className="relative h-28 rounded-xl overflow-hidden mb-3"
            style={{ background: 'linear-gradient(160deg, rgba(184,242,208,0.25), rgba(123,223,242,0.1))' }}
          >
            {user.gardenElements?.slice(0, 6).map((el: any, i: number) => (
              <span
                key={el.id}
                className="absolute text-xl garden-el"
                style={{
                  left: `${el.posX}%`,
                  top: `${el.posY}%`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                {el.emoji}
              </span>
            ))}
            {/* Mascot in garden */}
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-2xl animate-bounce-soft">
              {user.mascot?.mascotType === 'bunny' ? '🐰' :
               user.mascot?.mascotType === 'dragon' ? '🐲' :
               user.mascot?.mascotType === 'cat' ? '🐱' : '🦊'}
            </span>
          </div>
          <Link
            href="/dashboard/profile"
            className="block text-center text-xs font-bold py-2 rounded-xl transition-all"
            style={{ color: '#8FBF9F', background: 'rgba(143,191,159,0.1)' }}
          >
            Open full garden →
          </Link>
        </motion.div>
      </div>

      {/* Modals */}
      {selectedRing && (
        <NutrientDetailModal
          ring={selectedRing}
          dailyLog={dailyLog}
          blueprint={user.blueprint}
          onClose={() => setSelectedRing(null)}
        />
      )}
      {showAddMeal && (
        <AddMealModal onClose={() => setShowAddMeal(false)} userId={user.id} today={today} />
      )}
    </div>
  )
}
