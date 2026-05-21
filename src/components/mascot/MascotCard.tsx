'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MASCOT_EMOJIS, MASCOT_MOODS, type MascotMood, type MascotType } from '@/types'

interface MascotCardProps {
  mascotType: MascotType
  mascotName: string
  mood: MascotMood
  onMoodChange?: (mood: MascotMood) => void
}

const MOOD_TRIGGERS: { mood: MascotMood; emoji: string; title: string; bg: string }[] = [
  { mood: 'happy',   emoji: '✨', title: 'Good streak',    bg: 'rgba(184,242,208,0.4)' },
  { mood: 'thirsty', emoji: '💧', title: 'Low hydration',  bg: 'rgba(123,223,242,0.25)' },
  { mood: 'sad',     emoji: '😔', title: 'Missed meal',    bg: 'rgba(255,185,151,0.25)' },
  { mood: 'excited', emoji: '🎉', title: 'Level up',       bg: 'rgba(183,167,217,0.3)' },
  { mood: 'tired',   emoji: '😪', title: 'Low nutrients',  bg: 'rgba(255,203,119,0.25)' },
]

export function MascotCard({ mascotType, mascotName, mood, onMoodChange }: MascotCardProps) {
  const [currentMood, setCurrentMood] = useState<MascotMood>(mood)
  const moodData = MASCOT_MOODS[currentMood]
  const mascotEmoji = currentMood === 'thirsty' ? '😴'
    : currentMood === 'sad' ? '😢'
    : currentMood === 'excited' ? '🎉'
    : currentMood === 'tired' ? '😪'
    : MASCOT_EMOJIS[mascotType]

  function changeMood(m: MascotMood) {
    setCurrentMood(m)
    onMoodChange?.(m)
  }

  return (
    <div
      className="velune-card p-5 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(183,167,217,0.15), rgba(184,242,208,0.15))' }}
    >
      {/* Sparkle bg */}
      <div className="absolute inset-0 pointer-events-none">
        {['10%,15%','80%,10%','20%,75%','85%,80%'].map((pos, i) => (
          <span
            key={i}
            className="absolute text-xs opacity-30 animate-sparkle"
            style={{ left: pos.split(',')[0], top: pos.split(',')[1], animationDelay: `${i * 0.5}s` }}
          >✨</span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.span
          key={currentMood}
          initial={{ scale: 0.5, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-6xl block mb-2 animate-bounce-soft"
        >
          {mascotEmoji}
        </motion.span>
      </AnimatePresence>

      <div className="text-sm font-bold mb-0.5" style={{ color: '#374151' }}>{mascotName}</div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`mood-${currentMood}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-xs mb-3"
          style={{ color: '#6B7280' }}
        >
          {moodData.message}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`speech-${currentMood}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="speech-bubble text-left text-xs mb-4"
        >
          {moodData.speech}
        </motion.div>
      </AnimatePresence>

      {/* Mood triggers */}
      <div className="flex gap-2 justify-center flex-wrap">
        {MOOD_TRIGGERS.map((t) => (
          <motion.button
            key={t.mood}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => changeMood(t.mood)}
            title={t.title}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all"
            style={{
              background: currentMood === t.mood ? t.bg : 'rgba(234,231,225,0.5)',
              border: `1px solid ${currentMood === t.mood ? 'rgba(183,167,217,0.5)' : 'rgba(183,167,217,0.2)'}`,
            }}
          >
            {t.emoji}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
