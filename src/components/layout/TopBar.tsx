'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':               { title: 'Home',        subtitle: 'Your daily nutrition overview' },
  '/dashboard/log':           { title: 'Food Journal', subtitle: 'Log your meals' },
  '/dashboard/social':        { title: 'Blossom Feed', subtitle: 'Community achievements' },
  '/dashboard/recipes':       { title: 'Recipe World', subtitle: 'Discover magical meals' },
  '/dashboard/battle':        { title: 'Battle Arena', subtitle: 'Compete & rise the ranks' },
  '/dashboard/profile':       { title: 'Profile Garden', subtitle: 'Your living world' },
  '/dashboard/collectibles':  { title: 'Discovery Chest', subtitle: 'Rare spirits & companions' },
  '/dashboard/notifications': { title: 'Notifications', subtitle: 'Your updates' },
}

interface TopBarProps {
  user: { name?: string; username?: string; level?: number; image?: string }
}

export function TopBar({ user }: TopBarProps) {
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const info = PAGE_TITLES[pathname] ?? { title: 'Velune', subtitle: '' }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
      style={{
        background: 'rgba(247,244,237,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(183,167,217,0.2)',
      }}
    >
      {/* Page title */}
      <div>
        <h1 className="font-display text-xl font-semibold" style={{ color: '#374151' }}>
          {pathname === '/dashboard' ? `${greeting}, ${user.name?.split(' ')[0] ?? 'there'} ✨` : info.title}
        </h1>
        <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{info.subtitle}</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search foods, users..."
            className="input-velune pl-9 pr-4 py-2 text-xs w-52"
          />
        </div>

        {/* Notification bell */}
        <Link href="/dashboard/notifications">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-2xl flex items-center justify-center text-lg"
            style={{ background: 'rgba(252,251,248,0.9)', border: '1px solid rgba(183,167,217,0.3)' }}
          >
            🔔
            <span className="pulse-dot absolute top-1 right-1" style={{ width: 8, height: 8, border: '2px solid var(--bg-primary)' }} />
          </motion.button>
        </Link>

        {/* User menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl"
            style={{ background: 'rgba(252,251,248,0.9)', border: '1px solid rgba(183,167,217,0.3)' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
              style={{ background: 'linear-gradient(135deg, #B7A7D9, #B8F2D0)' }}
            >
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
              ) : '🧚'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold" style={{ color: '#374151' }}>@{(user as any).username}</div>
              <div className="text-xs" style={{ color: '#9D79D6' }}>Lv {(user as any).level}</div>
            </div>
          </motion.button>

          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-full mt-2 w-48 rounded-2xl py-2 z-50"
              style={{ background: 'rgba(252,251,248,0.98)', border: '1px solid rgba(183,167,217,0.3)', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}
            >
              <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-fog/50 transition-colors" onClick={() => setMenuOpen(false)} style={{ color: '#374151' }}>
                🌻 Profile Garden
              </Link>
              <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-fog/50 transition-colors" onClick={() => setMenuOpen(false)} style={{ color: '#374151' }}>
                ⚙️ Settings
              </Link>
              <div className="my-1 mx-3 h-px" style={{ background: 'rgba(183,167,217,0.2)' }} />
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold w-full text-left hover:bg-fog/50 transition-colors"
                style={{ color: '#E07A7A' }}
              >
                🚪 Sign Out
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  )
}
