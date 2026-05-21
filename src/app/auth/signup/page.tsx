'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Registration failed')
      setLoading(false)
      return
    }

    router.push('/auth/login?registered=1')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="velune-card p-8">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3 animate-bounce-soft">🌱</span>
          <h1 className="font-display text-3xl font-semibold mb-2" style={{ color: '#374151' }}>Join Velune</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>Plant your first seed today</p>
        </div>

        {error && <div className="alert-velune mb-4 text-xs">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#6B7280' }}>Name</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ara Soo" className="input-velune" required />
            </div>
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#6B7280' }}>Username</label>
              <input value={form.username} onChange={(e) => set('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} placeholder="@ara_so" className="input-velune" required />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: '#6B7280' }}>Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" className="input-velune" required />
          </div>
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: '#6B7280' }}>Password</label>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="••••••••" className="input-velune" required minLength={6} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm mt-2">
            {loading ? '✨ Creating your garden...' : '🌱 Create Account'}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: '#6B7280' }}>
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold" style={{ color: '#9D79D6' }}>Sign in</Link>
        </p>
      </div>
    </motion.div>
  )
}
