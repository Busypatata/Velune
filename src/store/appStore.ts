import { create } from 'zustand'
import type { MascotMood, NutrientRing } from '@/types'

interface AppState {
  // Mascot
  mascotMood: MascotMood
  setMascotMood: (mood: MascotMood) => void

  // Nutrient rings
  rings: NutrientRing[]
  setRings: (rings: NutrientRing[]) => void

  // Modals
  addMealOpen: boolean
  setAddMealOpen: (open: boolean) => void

  // Notifications
  unreadCount: number
  setUnreadCount: (count: number) => void
  incrementUnread: () => void

  // XP animation
  xpGain: { amount: number; reason: string } | null
  setXPGain: (gain: { amount: number; reason: string } | null) => void

  // Level up
  levelUpTo: number | null
  setLevelUpTo: (level: number | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  mascotMood: 'happy',
  setMascotMood: (mood) => set({ mascotMood: mood }),

  rings: [],
  setRings: (rings) => set({ rings }),

  addMealOpen: false,
  setAddMealOpen: (open) => set({ addMealOpen: open }),

  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),

  xpGain: null,
  setXPGain: (gain) => set({ xpGain: gain }),

  levelUpTo: null,
  setLevelUpTo: (level) => set({ levelUpTo: level }),
}))
