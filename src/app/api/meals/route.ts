import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateNutrition, calcVitaminsPct, calcMineralsPct } from '@/lib/nutrition'
import { processDailyCompletion, checkCollectibleDiscovery } from '@/lib/gamification'
import { cacheDel, CACHE_KEYS } from '@/lib/redis'
import { z } from 'zod'

const mealSchema = z.object({
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  date: z.string(),
  name: z.string().optional(),
  emoji: z.string().optional(),
  foods: z.array(z.object({
    foodId: z.string(),
    quantity: z.number().positive(),
    unit: z.string(),
  })),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = mealSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const { mealType, date, name, emoji, foods } = parsed.data
  const userId = session.user.id

  // Create meal
  const meal = await prisma.meal.create({
    data: {
      userId,
      mealType,
      date,
      name,
      emoji,
      foods: {
        create: foods.map((f) => ({ foodId: f.foodId, quantity: f.quantity, unit: f.unit })),
      },
    },
    include: { foods: { include: { food: true } } },
  })

  // Check for rare food collectibles
  for (const mf of meal.foods) {
    if (mf.food.isRare) {
      await checkCollectibleDiscovery(userId, mf.food.name)
    }
  }

  // Recalculate daily log
  await recalcDailyLog(userId, date)

  // Invalidate cache
  await cacheDel(CACHE_KEYS.dailyLog(userId, date))

  return NextResponse.json({ meal }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0]

  const meals = await prisma.meal.findMany({
    where: { userId: session.user.id, date },
    include: { foods: { include: { food: true } } },
    orderBy: { loggedAt: 'asc' },
  })

  return NextResponse.json({ meals })
}

async function recalcDailyLog(userId: string, date: string) {
  const allMeals = await prisma.meal.findMany({
    where: { userId, date },
    include: { foods: { include: { food: true } } },
  })

  const allFoods = allMeals.flatMap((m) => m.foods)
  const totals = calculateNutrition(allFoods as any)

  const blueprint = await prisma.nutritionBlueprint.findUnique({ where: { userId } })
  if (!blueprint) return

  const caloriesPct = Math.min(100, (totals.calories / blueprint.calorieTarget) * 100)
  const proteinPct  = Math.min(100, (totals.protein  / blueprint.proteinTarget)  * 100)
  const hydrationPct = Math.min(100, ((totals as any).water ?? 0) / blueprint.waterTarget * 100)
  const fiberPct    = Math.min(100, (totals.fiber    / blueprint.fiberTarget)    * 100)
  const vitaminsPct = calcVitaminsPct(totals as any, blueprint.microTargets as any)
  const mineralsPct = calcMineralsPct(totals as any, blueprint.microTargets as any)

  await prisma.dailyLog.upsert({
    where: { userId_date: { userId, date } },
    create: {
      userId, date,
      ...totals,
      water: (totals as any).water ?? 0,
      caloriesPct, proteinPct, hydrationPct, fiberPct, vitaminsPct, mineralsPct,
    },
    update: {
      ...totals,
      water: (totals as any).water ?? 0,
      caloriesPct, proteinPct, hydrationPct, fiberPct, vitaminsPct, mineralsPct,
    },
  })

  // Process daily XP
  await processDailyCompletion(userId, {
    caloriesPct, proteinPct, vitaminsPct, hydrationPct, mineralsPct, fiberPct, date,
  })
}
