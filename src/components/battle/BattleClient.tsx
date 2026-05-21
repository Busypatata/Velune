'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { differenceInDays, format } from 'date-fns'

const BATTLE_TYPES = [
  { type: 'protein',     emoji: '💪', label: 'Protein Duel',       desc: '1v1 · Track daily protein' },
  { type: 'hydration',   emoji: '💧', label: 'Hydration Sprint',   desc: '7 days · Most water wins' },
  { type: 'balanced',    emoji: '🌈', label: 'Balanced Diet Month', desc: '30 days · All nutrients' },
  { type: 'consistency', emoji: '🔥', label: 'Streak Battle',      desc: 'Who logs more days' },
  { type: 'calories',    emoji: '⚡', label: 'Calorie Challenge',   desc: 'Hit your target daily' },
]

interface BattleClientProps {
  activeBattles: any[]
  leaderboard: any[]
  totalBattles: number
  wonBattles: number
  globalRank: number
  currentUserId: string
}

function BattleCard({ battle, currentUserId }: { battle: any; currentUserId: string }) {
  const isUserA = battle.userAId === currentUserId
  const me = isUserA ? battle.userA : battle.userB
  const opponent = isUserA ? battle.userB : battle.userA
  const myScore = isUserA ? battle.scoreA : battle.scoreB
  const oppScore = isUserA ? battle.scoreB : battle.scoreA
  const total = myScore + oppScore || 1
  const myPct = Math.round((myScore / total) * 100)
  const daysLeft = differenceInDays(new Date(battle.endDate), new Date())

  const TYPE_COLORS: Record<string, string> = {
    protein: '#F4978E', hydration: '#7BDFF2', balanced: '#B7A7D9', consistency: '#FFD166', calories: '#FFCB77'
  }
  const color = TYPE_COLORS[battle.battleType] ?? '#B7A7D9'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="velune-card p-5"
      style={{ background: `linear-gradient(135deg, ${color}15, rgba(183,167,217,0.1))` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-bold text-sm" style={{ color: '#374151' }}>
            {battle.battleType === 'protein' ? '💪' : battle.battleType === 'hydration' ? '💧' : battle.battleType === 'balanced' ? '🌈' : '⚔️'} {battle.battleType.charAt(0).toUpperCase() + battle.battleType.slice(1)} Battle
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
            {daysLeft > 0 ? `Ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}` : 'Ended'} · {battle.status}
          </div>
        </div>
        <div
          className="text-xs font-bold px-2.5 py-1 rounded-xl"
          style={{ background: battle.status === 'active' ? 'rgba(183,167,217,0.3)' : 'rgba(234,231,225,0.8)', color: battle.status === 'active' ? '#9D79D6' : '#6B7280' }}
        >
          {battle.status.toUpperCase()}
        </div>
      </div>

      {/* VS section */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">🧚</div>
          <div className="text-xs font-bold" style={{ color: '#374151' }}>@{me.username}</div>
          <div className="text-xl font-black mt-1" style={{ color }}>{myScore.toFixed(1)}</div>
        </div>
        <div
          className="px-3 py-1.5 rounded-xl text-sm font-black text-white"
          style={{ background: `linear-gradient(135deg, ${color}, rgba(183,167,217,0.8))` }}
        >VS</div>
        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-xs font-bold" style={{ color: '#374151' }}>@{opponent.username}</div>
          <div className="text-xl font-black mt-1" style={{ color: '#FFB997' }}>{oppScore.toFixed(1)}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="battle-bar">
        <div style={{ display: 'flex', height: '100%' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${myPct}%` }}
            transition={{ duration: 0.8 }}
            style={{ background: `linear-gradient(90deg, ${color}, ${color}80)`, borderRadius: '9999px 0 0 9999px', minWidth: myPct > 0 ? 4 : 0 }}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${100 - myPct}%` }}
            transition={{ duration: 0.8 }}
            style={{ background: 'linear-gradient(90deg, rgba(255,185,151,0.8), rgba(244,151,142,0.6))', borderRadius: '0 9999px 9999px 0', minWidth: (100 - myPct) > 0 ? 4 : 0 }}
          />
        </div>
      </div>
      <div className="flex justify-between mt-1 text-xs font-bold" style={{ color: '#6B7280' }}>
        <span>You: {myPct}%</span>
        <span>Opponent: {100 - myPct}%</span>
      </div>
    </motion.div>
  )
}

export function BattleClient({ activeBattles, leaderboard, totalBattles, wonBattles, globalRank, currentUserId }: BattleClientProps) {
  const [showChallenge, setShowChallenge] = useState(false)
  const router = useRouter()
  const winRate = totalBattles > 0 ? Math.round((wonBattles / totalBattles) * 100) : 0

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-5">
      <div className="space-y-4">
        {/* Active battles */}
        <div>
          <div className="section-label">Active Battles ⚔️</div>
          {activeBattles.length === 0 ? (
            <div className="velune-card p-10 text-center">
              <span className="text-4xl">⚔️</span>
              <p className="mt-3 font-semibold" style={{ color: '#374151' }}>No active battles</p>
              <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Challenge someone to prove your consistency!</p>
              <button onClick={() => setShowChallenge(true)} className="btn-primary px-6 py-2.5 text-sm mt-4">
                Find a Battle
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeBattles.map((b) => <BattleCard key={b.id} battle={b} currentUserId={currentUserId} />)}
            </div>
          )}
        </div>

        {/* Global leaderboard */}
        <div>
          <div className="section-label">Global Leaderboard 🌍</div>
          <div className="velune-card p-4">
            {leaderboard.map((user: any, i: number) => {
              const isMe = user.id === currentUserId
              const rankEmoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`
              const totalXP = user.xpLifestyle + user.xpSocial
              return (
                <div key={user.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1.5 transition-all"
                  style={{
                    background: isMe ? 'rgba(183,167,217,0.12)' : i < 3 ? `rgba(255,209,102,${0.05 + (2 - i) * 0.03})` : 'transparent',
                    border: `1px solid ${isMe ? 'rgba(183,167,217,0.35)' : 'rgba(183,167,217,0.1)'}`,
                  }}
                >
                  <span className="text-base w-7 text-center">{rankEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate" style={{ color: isMe ? '#9D79D6' : '#374151' }}>
                      @{user.username}{isMe ? ' (you)' : ''}
                    </div>
                    {user.activeTitle && <div className="text-xs truncate" style={{ color: '#6B7280' }}>{user.activeTitle}</div>}
                  </div>
                  <div className="text-sm font-black flex-shrink-0" style={{ color: '#9D79D6' }}>
                    {totalXP.toLocaleString()} XP
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right: stats + find battle */}
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="velune-card p-5">
          <div className="section-label text-sm">Your Battle Stats 📊</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Battles', value: totalBattles, bg: 'rgba(183,167,217,0.15)' },
              { label: 'Wins',    value: wonBattles,   bg: 'rgba(184,242,208,0.2)'  },
              { label: 'Win Rate', value: `${winRate}%`, bg: 'rgba(255,203,119,0.15)' },
              { label: 'Rank',    value: `#${globalRank}`, bg: 'rgba(255,185,151,0.15)' },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded-2xl" style={{ background: s.bg }}>
                <div className="text-2xl font-black" style={{ color: '#374151' }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="velune-card p-5">
          <div className="section-label text-sm">Start a Battle 🥊</div>
          <div className="space-y-2">
            {BATTLE_TYPES.map((bt) => (
              <button
                key={bt.type}
                onClick={() => setShowChallenge(true)}
                className="w-full text-left px-3 py-2.5 rounded-xl transition-all text-sm font-bold"
                style={{
                  background: 'rgba(234,231,225,0.5)',
                  border: '1px solid rgba(183,167,217,0.2)',
                  color: '#374151',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(183,167,217,0.15)'; e.currentTarget.style.borderColor = 'rgba(183,167,217,0.4)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(234,231,225,0.5)'; e.currentTarget.style.borderColor = 'rgba(183,167,217,0.2)' }}
              >
                {bt.emoji} {bt.label}
                <div className="text-xs font-normal mt-0.5" style={{ color: '#6B7280' }}>{bt.desc}</div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {showChallenge && (
        <ChallengModal onClose={() => setShowChallenge(false)} onChallenge={() => { setShowChallenge(false); router.refresh() }} />
      )}
    </div>
  )
}

function ChallengModal({ onClose, onChallenge }: { onClose: () => void; onChallenge: () => void }) {
  const [username, setUsername] = useState('')
  const [battleType, setBattleType] = useState('protein')
  const [sending, setSending] = useState(false)

  async function send() {
    if (!username.trim()) return
    setSending(true)
    // find user by username then create battle
    const res = await fetch('/api/battles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opponentUsername: username, battleType }),
    })
    setSending(false)
    if (res.ok) onChallenge()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(31,41,55,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="velune-card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold" style={{ color: '#374151' }}>Send Challenge ⚔️</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(234,231,225,0.8)', color: '#6B7280' }}>✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: '#6B7280' }}>Opponent username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@vitaking" className="input-velune" />
          </div>
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: '#6B7280' }}>Battle type</label>
            <div className="grid grid-cols-2 gap-2">
              {BATTLE_TYPES.map((bt) => (
                <button key={bt.type} onClick={() => setBattleType(bt.type)}
                  className="p-2.5 rounded-xl text-left text-xs font-bold transition-all"
                  style={{ background: battleType === bt.type ? 'rgba(183,167,217,0.3)' : 'rgba(234,231,225,0.5)', border: `1px solid ${battleType === bt.type ? 'rgba(183,167,217,0.5)' : 'rgba(183,167,217,0.2)'}`, color: '#374151' }}>
                  {bt.emoji} {bt.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={send} disabled={!username.trim() || sending} className="btn-primary w-full py-3.5 text-sm disabled:opacity-50">
            {sending ? '✨ Sending...' : '⚔️ Send Challenge'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
