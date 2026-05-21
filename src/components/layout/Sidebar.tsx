'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { href: '/dashboard',           emoji: '🌿', label: 'Home',         badge: false },
  { href: '/dashboard/log',       emoji: '🍽️', label: 'Food Log',     badge: false },
  { href: '/dashboard/social',    emoji: '🌸', label: 'Social',       badge: true  },
  { href: '/dashboard/recipes',   emoji: '📖', label: 'Recipes',      badge: false },
  { href: '/dashboard/battle',    emoji: '⚔️', label: 'Battle',       badge: false },
  { href: '/dashboard/profile',   emoji: '🌻', label: 'Profile',      badge: false },
  { href: '/dashboard/collectibles', emoji: '✨', label: 'Collectibles', badge: false },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[72px] z-50 flex flex-col items-center py-5 gap-1"
      style={{
        background: 'linear-gradient(180deg, rgba(183,167,217,0.2) 0%, rgba(143,191,159,0.15) 100%)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(183,167,217,0.25)',
      }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="mb-5">
        <span className="font-display text-lg font-semibold" style={{ color: '#9D79D6' }}>V</span>
      </Link>

      {/* Nav items */}
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
        return (
          <Link key={item.href} href={item.href} title={item.label}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-200"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(183,167,217,0.5), rgba(143,191,159,0.4))'
                  : 'transparent',
                boxShadow: isActive ? '0 4px 15px rgba(167,139,250,0.3)' : 'none',
              }}
            >
              {item.emoji}
              {item.badge && (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full pulse-dot"
                  style={{ border: '2px solid var(--bg-primary)' }}
                />
              )}
            </motion.div>
          </Link>
        )
      })}

      {/* Notifications at bottom */}
      <div className="mt-auto">
        <Link href="/dashboard/notifications" title="Notifications">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: 'transparent' }}
          >
            🔔
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full pulse-dot"
              style={{ border: '2px solid var(--bg-primary)' }}
            />
          </motion.div>
        </Link>
      </div>
    </aside>
  )
}
