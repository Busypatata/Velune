import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { DashboardClient } from '@/components/home/DashboardClient'
import { buildNutrientRings, detectDeficiencies } from '@/lib/nutrition'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const today = format(new Date(), 'yyyy-MM-dd')

  const [user, dailyLog, recentMeals] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        blueprint: true,
        mascot: true,
        streaks: true,
        gardenElements: { where: { isVisible: true } },
        titles: { include: { title: true }, where: { isEquipped: true } },
        collectibles: { take: 5, orderBy: { discoveredAt: 'desc' }, include: { collectible: true } },
      },
    }),
    prisma.dailyLog.findUnique({ where: { userId_date: { userId: session.user.id, date: today } } }),
    prisma.meal.findMany({
      where: { userId: session.user.id, date: today },
      include: { foods: { include: { food: true } } },
      orderBy: { loggedAt: 'asc' },
    }),
  ])

  if (!user) redirect('/auth/login')

  // Redirect to onboarding if no blueprint
  if (!user.blueprint) redirect('/onboarding')

  const rings = buildNutrientRings(dailyLog ?? {}, user.blueprint!)
  const deficiencies = detectDeficiencies(dailyLog ?? {}, user.blueprint!)
  const activeStreak = user.streaks.reduce((max, s) => s.currentDays > max ? s.currentDays : max, 0)

  return (
    <DashboardClient
      user={JSON.parse(JSON.stringify(user))}
      rings={rings}
      deficiencies={deficiencies}
      recentMeals={JSON.parse(JSON.stringify(recentMeals))}
      dailyLog={dailyLog ? JSON.parse(JSON.stringify(dailyLog)) : null}
      today={today}
      longestActiveStreak={activeStreak}
    />
  )
}
