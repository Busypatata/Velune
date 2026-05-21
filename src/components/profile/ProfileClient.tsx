'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XPBar } from '@/components/ui/XPBar'
import { MASCOT_EMOJIS, GARDEN_UNLOCK_CONDITIONS, getLevelFromXP } from '@/types'

interface ProfileClientProps {
  user: any
  wonBattles: number
}

export function ProfileClient({ user, wonBattles }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<'garden' | 'titles' | 'streaks' | 'stats'>('garden')
  const [editMode, setEditMode] = useState(false)
  const { level } = getLevelFromXP(user.xpLifestyle + user.xpSocial)

  const equippedTitle = user.titles?.find((t: any) => t.isEquipped)
  const totalBattles = (user._count?.battlesAsA ?? 0) + (user._count?.battlesAsB ?? 0)

  async function equipTitle(titleId: string) {
    await fetch('/api/users/title', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titleId }),
    })
    window.location.reload()
  }

  return (
    <div className="space-y-5">
      {/* Garden scenery */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl"
        style={{
          minHeight: 220,
          background: 'linear-gradient(160deg, rgba(184,242,208,0.3) 0%, rgba(183,167,217,0.2) 40%, rgba(123,223,242,0.15) 70%, rgba(255,185,151,0.2) 100%)',
          border: '1px solid rgba(183,167,217,0.3)',
        }}
      >
        {/* Garden elements */}
        {user.gardenElements?.map((el: any, i: number) => (
          <span
            key={el.id}
            className="absolute text-2xl garden-el select-none"
            style={{ left: `${el.posX}%`, top: `${el.posY}%`, animationDelay: `${i * 0.3}s` }}
          >
            {el.emoji}
          </span>
        ))}

        {/* Mascot in garden */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
          <span className="text-5xl block animate-bounce-soft">
            {MASCOT_EMOJIS[user.mascot?.mascotType ?? 'fox']}
          </span>
          <div
            className="mt-1 px-3 py-1 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(252,251,248,0.85)', border: '1px solid rgba(183,167,217,0.3)', color: '#374151' }}
          >
            {user.mascot?.name ?? 'Lumie'}
          </div>
        </div>

        {/* Garden unlock hint */}
        <div
          className="absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ background: 'rgba(252,251,248,0.85)', border: '1px solid rgba(183,167,217,0.25)', color: '#6B7280' }}
        >
          🌿 {user.gardenElements?.length ?? 0} elements unlocked
        </div>
      </motion.div>

      {/* Profile info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="velune-card p-5"
      >
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
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
            >Lv {level}</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-black text-xl" style={{ color: '#374151' }}>{user.name}</div>
            <div className="text-sm mb-1" style={{ color: '#6B7280' }}>@{user.username}</div>
            {equippedTitle && (
              <div
                className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'linear-gradient(90deg, rgba(183,167,217,0.35), rgba(143,191,159,0.25))', color: '#9D79D6', border: '1px solid rgba(183,167,217,0.4)' }}
              >
                {equippedTitle.title.emoji} {equippedTitle.title.name}
              </div>
            )}
            <div className="mt-3">
              <XPBar xpLifestyle={user.xpLifestyle} xpSocial={user.xpSocial} />
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="btn-secondary px-3 py-2 text-xs flex-shrink-0"
          >
            ✏️ Edit
          </button>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Best Streak', value: Math.max(...(user.streaks?.map((s: any) => s.longestDays) ?? [0])), emoji: '🔥' },
          { label: 'Battles',    value: totalBattles, emoji: '⚔️' },
          { label: 'Wins',       value: wonBattles,   emoji: '🏆' },
          { label: 'Collectibles', value: user.collectibles?.length ?? 0, emoji: '✨' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04 }}
            className="velune-card p-3 text-center"
          >
            <div className="text-lg">{s.emoji}</div>
            <div className="text-xl font-black mt-1" style={{ color: '#374151' }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {(['garden', 'titles', 'streaks', 'stats'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-btn ${activeTab === tab ? 'active' : ''}`}>
            {tab === 'garden' ? '🌻 Garden' : tab === 'titles' ? '👑 Titles' : tab === 'streaks' ? '🔥 Streaks' : '📊 Stats'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'garden' && (
            <div className="velune-card p-5">
              <div className="section-label">Garden Unlocks 🌿</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GARDEN_UNLOCK_CONDITIONS.map((gc) => {
                  const unlocked = user.gardenElements?.some((el: any) => el.type === gc.type)
                  return (
                    <div key={gc.type}
                      className="flex items-center gap-3 p-3 rounded-2xl"
                      style={{ background: unlocked ? 'rgba(184,242,208,0.2)' : 'rgba(234,231,225,0.4)', border: `1px solid ${unlocked ? 'rgba(143,191,159,0.35)' : 'rgba(183,167,217,0.15)'}`, opacity: unlocked ? 1 : 0.6 }}
                    >
                      <span className="text-2xl">{gc.emoji}</span>
                      <div>
                        <div className="text-sm font-bold" style={{ color: '#374151' }}>{gc.description}</div>
                        <div className="text-xs mt-0.5" style={{ color: unlocked ? '#8FBF9F' : '#6B7280' }}>
                          {unlocked ? '✓ Unlocked' : `🔒 ${gc.condition}`}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'titles' && (
            <div className="velune-card p-5">
              <div className="section-label">My Titles 👑</div>
              <div className="flex flex-wrap gap-2">
                {user.titles?.map((ut: any) => (
                  <motion.button
                    key={ut.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => equipTitle(ut.titleId)}
                    className={`title-chip ${ut.isEquipped ? 'equipped' : ''}`}
                    style={{
                      background: ut.isEquipped
                        ? 'linear-gradient(135deg, rgba(143,191,159,0.25), rgba(184,242,208,0.25))'
                        : 'rgba(234,231,225,0.5)',
                      color: ut.isEquipped ? '#2A6B45' : '#6B7280',
                      border: `1.5px solid ${ut.isEquipped ? 'rgba(143,191,159,0.5)' : 'rgba(183,167,217,0.2)'}`,
                    }}
                  >
                    {ut.title.emoji} {ut.title.name} {ut.isEquipped && '✓'}
                  </motion.button>
                ))}
                {/* Locked examples */}
                {[
                  { emoji: '💪', name: 'Protein Beast', hint: '75-day protein streak' },
                  { emoji: '🌙', name: 'Celestial Eater', hint: 'Level 81+' },
                ].map((t) => (
                  <div key={t.name} className="title-chip opacity-50" style={{ background: 'rgba(200,182,255,0.1)', color: '#9A8CC0', border: '1px dashed rgba(200,182,255,0.3)', cursor: 'default' }}>
                    🔒 {t.name} <span className="text-xs opacity-70">({t.hint})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'streaks' && (
            <div className="velune-card p-5">
              <div className="section-label">Streak History 🔥</div>
              <div className="space-y-3">
                {user.streaks?.map((s: any) => (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-2xl"
                    style={{ background: s.isActive ? 'rgba(184,242,208,0.15)' : 'rgba(234,231,225,0.4)', border: `1px solid ${s.isActive ? 'rgba(143,191,159,0.25)' : 'rgba(183,167,217,0.15)'}` }}>
                    <span className="text-xl">{s.type === 'hydration' ? '💧' : s.type === 'breakfast' ? '🌅' : s.type === 'vitamins' ? '🌈' : s.type === 'balanced' ? '⚖️' : '🔥'}</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold capitalize" style={{ color: '#374151' }}>{s.type} Streak</div>
                      <div className="text-xs" style={{ color: '#6B7280' }}>Longest: {s.longestDays} days</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black" style={{ color: s.isActive ? '#8FBF9F' : '#6B7280' }}>{s.currentDays}d</div>
                      <div className="text-xs" style={{ color: s.isActive ? '#95D5B2' : '#E07A7A' }}>{s.isActive ? '● Active' : '○ Inactive'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="velune-card p-5">
              <div className="section-label">Nutrition Stats 📊</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Lifestyle XP', value: user.xpLifestyle?.toLocaleString(), color: '#BDB2FF' },
                  { label: 'Social XP',    value: user.xpSocial?.toLocaleString(),    color: '#B7A7D9' },
                  { label: 'Recipes',      value: user._count?.recipes ?? 0,          color: '#FFB997' },
                  { label: 'Posts',        value: user._count?.posts ?? 0,            color: '#FFAAA5' },
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-2xl text-center" style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                    <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs mt-1" style={{ color: '#6B7280' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
