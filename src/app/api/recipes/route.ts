import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { awardXP } from '@/lib/gamification'
import { XP_REWARDS } from '@/types'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, description, emoji, prepTime, cookTime, servings, isVegan, isVegetarian, isHighProtein, isLowCalorie, isIronRich, isVitaminRich, isQuick, isBudget, ingredients, steps } = body

  if (!title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400 })

  const recipe = await prisma.recipe.create({
    data: {
      userId: session.user.id,
      title, description, emoji: emoji ?? '🍽️',
      prepTime, cookTime, servings: servings ?? 1,
      isVegan: isVegan ?? false,
      isVegetarian: isVegetarian ?? false,
      isHighProtein: isHighProtein ?? false,
      isLowCalorie: isLowCalorie ?? false,
      isIronRich: isIronRich ?? false,
      isVitaminRich: isVitaminRich ?? false,
      isQuick: isQuick ?? false,
      isBudget: isBudget ?? false,
      ingredients: { create: (ingredients ?? []).map((ing: any, i: number) => ({ foodName: ing.name, quantity: ing.quantity, unit: ing.unit ?? 'g', order: i })) },
      steps: { create: (steps ?? []).map((s: any, i: number) => ({ stepNumber: i + 1, content: s.content, duration: s.duration })) },
    },
    include: { user: { select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true } } },
  })

  await awardXP(session.user.id, 'social', XP_REWARDS.UPLOAD_RECIPE, 'Uploaded a recipe')

  return NextResponse.json({ recipe }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const filter = searchParams.get('filter')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 24

  const where: any = { isPublic: true }
  if (filter === 'vegan') where.isVegan = true
  if (filter === 'highProtein') where.isHighProtein = true
  if (filter === 'quick') where.isQuick = true
  if (filter === 'budget') where.isBudget = true
  if (filter === 'ironRich') where.isIronRich = true
  if (filter === 'lowCalorie') where.isLowCalorie = true

  const recipes = await prisma.recipe.findMany({
    where,
    include: { user: { select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true } } },
    orderBy: { likeCount: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })

  return NextResponse.json({ recipes })
}
