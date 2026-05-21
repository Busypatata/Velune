import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ProfileClient } from '@/components/profile/ProfileClient'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      blueprint: true,
      mascot: true,
      streaks: { orderBy: { currentDays: 'desc' } },
      gardenElements: { where: { isVisible: true } },
      titles: { include: { title: true }, orderBy: { unlockedAt: 'desc' } },
      collectibles: { include: { collectible: true }, orderBy: { discoveredAt: 'desc' } },
      _count: { select: { posts: true, recipes: true, battlesAsA: true, battlesAsB: true } },
    },
  })

  if (!user) redirect('/auth/login')

  const wonBattles = await prisma.battle.count({ where: { winnerId: user.id } })

  return (
    <ProfileClient
      user={JSON.parse(JSON.stringify(user))}
      wonBattles={wonBattles}
    />
  )
}
