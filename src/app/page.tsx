import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const session = await auth()
  if (session?.user) redirect('/dashboard')

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: '#F7F4ED' }}>
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, #B7A7D9 0%, transparent 70%)' }} />
        <div className="absolute top-[20%] right-[-5%] w-80 h-80 rounded-full opacity-25 blur-3xl" style={{ background: 'radial-gradient(circle, #B8F2D0 0%, transparent 70%)' }} />
        <div className="absolute bottom-[10%] left-[30%] w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #FFB997 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-6xl animate-bounce-soft">🌿</span>
            <h1 className="font-display text-6xl font-semibold" style={{ color: '#374151' }}>
              Velune
            </h1>
          </div>
          <p className="text-xl font-medium" style={{ color: '#6B7280' }}>
            Grow your world through nutrition
          </p>
        </div>

        {/* Tagline */}
        <p className="max-w-xl text-base font-medium mb-12 leading-relaxed" style={{ color: '#6B7280' }}>
          A cozy social nutrition RPG where your daily eating habits bloom into
          a living fantasy garden — complete with mascots, battles, collectibles, and a community that grows with you.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { emoji: '🌸', text: 'Profile Garden' },
            { emoji: '⚔️', text: 'Battle Arena' },
            { emoji: '🦊', text: 'Mascot Companions' },
            { emoji: '🎴', text: 'Collectibles' },
            { emoji: '🔥', text: 'Streaks & XP' },
            { emoji: '📖', text: 'Recipe World' },
          ].map((f) => (
            <span
              key={f.text}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
              style={{ background: 'rgba(252,251,248,0.8)', border: '1px solid rgba(183,167,217,0.3)', color: '#374151' }}
            >
              {f.emoji} {f.text}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/auth/signup"
            className="btn-primary px-8 py-4 text-base"
          >
            🌱 Start Growing
          </Link>
          <Link
            href="/auth/login"
            className="btn-secondary px-8 py-4 text-base"
          >
            Sign In
          </Link>
        </div>

        {/* Floating elements */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8 text-3xl opacity-40">
          <span className="animate-sway">🌹</span>
          <span className="animate-float" style={{ animationDelay: '0.5s' }}>🦋</span>
          <span className="animate-sway" style={{ animationDelay: '1s' }}>🌊</span>
          <span className="animate-float" style={{ animationDelay: '1.5s' }}>✨</span>
          <span className="animate-sway" style={{ animationDelay: '2s' }}>🌸</span>
        </div>
      </div>
    </main>
  )
}
