import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const userId = session.user.id

  const {
    age, weight, height, gender, activityLevel, goal,
    dietaryPref, allergies, cuisines, mascotType, mascotName,
    calorieTarget, proteinTarget, carbTarget, fatTarget, waterTarget, fiberTarget,
  } = body

  await prisma.$transaction([
    // Create or update blueprint
    prisma.nutritionBlueprint.upsert({
      where: { userId },
      create: {
        userId, age: Number(age), weight: Number(weight), height: Number(height),
        gender, activityLevel, goal, dietaryPref,
        allergies: allergies ?? [], cuisines: cuisines ?? [],
        calorieTarget: calorieTarget ?? 2000,
        proteinTarget: proteinTarget ?? 120,
        carbTarget: carbTarget ?? 200,
        fatTarget: fatTarget ?? 65,
        waterTarget: waterTarget ?? 2000,
        fiberTarget: fiberTarget ?? 25,
        microTargets: {
          vitaminA: 900, vitaminC: 75, vitaminD: 15, vitaminB12: 2.4,
          iron: gender === 'female' ? 18 : 8,
          calcium: 1000, magnesium: gender === 'female' ? 320 : 420,
          potassium: 3500,
        },
      },
      update: {
        age: Number(age), weight: Number(weight), height: Number(height),
        gender, activityLevel, goal, dietaryPref,
        allergies: allergies ?? [], cuisines: cuisines ?? [],
        calorieTarget: calorieTarget ?? 2000,
        proteinTarget: proteinTarget ?? 120,
        carbTarget: carbTarget ?? 200,
        fatTarget: fatTarget ?? 65,
        waterTarget: waterTarget ?? 2000,
        fiberTarget: fiberTarget ?? 25,
      },
    }),
    // Update mascot
    prisma.userMascot.upsert({
      where: { userId },
      create: { userId, mascotType: mascotType ?? 'fox', name: mascotName ?? 'Lumie', mood: 'happy' },
      update: { mascotType: mascotType ?? 'fox', name: mascotName ?? 'Lumie' },
    }),
  ])

  // Seed initial title
  const freshSprout = await prisma.title.findUnique({ where: { name: 'Fresh Sprout' } })
  if (freshSprout) {
    await prisma.userTitle.upsert({
      where: { userId_titleId: { userId, titleId: freshSprout.id } },
      create: { userId, titleId: freshSprout.id, isEquipped: true },
      update: {},
    })
    await prisma.user.update({ where: { id: userId }, data: { activeTitle: `${freshSprout.emoji} ${freshSprout.name}` } })
  }

  return NextResponse.json({ success: true })
}
