'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

const NOTIF_CONFIG: Record<string, { emoji: string; bg: string; border: string }> = {
  deficiency:     { emoji: '⚠️', bg: 'rgba(255,229,229,0.5)',  border: 'rgba(224,122,122,0.3)'  },
  streak_warning: { emoji: '🔥', bg: 'rgba(255,229,229,0.4)',  border: 'rgba(224,122,122,0.25)' },
  xp_gain:        { emoji: '⬆️', bg: 'rgba(184,242,208,0.25)', border: 'rgba(143,191,159,0.3)'  },
  garden_unlock:  { emoji: '🌱', bg: 'rgba(183,167,217,0.15)', border: 'rgba(183,167,217,0.25)' },
  friend_request: { emoji: '👥', bg: 'rgba(160,196,255,0.15)', border: 'rgba(160,196,255,0.3)'  },
  battle_invite:  { emoji: '⚔️', bg: 'rgba(183,167,217,0.15)', border: 'rgba(183,167,217,0.25)' },
  like:           { emoji: '❤️', bg: 'rgba(255,170,165,0.15)', border: 'rgba(255,170,165,0.3)'  },
  comment:        { emoji: '💬', bg: 'rgba(184,242,208,0.15)', border: 'rgba(184,242,208,0.3)'  },
  level_up:       { emoji: '🎉', bg: 'rgba(255,209,102,0.2)',  border: 'rgba(255,209,102,0.35)' },
  collectible:    { emoji: '✨', bg: 'rgba(255,209,102,0.15)', border: 'rgba(255,209,102,0.3)'  },
}

interface NotificationsClientProps {
  notifications: any[]
}

export function NotificationsClient({ notifications }: NotificationsClientProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'social'>('personal')
  const router = useRouter()

  const filtered = notifications.filter((n) => n.category === activeTab)

  async function handleAction(notifId: string, action: string, metadata: any) {
    if (action === 'accept' && metadata?.requestId) {
      await fetch('/api/social/friend-request', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: metadata.requestId, action: 'accept' }),
      })
      router.refresh()
    }
    if (action === 'ghost' && metadata?.requestId) {
      await fetch('/api/social/friend-request', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: metadata.requestId, action: 'ghost' }),
      })
      router.refresh()
    }
    if (action === 'accept_battle' && metadata?.battleId) {
      await fetch(`/api/battles/${metadata.battleId}/accept`, { method: 'PATCH' })
      router.refresh()
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="tab-bar mb-5 max-w-xs">
        <button onClick={() => setActiveTab('personal')} className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}>
          🧘 Personal
        </button>
        <button onClick={() => setActiveTab('social')} className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}>
          🌸 Social
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="velune-card p-12 text-center">
          <span className="text-4xl">🔔</span>
          <p className="mt-3 font-semibold" style={{ color: '#374151' }}>All caught up!</p>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>No new {activeTab} notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif, i) => {
            const config = NOTIF_CONFIG[notif.type] ?? NOTIF_CONFIG.xp_gain
            const hasActions = notif.type === 'friend_request' || notif.type === 'battle_invite'

            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{
                  background: config.bg,
                  border: `1px solid ${config.border}`,
                  animation: !notif.isRead && (notif.type === 'deficiency' || notif.type === 'streak_warning')
                    ? 'pulseBorder 3s ease-in-out infinite'
                    : 'none',
                }}
              >
                <span className="text-2xl flex-shrink-0">{config.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold" style={{ color: '#374151' }}>{notif.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{notif.message}</div>
                  <div className="text-xs mt-1" style={{ color: '#9B9B9B' }}>
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </div>
                </div>
                {hasActions && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAction(notif.id, notif.type === 'friend_request' ? 'accept' : 'accept_battle', notif.metadata)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl text-white"
                      style={{ background: 'linear-gradient(135deg, #8FBF9F, #B8F2D0)' }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(notif.id, 'ghost', notif.metadata)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl"
                      style={{ background: 'rgba(234,231,225,0.8)', color: '#6B7280', border: '1px solid rgba(183,167,217,0.2)' }}
                    >
                      Ghost
                    </button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
