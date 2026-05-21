import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { awardXP, createNotification } from '@/lib/gamification'
import { XP_REWARDS } from '@/types'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, recipeId } = await req.json()
  const userId = session.user.id

  if (postId) {
    const existing = await prisma.like.findUnique({ where: { userId_postId: { userId, postId } } })
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } })
      await prisma.post.update({ where: { id: postId }, data: { likeCount: { decrement: 1 } } })
      return NextResponse.json({ liked: false })
    }

    await prisma.like.create({ data: { userId, postId } })
    await prisma.post.update({ where: { id: postId }, data: { likeCount: { increment: 1 } } })

    // Notify post author
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { userId: true } })
    if (post && post.userId !== userId) {
      const liker = await prisma.user.findUnique({ where: { id: userId }, select: { username: true } })
      await createNotification(post.userId, 'like', 'social', '❤️ New Like', `@${liker?.username} liked your post!`)
    }

    return NextResponse.json({ liked: true })
  }

  if (recipeId) {
    const existing = await prisma.like.findUnique({ where: { userId_recipeId: { userId, recipeId } } })
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } })
      await prisma.recipe.update({ where: { id: recipeId }, data: { likeCount: { decrement: 1 } } })
      return NextResponse.json({ liked: false })
    }

    await prisma.like.create({ data: { userId, recipeId } })
    await prisma.recipe.update({ where: { id: recipeId }, data: { likeCount: { increment: 1 } } })

    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId }, select: { userId: true } })
    if (recipe && recipe.userId !== userId) {
      await awardXP(recipe.userId, 'social', XP_REWARDS.RECIPE_LIKED, 'Recipe received a like')
    }

    return NextResponse.json({ liked: true })
  }

  return NextResponse.json({ error: 'postId or recipeId required' }, { status: 400 })
}
