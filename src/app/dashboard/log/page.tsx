import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { FoodLogClient } from '@/components/food/FoodLogClient'

export default async function FoodLogPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const today = format(new Date(), 'yyyy-MM-dd')

  const [meals, dailyLog, blueprint, savedMeals] = await Promise.all([
    prisma.meal.findMany({
      where: { userId: session.user.id, date: today },
      include: { foods: { include: { food: true } } },
      orderBy: { loggedAt: 'asc' },
    }),
    prisma.dailyLog.findUnique({
      where: { userId_date: { userId: session.user.id, date: today } },
    }),
    prisma.nutritionBlueprint.findUnique({ where: { userId: session.user.id } }),
    prisma.meal.findMany({
      where: { userId: session.user.id, isTemplate: true },
      include: { foods: { include: { food: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return (
    <FoodLogClient
      meals={JSON.parse(JSON.stringify(meals))}
      dailyLog={dailyLog ? JSON.parse(JSON.stringify(dailyLog)) : null}
      blueprint={blueprint ? JSON.parse(JSON.stringify(blueprint)) : null}
      savedMeals={JSON.parse(JSON.stringify(savedMeals))}
      userId={session.user.id}
      today={today}
    />
  )
}
