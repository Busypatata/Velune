'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const FILTERS = [
  { key: 'all',         label: '🌱 All' },
  { key: 'highProtein', label: '💪 High Protein' },
  { key: 'vegan',       label: '🌿 Vegan' },
  { key: 'quick',       label: '⚡ Quick' },
  { key: 'budget',      label: '💰 Budget' },
  { key: 'ironRich',    label: '🔩 Iron Rich' },
  { key: 'lowCalorie',  label: '🔥 Low Calorie' },
  { key: 'vitaminRich', label: '🌈 Vitamin Rich' },
]

interface RecipesClientProps {
  recipes: any[]
  currentUserId: string
}

function RecipeCard({ recipe, currentUserId }: { recipe: any; currentUserId: string }) {
  const [liked, setLiked] = useState(recipe.isLiked)
  const [likeCount, setLikeCount] = useState(recipe.likeCount)

  async function toggleLike(e: React.MouseEvent) {
    e.preventDefault()
    setLiked(!liked)
    setLikeCount((c: number) => liked ? c - 1 : c + 1)
    await fetch('/api/social/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipeId: recipe.id }),
    })
  }

  const tags = [
    recipe.isVegan && { label: 'Vegan', color: '#3B7A54', bg: 'rgba(143,191,159,0.2)' },
    recipe.isVegetarian && !recipe.isVegan && { label: 'Veggie', color: '#5B8F40', bg: 'rgba(143,191,159,0.15)' },
    recipe.isHighProtein && { label: 'High Protein', color: '#A03B33', bg: 'rgba(244,151,142,0.2)' },
    recipe.isLowCalorie && { label: 'Low Cal', color: '#8B6A00', bg: 'rgba(255,203,119,0.2)' },
    recipe.isIronRich && { label: 'Iron Rich', color: '#2E5A8A', bg: 'rgba(149,213,178,0.2)' },
    recipe.isQuick && { label: 'Quick', color: '#8B6A00', bg: 'rgba(255,203,119,0.2)' },
  ].filter(Boolean)

  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}
      className="velune-card overflow-hidden cursor-pointer"
      style={{ transition: 'all 0.2s' }}
    >
      {/* Image */}
      <div
        className="w-full h-28 flex items-center justify-center text-5xl"
        style={{ background: 'linear-gradient(135deg, rgba(184,242,208,0.3), rgba(183,167,217,0.25))' }}
      >
        {recipe.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        ) : recipe.emoji}
      </div>

      <div className="p-3">
        <div className="font-bold text-sm mb-2" style={{ color: '#374151' }}>{recipe.title}</div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {(tags as any[]).slice(0, 2).map((tag: any) => (
            <span key={tag.label} className="text-xs font-bold px-1.5 py-0.5 rounded-lg" style={{ color: tag.color, background: tag.bg }}>
              {tag.label}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs" style={{ color: '#6B7280' }}>
          <span>⚡ {recipe.calories.toFixed(0)} kcal</span>
          {totalTime > 0 && <span>⏱ {totalTime}min</span>}
          <button
            onClick={toggleLike}
            className="flex items-center gap-1 font-bold transition-all"
            style={{ color: liked ? '#FFAAA5' : '#6B7280' }}
          >
            {liked ? '❤️' : '🤍'} {likeCount}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function RecipesClient({ recipes, currentUserId }: RecipesClientProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [showUpload, setShowUpload] = useState(false)
  const router = useRouter()

  const filtered = recipes.filter((r) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'highProtein') return r.isHighProtein
    if (activeFilter === 'vegan') return r.isVegan
    if (activeFilter === 'quick') return r.isQuick
    if (activeFilter === 'budget') return r.isBudget
    if (activeFilter === 'ironRich') return r.isIronRich
    if (activeFilter === 'lowCalorie') return r.isLowCalorie
    if (activeFilter === 'vitaminRich') return r.isVitaminRich
    return true
  })

  return (
    <div>
      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap mb-5 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={{
                background: activeFilter === f.key
                  ? 'linear-gradient(135deg, rgba(143,191,159,0.4), rgba(184,242,208,0.4))'
                  : 'rgba(234,231,225,0.6)',
                border: `1px solid ${activeFilter === f.key ? 'rgba(143,191,159,0.5)' : 'rgba(183,167,217,0.2)'}`,
                color: activeFilter === f.key ? '#374151' : '#6B7280',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowUpload(true)}
          className="btn-primary px-4 py-2 text-xs"
        >
          + Upload Recipe
        </motion.button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="velune-card p-12 text-center">
          <span className="text-4xl">📖</span>
          <p className="mt-3 font-semibold" style={{ color: '#374151' }}>No recipes yet in this category</p>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Be the first to upload one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((recipe, i) => (
            <motion.div key={recipe.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <RecipeCard recipe={recipe} currentUserId={currentUserId} />
            </motion.div>
          ))}
        </div>
      )}

      {showUpload && (
        <UploadRecipeModal onClose={() => setShowUpload(false)} onUpload={() => { setShowUpload(false); router.refresh() }} />
      )}
    </div>
  )
}

function UploadRecipeModal({ onClose, onUpload }: { onClose: () => void; onUpload: () => void }) {
  const [form, setForm] = useState({
    title: '', description: '', emoji: '🍽️', prepTime: '', cookTime: '', servings: '2',
    isVegan: false, isVegetarian: false, isHighProtein: false, isQuick: false,
  })
  const [saving, setSaving] = useState(false)
  function set(k: string, v: any) { setForm((p) => ({ ...p, [k]: v })) }

  async function submit() {
    if (!form.title.trim()) return
    setSaving(true)
    await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, prepTime: Number(form.prepTime) || null, cookTime: Number(form.cookTime) || null, servings: Number(form.servings) || 2, ingredients: [], steps: [] }),
    })
    setSaving(false)
    onUpload()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(31,41,55,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="velune-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold" style={{ color: '#374151' }}>Upload Recipe 📖</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(234,231,225,0.8)', color: '#6B7280' }}>✕</button>
        </div>
        <div className="space-y-4">
          <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Recipe name" className="input-velune" />
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Description..." className="input-velune resize-none h-20" />
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-xs font-bold mb-1 block" style={{ color: '#6B7280' }}>Emoji</label>
              <input value={form.emoji} onChange={(e) => set('emoji', e.target.value)} className="input-velune text-center" /></div>
            <div><label className="text-xs font-bold mb-1 block" style={{ color: '#6B7280' }}>Prep (min)</label>
              <input type="number" value={form.prepTime} onChange={(e) => set('prepTime', e.target.value)} className="input-velune" /></div>
            <div><label className="text-xs font-bold mb-1 block" style={{ color: '#6B7280' }}>Cook (min)</label>
              <input type="number" value={form.cookTime} onChange={(e) => set('cookTime', e.target.value)} className="input-velune" /></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[['isVegan','🌿 Vegan'],['isVegetarian','🥦 Veggie'],['isHighProtein','💪 High Protein'],['isQuick','⚡ Quick']].map(([k, label]) => (
              <button key={k} onClick={() => set(k, !(form as any)[k])}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{ background: (form as any)[k] ? 'rgba(143,191,159,0.3)' : 'rgba(234,231,225,0.6)', border: `1px solid ${(form as any)[k] ? 'rgba(143,191,159,0.5)' : 'rgba(183,167,217,0.2)'}`, color: '#374151' }}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={submit} disabled={!form.title.trim() || saving} className="btn-primary w-full py-3.5 text-sm disabled:opacity-50">
            {saving ? '✨ Uploading...' : '📖 Upload Recipe'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
