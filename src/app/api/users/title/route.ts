import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { titleId } = await req.json()
  const userId = session.user.id

  // Verify user owns this title
  const userTitle = await prisma.userTitle.findUnique({ where: { userId_titleId: { userId, titleId } }, include: { title: true } })
  if (!userTitle) return NextResponse.json({ error: 'Title not owned' }, { status: 404 })

  // Unequip all, equip selected
  await prisma.$transaction([
    prisma.userTitle.updateMany({ where: { userId }, data: { isEquipped: false } }),
    prisma.userTitle.update({ where: { userId_titleId: { userId, titleId } }, data: { isEquipped: true } }),
    prisma.user.update({ where: { id: userId }, data: { activeTitle: `${userTitle.title.emoji} ${userTitle.title.name}` } }),
  ])

  return NextResponse.json({ success: true })
}
