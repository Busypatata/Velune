'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email, password, redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password. Try ara@velune.app / velune123')
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="velune-card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl animate-bounce-soft block mb-3">🌿</span>
          <h1 className="font-display text-3xl font-semibold mb-2" style={{ color: '#374151' }}>
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Your garden has been waiting ✨
          </p>
        </div>

        {error && (
          <div className="alert-velune mb-4 text-xs">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: '#6B7280' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-velune"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: '#6B7280' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-velune"
              required
            />
          </div>

          <Link href="/auth/forgot-password" className="text-xs font-semibold block text-right" style={{ color: '#9D79D6' }}>
            Forgot password?
          </Link>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm mt-2">
            {loading ? '✨ Entering...' : '🌿 Sign In'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'rgba(183,167,217,0.3)' }} />
          <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>or</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(183,167,217,0.3)' }} />
        </div>

        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="btn-secondary w-full py-3 text-sm"
        >
          <span>🌐</span> Continue with Google
        </button>

        <p className="text-center text-xs mt-6" style={{ color: '#6B7280' }}>
          New to Velune?{' '}
          <Link href="/auth/signup" className="font-bold" style={{ color: '#9D79D6' }}>
            Create account
          </Link>
        </p>

        {/* Demo hint */}
        <div className="mt-4 p-3 rounded-xl text-xs text-center" style={{ background: 'rgba(184,242,208,0.2)', border: '1px solid rgba(143,191,159,0.3)', color: '#3B7A54' }}>
          🌱 Demo: ara@velune.app / velune123
        </div>
      </div>
    </motion.div>
  )
}
