import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/gamification'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { receiverId } = await req.json()
  const senderId = session.user.id

  if (senderId === receiverId) return NextResponse.json({ error: 'Cannot add yourself' }, { status: 400 })

  const existing = await prisma.friendRequest.findUnique({ where: { senderId_receiverId: { senderId, receiverId } } })
  if (existing) return NextResponse.json({ error: 'Request already sent' }, { status: 409 })

  const request = await prisma.friendRequest.create({ data: { senderId, receiverId } })

  const sender = await prisma.user.findUnique({ where: { id: senderId }, select: { username: true } })
  await createNotification(receiverId, 'friend_request', 'social', '👥 Chummy Request!', `@${sender?.username} wants to be your Chummy!`, { requestId: request.id, senderId })

  return NextResponse.json({ request }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { requestId, action } = await req.json() // action: accept | ghost
  const userId = session.user.id

  const request = await prisma.friendRequest.findUnique({ where: { id: requestId } })
  if (!request || request.receiverId !== userId) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (action === 'accept') {
    await Promise.all([
      prisma.friendRequest.update({ where: { id: requestId }, data: { status: 'accepted' } }),
      prisma.friendship.create({ data: { userAId: request.senderId, userBId: userId } }),
    ])
    const accepter = await prisma.user.findUnique({ where: { id: userId }, select: { username: true } })
    await createNotification(request.senderId, 'friend_request', 'social', '🎉 Chummy Accepted!', `@${accepter?.username} accepted your Chummy request!`)
    return NextResponse.json({ status: 'accepted' })
  }

  await prisma.friendRequest.update({ where: { id: requestId }, data: { status: 'ghosted' } })
  return NextResponse.json({ status: 'ghosted' })
}
