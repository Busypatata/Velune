import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { BattleClient } from '@/components/battle/BattleClient'

export default async function BattlePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const userId = session.user.id

  const [activeBattles, leaderboard, userStats] = await Promise.all([
    prisma.battle.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
        status: { in: ['active', 'pending'] },
      },
      include: {
        userA: { select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true } },
        userB: { select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    // Global leaderboard by XP
    prisma.user.findMany({
      where: { xpLifestyle: { gt: 0 } },
      select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true, xpLifestyle: true, xpSocial: true },
      orderBy: [{ xpLifestyle: 'desc' }, { xpSocial: 'desc' }],
      take: 10,
    }),
    // User battle stats
    prisma.battle.aggregate({
      where: { OR: [{ userAId: userId }, { userBId: userId }], status: 'completed' },
      _count: { id: true },
    }),
  ])

  const wonCount = await prisma.battle.count({ where: { winnerId: userId, status: 'completed' } })
  const globalRank = await prisma.user.count({ where: { xpLifestyle: { gt: (await prisma.user.findUnique({ where: { id: userId }, select: { xpLifestyle: true } }))?.xpLifestyle ?? 0 } } })

  return (
    <BattleClient
      activeBattles={JSON.parse(JSON.stringify(activeBattles))}
      leaderboard={JSON.parse(JSON.stringify(leaderboard))}
      totalBattles={userStats._count.id}
      wonBattles={wonCount}
      globalRank={globalRank + 1}
      currentUserId={userId}
    />
  )
}
