import { prisma } from './prisma'
import { XP_REWARDS, XP_THRESHOLDS, getLevelFromXP } from '@/types'

// ─── Award XP ─────────────────────────────────────────────────────────────────

export async function awardXP(
  userId: string,
  type: 'lifestyle' | 'social',
  amount: number,
  reason: string
) {
  const field = type === 'lifestyle' ? 'xpLifestyle' : 'xpSocial'

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      [field]: { increment: amount },
      xpLogs: {
        create: { type, amount, reason },
      },
    },
  })

  const totalXP = user.xpLifestyle + user.xpSocial
  const { level } = getLevelFromXP(totalXP)

  if (level !== user.level) {
    await prisma.user.update({ where: { id: userId }, data: { level } })
    await createNotification(userId, 'level_up', 'personal', '⬆️ Level Up!', `You reached Level ${level}! New rewards unlocked.`, { level })
    await checkTitleUnlocks(userId, { level })
    await checkGardenUnlocks(userId, { level })
  }

  return { newXP: totalXP, level }
}

// ─── Streak Management ────────────────────────────────────────────────────────

export async function updateStreak(userId: string, type: string, date: string): Promise<number> {
  const streak = await prisma.streak.upsert({
    where: { userId_type: { userId, type } },
    create: { userId, type, currentDays: 1, longestDays: 1, lastLogDate: date },
    update: {},
  })

  const today = new Date(date)
  const lastLog = streak.lastLogDate ? new Date(streak.lastLogDate) : null
  const dayDiff = lastLog ? Math.floor((today.getTime() - lastLog.getTime()) / 86400000) : 1

  let newDays = streak.currentDays

  if (dayDiff === 0) return newDays // already logged today
  if (dayDiff === 1) {
    newDays = streak.currentDays + 1
  } else {
    newDays = 1 // broken streak
    await createNotification(userId, 'streak_warning', 'personal', '💔 Streak Reset', `Your ${type} streak was reset. Start a new one today!`)
  }

  const longestDays = Math.max(newDays, streak.longestDays)

  await prisma.streak.update({
    where: { id: streak.id },
    data: { currentDays: newDays, longestDays, lastLogDate: date },
  })

  // Streak milestones
  const milestones = [7, 14, 30, 50, 75, 100, 112]
  if (milestones.includes(newDays)) {
    const xpAmount = newDays >= 100 ? XP_REWARDS.STREAK_BONUS_100 : newDays >= 30 ? XP_REWARDS.STREAK_BONUS_30 : XP_REWARDS.STREAK_BONUS_7
    await awardXP(userId, 'lifestyle', xpAmount, `${newDays}-day ${type} streak milestone!`)
    await createNotification(userId, 'xp_gain', 'personal', `🔥 ${newDays}-Day Streak!`, `You hit a ${newDays}-day ${type} streak! +${xpAmount} XP`, { days: newDays, type })
    await checkTitleUnlocks(userId, { streakType: type, days: newDays })
  }

  return newDays
}

// ─── Title Unlocks ────────────────────────────────────────────────────────────

export async function checkTitleUnlocks(userId: string, context: Record<string, unknown>) {
  const allTitles = await prisma.title.findMany()
  const ownedIds = (await prisma.userTitle.findMany({ where: { userId }, select: { titleId: true } })).map((t) => t.titleId)

  for (const title of allTitles) {
    if (ownedIds.includes(title.id)) continue
    const cond = title.condition as any

    let unlocked = false
    if (cond.type === 'level' && context.level && (context.level as number) >= cond.value) unlocked = true
    if (cond.type === 'streak' && context.streakType === cond.streakType && (context.days as number) >= cond.days) unlocked = true
    if (cond.type === 'meals_logged' && context.mealsLogged && (context.mealsLogged as number) >= cond.value) unlocked = true

    if (unlocked) {
      await prisma.userTitle.create({ data: { userId, titleId: title.id } })
      await createNotification(userId, 'xp_gain', 'social', `${title.emoji} New Title Unlocked!`, `You earned "${title.name}" — ${title.description}`, { titleName: title.name })
    }
  }
}

// ─── Collectible Discovery ────────────────────────────────────────────────────

