'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const RARITY_CONFIG = {
  common:    { label: '◆ Common',   color: '#95D5B2', glow: 'rgba(149,213,178,0.3)'  },
  rare:      { label: '✦ Rare',     color: '#B7A7D9', glow: 'rgba(183,167,217,0.35)' },
  epic:      { label: '★ Epic',     color: '#C8B6FF', glow: 'rgba(200,182,255,0.4)'  },
  legendary: { label: '🌟 Legendary', color: '#FFD166', glow: 'rgba(255,209,102,0.45)' },
}

interface CollectiblesClientProps {
  owned: any[]
  all: any[]
  ownedIds: string[]
}

function CollectibleCard({ collectible, isOwned, discoveredAt }: { collectible: any; isOwned: boolean; discoveredAt?: string }) {
  const [selected, setSelected] = useState(false)
  const rarity = RARITY_CONFIG[collectible.rarity as keyof typeof RARITY_CONFIG] ?? RARITY_CONFIG.common

  return (
    <>
      <motion.div
        whileHover={isOwned ? { scale: 1.06, y: -4 } : { scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => isOwned && setSelected(true)}
        className={`collectible-card ${!isOwned ? 'locked' : ''}`}
        style={isOwned ? { boxShadow: `0 4px 16px ${rarity.glow}` } : {}}
      >
        <span className="text-3xl block mb-2">{isOwned ? collectible.emoji : '❓'}</span>
        <div className="text-xs font-bold" style={{ color: '#374151' }}>
          {isOwned ? collectible.name : '???'}
        </div>
        <div className="text-xs mt-0.5 font-semibold" style={{ color: rarity.color }}>
          {rarity.label}
        </div>
        {isOwned && discoveredAt && (
          <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
            {new Date(discoveredAt).toLocaleDateString()}
          </div>
        )}
      </motion.div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(31,41,55,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSelected(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="velune-card p-8 text-center max-w-xs w-full"
              style={{ boxShadow: `0 0 40px ${rarity.glow}` }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl block mb-4"
              >
                {collectible.emoji}
              </motion.span>
              <div className="font-display text-xl font-semibold mb-1" style={{ color: '#374151' }}>
                {collectible.name}
              </div>
              <div className="text-sm font-bold mb-3" style={{ color: rarity.color }}>{rarity.label}</div>
              <p className="text-sm" style={{ color: '#6B7280' }}>{collectible.description}</p>
              {collectible.triggerFood && (
                <div className="mt-3 text-xs px-3 py-1.5 rounded-xl inline-block" style={{ background: 'rgba(184,242,208,0.2)', color: '#3B7A54', border: '1px solid rgba(143,191,159,0.3)' }}>
                  Triggered by: {collectible.triggerFood}
                </div>
              )}
              <button onClick={() => setSelected(false)} className="btn-secondary mt-5 px-6 py-2.5 text-sm w-full">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function CollectiblesClient({ owned, all, ownedIds }: CollectiblesClientProps) {
  const [filter, setFilter] = useState<'all' | 'owned' | 'locked'>('all')
  const ownedSet = new Set(ownedIds)

  const ownedMap = Object.fromEntries(owned.map((uc) => [uc.collectibleId, uc.discoveredAt]))

  const displayed = all.filter((c) => {
    if (filter === 'owned') return ownedSet.has(c.id)
    if (filter === 'locked') return !ownedSet.has(c.id)
    return true
  })

  return (
    <div>
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="velune-card p-5 mb-5 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(255,209,102,0.15), rgba(183,167,217,0.15))' }}
      >
        <span className="text-4xl">🎴</span>
        <div className="flex-1">
          <div className="font-bold text-lg" style={{ color: '#374151' }}>
            {ownedIds.length} / {all.length} Discovered
          </div>
          <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
            Eat rare foods, hit streaks, and level up to unlock spirits. Some are legendary — have you tried dragonfruit?
          </p>
        </div>
        <div
          className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold"
          style={{ background: 'rgba(255,209,102,0.2)', border: '1px solid rgba(255,209,102,0.4)', color: '#8B6A00' }}
        >
          🔥 {all.length - ownedIds.length} remaining
        </div>
      </motion.div>

      {/* Filter tabs */}
      <div className="tab-bar mb-5 max-w-xs">
        {(['all', 'owned', 'locked'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`tab-btn ${filter === f ? 'active' : ''}`}>
            {f === 'all' ? '🌟 All' : f === 'owned' ? '✨ Owned' : '🔒 Locked'}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3">
        {displayed.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
          >
            <CollectibleCard
              collectible={c}
              isOwned={ownedSet.has(c.id)}
              discoveredAt={ownedMap[c.id]}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
