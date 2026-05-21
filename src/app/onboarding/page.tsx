'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { calculateBlueprint } from '@/lib/nutrition'

const STEPS = ['basics', 'body', 'goal', 'diet', 'mascot'] as const
type Step = typeof STEPS[number]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('basics')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    age: '', weight: '', height: '', gender: 'female',
    activityLevel: 'moderate', goal: 'healthy_lifestyle',
    dietaryPref: 'non_veg', allergies: [] as string[],
    cuisines: [] as string[], mascotType: 'fox', mascotName: 'Lumie',
  })

  function set(k: string, v: any) { setForm((p) => ({ ...p, [k]: v })) }
  function toggleArr(k: 'allergies' | 'cuisines', v: string) {
    setForm((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }))
  }

  const stepIdx = STEPS.indexOf(step)
  const progress = ((stepIdx + 1) / STEPS.length) * 100

  async function finish() {
    setSaving(true)
    const targets = calculateBlueprint({
      age: Number(form.age), weight: Number(form.weight), height: Number(form.height),
      gender: form.gender, activityLevel: form.activityLevel, goal: form.goal,
    })
    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, ...targets }),
    })
    router.push('/dashboard')
  }

  const ACTIVITY = [
    { v: 'sedentary', l: 'Sedentary', d: 'Little to no exercise' },
    { v: 'light',     l: 'Light',     d: '1-3 days/week' },
    { v: 'moderate',  l: 'Moderate',  d: '3-5 days/week' },
    { v: 'active',    l: 'Active',    d: '6-7 days/week' },
    { v: 'very_active', l: 'Very Active', d: 'Intense daily' },
  ]
  const GOALS = [
    { v: 'lose_weight',       l: '⬇️ Lose Weight',    d: 'Calorie deficit' },
    { v: 'maintain',          l: '⚖️ Maintain',        d: 'Stay balanced' },
    { v: 'gain_muscle',       l: '💪 Gain Muscle',     d: 'Protein focus' },
    { v: 'healthy_lifestyle', l: '🌿 Healthy Living',  d: 'Overall wellness' },
  ]
  const DIETS = [
    { v: 'non_veg',     l: '🍗 Non-Veg',    d: 'All foods' },
    { v: 'vegetarian',  l: '🥦 Vegetarian', d: 'No meat/fish' },
    { v: 'vegan',       l: '🌱 Vegan',      d: 'Plant only' },
    { v: 'pescatarian', l: '🐟 Pescatarian', d: 'Fish + veg' },
  ]
  const MASCOTS = [
    { v: 'fox',    l: '🦊 Fox',    d: 'Lumie — curious & warm' },
    { v: 'bunny',  l: '🐰 Bunny',  d: 'Bunie — sweet & gentle' },
    { v: 'dragon', l: '🐲 Dragon', d: 'Dracul — fierce & loyal' },
    { v: 'cat',    l: '🐱 Cat',    d: 'Mochi — calm & cozy' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F7F4ED' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #B7A7D9, transparent)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #B8F2D0, transparent)' }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold mb-2" style={{ color: '#6B7280' }}>
            <span>Step {stepIdx + 1} of {STEPS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="xp-bar"><div className="xp-bar-fill" style={{ width: `${progress}%` }} /></div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            <div className="velune-card p-8">

              {step === 'basics' && (
                <div>
                  <div className="text-center mb-6"><span className="text-5xl block mb-3">🌱</span>
                    <h1 className="font-display text-2xl font-semibold" style={{ color: '#374151' }}>Welcome to Velune!</h1>
                    <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Let&apos;s build your Nutrition Blueprint</p>
                  </div>
                  <div className="space-y-4">
                    <div><label className="text-xs font-bold mb-1.5 block" style={{ color: '#6B7280' }}>Age</label>
                      <input type="number" value={form.age} onChange={(e) => set('age', e.target.value)} placeholder="24" className="input-velune" /></div>
                    <div><label className="text-xs font-bold mb-1.5 block" style={{ color: '#6B7280' }}>Gender</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[['female','👩 Female'],['male','👨 Male'],['other','🧑 Other']].map(([v, l]) => (
                          <button key={v} onClick={() => set('gender', v)}
                            className="py-2.5 rounded-xl text-sm font-bold transition-all"
                            style={{ background: form.gender === v ? 'rgba(183,167,217,0.35)' : 'rgba(234,231,225,0.5)', border: `1px solid ${form.gender === v ? 'rgba(183,167,217,0.5)' : 'rgba(183,167,217,0.2)'}`, color: '#374151' }}>{l}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 'body' && (
                <div>
                  <div className="text-center mb-6"><span className="text-5xl block mb-3">⚖️</span>
                    <h1 className="font-display text-2xl font-semibold" style={{ color: '#374151' }}>Your Body Stats</h1>
                    <p className="text-sm mt-1" style={{ color: '#6B7280' }}>For accurate nutrition targets</p>
                  </div>
                  <div className="space-y-4">
                    <div><label className="text-xs font-bold mb-1.5 block" style={{ color: '#6B7280' }}>Weight (kg)</label>
                      <input type="number" value={form.weight} onChange={(e) => set('weight', e.target.value)} placeholder="60" className="input-velune" /></div>
                    <div><label className="text-xs font-bold mb-1.5 block" style={{ color: '#6B7280' }}>Height (cm)</label>
                      <input type="number" value={form.height} onChange={(e) => set('height', e.target.value)} placeholder="165" className="input-velune" /></div>
                    <div><label className="text-xs font-bold mb-2 block" style={{ color: '#6B7280' }}>Activity Level</label>
                      <div className="space-y-2">
                        {ACTIVITY.map(({ v, l, d }) => (
                          <button key={v} onClick={() => set('activityLevel', v)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                            style={{ background: form.activityLevel === v ? 'rgba(183,167,217,0.25)' : 'rgba(234,231,225,0.5)', border: `1px solid ${form.activityLevel === v ? 'rgba(183,167,217,0.5)' : 'rgba(183,167,217,0.15)'}` }}>
                            <div className="flex-1"><div className="text-sm font-bold" style={{ color: '#374151' }}>{l}</div>
                              <div className="text-xs" style={{ color: '#6B7280' }}>{d}</div></div>
                            {form.activityLevel === v && <span style={{ color: '#9D79D6' }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 'goal' && (
                <div>
                  <div className="text-center mb-6"><span className="text-5xl block mb-3">🎯</span>
                    <h1 className="font-display text-2xl font-semibold" style={{ color: '#374151' }}>Your Goal</h1>
                    <p className="text-sm mt-1" style={{ color: '#6B7280' }}>What are you working towards?</p>
                  </div>
                  <div className="space-y-2">
                    {GOALS.map(({ v, l, d }) => (
                      <button key={v} onClick={() => set('goal', v)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all"
                        style={{ background: form.goal === v ? 'rgba(143,191,159,0.2)' : 'rgba(234,231,225,0.5)', border: `1.5px solid ${form.goal === v ? 'rgba(143,191,159,0.5)' : 'rgba(183,167,217,0.2)'}` }}>
                        <div className="text-xl">{l.split(' ')[0]}</div>
                        <div className="flex-1"><div className="text-sm font-bold" style={{ color: '#374151' }}>{l.slice(3)}</div>
                          <div className="text-xs" style={{ color: '#6B7280' }}>{d}</div></div>
                        {form.goal === v && <span style={{ color: '#8FBF9F' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'diet' && (
                <div>
                  <div className="text-center mb-6"><span className="text-5xl block mb-3">🥗</span>
                    <h1 className="font-display text-2xl font-semibold" style={{ color: '#374151' }}>Dietary Preference</h1>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {DIETS.map(({ v, l, d }) => (
                      <button key={v} onClick={() => set('dietaryPref', v)}
                        className="p-3 rounded-2xl text-center transition-all"
                        style={{ background: form.dietaryPref === v ? 'rgba(183,167,217,0.25)' : 'rgba(234,231,225,0.5)', border: `1.5px solid ${form.dietaryPref === v ? 'rgba(183,167,217,0.5)' : 'rgba(183,167,217,0.15)'}` }}>
                        <div className="text-2xl mb-1">{l.split(' ')[0]}</div>
                        <div className="text-xs font-bold" style={{ color: '#374151' }}>{l.slice(3)}</div>
                        <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{d}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'mascot' && (
                <div>
                  <div className="text-center mb-6"><span className="text-5xl block mb-3 animate-bounce-soft">🦊</span>
                    <h1 className="font-display text-2xl font-semibold" style={{ color: '#374151' }}>Choose Your Companion</h1>
                    <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Your mascot lives in your garden and reacts to your habits</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {MASCOTS.map(({ v, l, d }) => (
                      <button key={v} onClick={() => set('mascotType', v)}
                        className="p-4 rounded-2xl text-center transition-all"
                        style={{ background: form.mascotType === v ? 'rgba(183,167,217,0.25)' : 'rgba(234,231,225,0.5)', border: `1.5px solid ${form.mascotType === v ? 'rgba(183,167,217,0.5)' : 'rgba(183,167,217,0.15)'}` }}>
                        <div className="text-3xl mb-1">{l.split(' ')[0]}</div>
                        <div className="text-sm font-bold" style={{ color: '#374151' }}>{l.slice(2)}</div>
                        <div className="text-xs mt-1" style={{ color: '#6B7280' }}>{d}</div>
                      </button>
                    ))}
                  </div>
                  <div><label className="text-xs font-bold mb-1.5 block" style={{ color: '#6B7280' }}>Name your companion</label>
                    <input value={form.mascotName} onChange={(e) => set('mascotName', e.target.value)} placeholder="Lumie" className="input-velune" /></div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-6">
                {stepIdx > 0 && (
                  <button onClick={() => setStep(STEPS[stepIdx - 1])} className="btn-secondary px-6 py-3 text-sm">← Back</button>
                )}
                {stepIdx < STEPS.length - 1 ? (
                  <button onClick={() => setStep(STEPS[stepIdx + 1])} className="btn-primary flex-1 py-3 text-sm">Continue →</button>
                ) : (
                  <button onClick={finish} disabled={saving} className="btn-primary flex-1 py-3 text-sm disabled:opacity-50">
                    {saving ? '✨ Creating your world...' : '🌱 Enter Velune'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