export async function checkCollectibleDiscovery(userId: string, foodName: string) {
  const collectible = await prisma.collectible.findFirst({
    where: {
      triggerType: 'food',
      triggerFood: { contains: foodName.toLowerCase(), mode: 'insensitive' },
    },
  })

  if (!collectible) return null

  const existing = await prisma.userCollectible.findUnique({
    where: { userId_collectibleId: { userId, collectibleId: collectible.id } },
  })

  if (existing) return null

  await prisma.userCollectible.create({ data: { userId, collectibleId: collectible.id } })
  await awardXP(userId, 'lifestyle', 50, `Discovered collectible: ${collectible.name}`)
  await createNotification(userId, 'collectible', 'personal', `${collectible.emoji} New Collectible!`, `You discovered the ${collectible.name}! (${collectible.rarity})`, { collectibleName: collectible.name })

  return collectible
}

// ─── Garden Unlocks ───────────────────────────────────────────────────────────

export async function checkGardenUnlocks(userId: string, context: Record<string, unknown>) {
  const streaks = await prisma.streak.findMany({ where: { userId } })
  const elements = await prisma.gardenElement.findMany({ where: { userId } })
  const elementTypes = new Set(elements.map((e) => e.type))

  const unlocks: Array<{ type: string; emoji: string; condition: string }> = [
    { type: 'rose', emoji: '🌹', condition: 'protein_15' },
    { type: 'river', emoji: '🌊', condition: 'hydration_30' },
    { type: 'butterfly', emoji: '🦋', condition: 'vitamins_30' },
    { type: 'tree', emoji: '🌳', condition: 'balanced_21' },
    { type: 'firefly', emoji: '✨', condition: 'level_20' },
  ]

  for (const unlock of unlocks) {
    if (elementTypes.has(unlock.type)) continue

    let shouldUnlock = false
    const [streakType, days] = unlock.condition.split('_')

    if (streakType === 'level') {
      shouldUnlock = (context.level as number) >= parseInt(days)
    } else {
      const streak = streaks.find((s) => s.type === streakType)
      shouldUnlock = (streak?.currentDays ?? 0) >= parseInt(days)
    }

    if (shouldUnlock) {
      await prisma.gardenElement.create({
        data: { userId, type: unlock.type, emoji: unlock.emoji, posX: Math.random() * 80 + 10, posY: Math.random() * 60 + 15 },
      })
      await createNotification(userId, 'garden_unlock', 'personal', `${unlock.emoji} Garden Bloom!`, `A new element appeared in your garden!`)
    }
  }
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function createNotification(
  userId: string,
  type: string,
  category: 'personal' | 'social',
  title: string,
  message: string,
  metadata?: Record<string, unknown>
) {
  return prisma.notification.create({
    data: { userId, type, category, title, message, metadata: metadata ?? {} },
  })
}

// ─── Daily XP Processing ──────────────────────────────────────────────────────

export async function processDailyCompletion(userId: string, log: {
  caloriesPct: number
  proteinPct: number
  vitaminsPct: number
  hydrationPct: number
  mineralsPct: number
  fiberPct: number
  date: string
}) {
  let totalXP = 0

  if (log.caloriesPct >= 80) totalXP += XP_REWARDS.COMPLETE_CALORIES
  if (log.proteinPct >= 80) {
    totalXP += XP_REWARDS.COMPLETE_PROTEIN
    await updateStreak(userId, 'protein', log.date)
  }
  if (log.vitaminsPct >= 70) {
    totalXP += XP_REWARDS.COMPLETE_VITAMINS
    await updateStreak(userId, 'vitamins', log.date)
  }
  if (log.hydrationPct >= 75) {
    totalXP += XP_REWARDS.COMPLETE_HYDRATION
    await updateStreak(userId, 'hydration', log.date)
  }
  if (log.mineralsPct >= 70) totalXP += XP_REWARDS.COMPLETE_MINERALS
  if (log.fiberPct >= 80) totalXP += XP_REWARDS.COMPLETE_FIBER

  const allComplete = [log.caloriesPct, log.proteinPct, log.vitaminsPct, log.hydrationPct, log.mineralsPct, log.fiberPct].every((p) => p >= 70)
  if (allComplete) {
    totalXP += XP_REWARDS.COMPLETE_ALL_NUTRIENTS
    await updateStreak(userId, 'balanced', log.date)
    await updateStreak(userId, 'logging', log.date)
  }

  if (totalXP > 0) await awardXP(userId, 'lifestyle', totalXP, 'Daily nutrition completion')

  return totalXP
}
