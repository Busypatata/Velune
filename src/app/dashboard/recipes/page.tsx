import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { RecipesClient } from '@/components/social/RecipesClient'

export default async function RecipesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const recipes = await prisma.recipe.findMany({
    where: { isPublic: true },
    include: {
      user: { select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true } },
      likes: { where: { userId: session.user.id }, select: { id: true } },
    },
    orderBy: { likeCount: 'desc' },
    take: 24,
  })

  return (
    <RecipesClient
      recipes={JSON.parse(JSON.stringify(recipes.map((r) => ({ ...r, isLiked: r.likes.length > 0 }))))}
      currentUserId={session.user.id}
    />
  )
}
