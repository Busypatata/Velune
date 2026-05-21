import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/gamification'
import { addDays } from 'date-fns'

const BATTLE_DURATIONS: Record<string, number> = {
  protein: 7, hydration: 7, balanced: 30, consistency: 14, calories: 7
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { opponentUsername, battleType } = await req.json()

  const opponent = await prisma.user.findUnique({ where: { username: opponentUsername.replace('@', '') } })
  if (!opponent) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (opponent.id === session.user.id) return NextResponse.json({ error: 'Cannot battle yourself' }, { status: 400 })

  const durationDays = BATTLE_DURATIONS[battleType] ?? 7
  const startDate = new Date()
  const endDate = addDays(startDate, durationDays)

  const battle = await prisma.battle.create({
    data: {
      userAId: session.user.id,
      userBId: opponent.id,
      battleType,
      status: 'pending',
      startDate,
      endDate,
    },
    include: {
      userA: { select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true } },
      userB: { select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true } },
    },
  })

  const challenger = await prisma.user.findUnique({ where: { id: session.user.id }, select: { username: true } })
  await createNotification(
    opponent.id, 'battle_invite', 'social', '⚔️ Battle Challenge!',
    `@${challenger?.username} challenged you to a ${battleType} battle!`,
    { battleId: battle.id, challengerId: session.user.id }
  )

  return NextResponse.json({ battle }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const battles = await prisma.battle.findMany({
    where: { OR: [{ userAId: session.user.id }, { userBId: session.user.id }] },
    include: {
      userA: { select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true } },
      userB: { select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ battles })
}
