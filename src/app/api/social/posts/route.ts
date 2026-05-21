import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { awardXP } from '@/lib/gamification'
import { XP_REWARDS } from '@/types'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content, postType, imageUrl, recipeId, metadata } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Content required' }, { status: 400 })

  const post = await prisma.post.create({
    data: {
      userId: session.user.id,
      content,
      postType: postType ?? 'general',
      imageUrl,
      recipeId,
      metadata,
    },
    include: {
      user: { select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true } },
    },
  })

  await awardXP(session.user.id, 'social', XP_REWARDS.POST_CREATED, 'Created a post')

  return NextResponse.json({ post }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 20

  const posts = await prisma.post.findMany({
    where: { isPublic: true },
    include: {
      user: { select: { id: true, username: true, name: true, image: true, level: true, activeTitle: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })

  return NextResponse.json({ posts })
}
