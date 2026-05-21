import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SocialFeedClient } from '@/components/social/SocialFeedClient'

export default async function SocialPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const userId = session.user.id

  const [posts, matches, leaderboard] = await Promise.all([
    prisma.post.findMany({
      where: { isPublic: true },
      include: {
        user: { select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true } },
        likes: { where: { userId }, select: { id: true } },
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    // Nutrition matches — users with similar blueprint goals
    prisma.user.findMany({
      where: { id: { not: userId }, blueprint: { isNot: null } },
      select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true, blueprint: { select: { goal: true, dietaryPref: true } } },
      take: 5,
    }),
    // Leaderboard by streak
    prisma.streak.findMany({
      where: { isActive: true, type: 'protein' },
      orderBy: { currentDays: 'desc' },
      take: 10,
      include: { user: { select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true } } },
    }),
  ])

  return (
    <SocialFeedClient
      posts={JSON.parse(JSON.stringify(posts.map((p) => ({
        ...p,
        likeCount: p._count.likes,
        commentCount: p._count.comments,
        isLiked: p.likes.length > 0,
      }))))}
      matches={JSON.parse(JSON.stringify(matches))}
      leaderboard={JSON.parse(JSON.stringify(leaderboard))}
      currentUserId={userId}
    />
  )
}
