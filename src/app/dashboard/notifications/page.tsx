import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { NotificationsClient } from '@/components/NotificationsClient'

export default async function NotificationsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  // Mark all as read
  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  })

  return <NotificationsClient notifications={JSON.parse(JSON.stringify(notifications))} />
}
