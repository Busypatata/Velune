import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { CollectiblesClient } from '@/components/profile/CollectiblesClient'

export default async function CollectiblesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const [userCollectibles, allCollectibles] = await Promise.all([
    prisma.userCollectible.findMany({
      where: { userId: session.user.id },
      include: { collectible: true },
      orderBy: { discoveredAt: 'desc' },
    }),
    prisma.collectible.findMany({ orderBy: { rarity: 'asc' } }),
  ])

  const ownedIds = new Set(userCollectibles.map((uc) => uc.collectibleId))

  return (
    <CollectiblesClient
      owned={JSON.parse(JSON.stringify(userCollectibles))}
      all={JSON.parse(JSON.stringify(allCollectibles))}
      ownedIds={[...ownedIds]}
    />
  )
}
