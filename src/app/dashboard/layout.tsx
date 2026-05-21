import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { FloatingParticles } from '@/components/ui/FloatingParticles'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <FloatingParticles />
      <Sidebar />
      <div className="flex-1 ml-[72px] flex flex-col">
        <TopBar user={session.user as any} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
