import type { FoodItem, MealFood, DailyLog, NutritionBlueprint, NutrientRing } from '@/types'

// ─── Macro Calculations ───────────────────────────────────────────────────────

export function calculateNutrition(foods: MealFood[]): Record<string, number> {
  const totals: Record<string, number> = {
    calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0,
    sodium: 0, calcium: 0, iron: 0, vitaminA: 0, vitaminC: 0,
    vitaminD: 0, vitaminB12: 0, vitaminK: 0, magnesium: 0, potassium: 0, zinc: 0,
  }

  for (const mealFood of foods) {
    const factor = getConversionFactor(mealFood.quantity, mealFood.unit, mealFood.food)
    for (const key of Object.keys(totals)) {
      totals[key] += ((mealFood.food as any)[key] ?? 0) * factor
    }
  }

  return totals
}

function getConversionFactor(quantity: number, unit: string, food: FoodItem): number {
  // All stored per 100g or 100ml
  const unitConversions: Record<string, number> = {
    g: quantity / 100,
    ml: quantity / 100,
    tsp: (quantity * 5) / 100,
    tbsp: (quantity * 15) / 100,
    cup: (quantity * 240) / 100,
    piece: quantity / 100,    // treated as grams
    slice: (quantity * 30) / 100,
  }
  return unitConversions[unit] ?? quantity / 100
}

// ─── BMR & Targets ────────────────────────────────────────────────────────────

export function calculateBlueprint(params: {
  age: number
  weight: number
  height: number
  gender: string
  activityLevel: string
  goal: string
}): Omit<NutritionBlueprint, 'id' | 'userId' | 'dietaryPref' | 'allergies' | 'cuisines' | 'microTargets' | 'age' | 'weight' | 'height' | 'gender' | 'activityLevel' | 'goal'> {
  const { age, weight, height, gender, activityLevel, goal } = params

  // Mifflin-St Jeor BMR
  let bmr = 10 * weight + 6.25 * height - 5 * age
  bmr += gender === 'male' ? 5 : -161

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }
  const tdee = bmr * (activityMultipliers[activityLevel] ?? 1.55)

  const goalAdjustments: Record<string, number> = {
    lose_weight: -500,
    maintain: 0,
    gain_muscle: 300,
    healthy_lifestyle: 0,
  }
  const calorieTarget = Math.round(tdee + (goalAdjustments[goal] ?? 0))

  // Macros
  const proteinTarget = Math.round(weight * (goal === 'gain_muscle' ? 2.0 : 1.6))
  const fatTarget = Math.round((calorieTarget * 0.28) / 9)
  const carbTarget = Math.round((calorieTarget - proteinTarget * 4 - fatTarget * 9) / 4)
  const waterTarget = Math.round(weight * 35) // ml
  const fiberTarget = 25

  return { calorieTarget, proteinTarget, carbTarget, fatTarget, waterTarget, fiberTarget }
}

// ─── Nutrient Rings ───────────────────────────────────────────────────────────

export function buildNutrientRings(log: Partial<DailyLog>, blueprint: NutritionBlueprint): NutrientRing[] {
  const rings: NutrientRing[] = [
    {
      key: 'calories',
      label: 'Calories',
      color: '#FFD166',
      current: log.calories ?? 0,
      target: blueprint.calorieTarget,
      unit: 'kcal',
      pct: Math.min(100, Math.round(((log.calories ?? 0) / blueprint.calorieTarget) * 100)),
    },
    {
      key: 'protein',
      label: 'Protein',
      color: '#F4978E',
      current: log.protein ?? 0,
      target: blueprint.proteinTarget,
      unit: 'g',
      pct: Math.min(100, Math.round(((log.protein ?? 0) / blueprint.proteinTarget) * 100)),
    },
    {
      key: 'vitamins',
      label: 'Vitamins',
      color: '#C8B6FF',
      current: log.vitaminsPct ?? 0,
      target: 100,
      unit: '%',
      pct: Math.min(100, Math.round(log.vitaminsPct ?? 0)),
    },
    {
      key: 'hydration',
      label: 'Hydration',
      color: '#7BDFF2',
      current: log.water ?? 0,
      target: blueprint.waterTarget,
      unit: 'ml',
      pct: Math.min(100, Math.round(((log.water ?? 0) / blueprint.waterTarget) * 100)),
    },
    {
      key: 'minerals',
      label: 'Minerals',
      color: '#95D5B2',
      current: log.mineralsPct ?? 0,
      target: 100,
      unit: '%',
      pct: Math.min(100, Math.round(log.mineralsPct ?? 0)),
    },
    {
      key: 'fiber',
      label: 'Fiber',
      color: '#FFCB77',
      current: log.fiber ?? 0,
      target: blueprint.fiberTarget,
      unit: 'g',
      pct: Math.min(100, Math.round(((log.fiber ?? 0) / blueprint.fiberTarget) * 100)),
    },
  ]
  return rings
}

// ─── Vitamin Completion Percent ───────────────────────────────────────────────

export function calcVitaminsPct(log: Partial<DailyLog>, targets: Record<string, number>): number {
  const vitamins = ['vitaminA', 'vitaminC', 'vitaminD', 'vitaminB12']
  const pcts = vitamins.map((v) => {
    const target = targets[v] ?? 1
    return Math.min(1, ((log as any)[v] ?? 0) / target)
  })
  return Math.round((pcts.reduce((a, b) => a + b, 0) / vitamins.length) * 100)
}

export function calcMineralsPct(log: Partial<DailyLog>, targets: Record<string, number>): number {
  const minerals = ['iron', 'calcium', 'magnesium', 'potassium']
  const pcts = minerals.map((m) => {
    const target = targets[m] ?? 1
    return Math.min(1, ((log as any)[m] ?? 0) / target)
  })
  return Math.round((pcts.reduce((a, b) => a + b, 0) / minerals.length) * 100)
}

// ─── Deficiency Detection ─────────────────────────────────────────────────────

export interface Deficiency {
  nutrient: string
  current: number
  target: number
  pct: number
  unit: string
  suggestions: string[]
}

export function detectDeficiencies(log: Partial<DailyLog>, blueprint: NutritionBlueprint): Deficiency[] {
  const checks = [
    { key: 'protein', target: blueprint.proteinTarget, unit: 'g', suggestions: ['Chicken breast', 'Greek yogurt', 'Lentils', 'Tofu', 'Eggs'] },
    { key: 'fiber', target: blueprint.fiberTarget, unit: 'g', suggestions: ['Broccoli', 'Oats', 'Lentils', 'Banana', 'Chia seeds'] },
    { key: 'water', target: blueprint.waterTarget, unit: 'ml', suggestions: ['2 glasses of water', 'Herbal tea', 'Cucumber water', 'Watermelon'] },
    { key: 'iron', target: blueprint.microTargets?.iron ?? 18, unit: 'mg', suggestions: ['Spinach', 'Lentils', 'Pumpkin seeds', 'Tofu', 'Oats'] },
    { key: 'vitaminC', target: blueprint.microTargets?.vitaminC ?? 75, unit: 'mg', suggestions: ['Kiwi', 'Bell pepper', 'Broccoli', 'Strawberries'] },
    { key: 'vitaminD', target: blueprint.microTargets?.vitaminD ?? 15, unit: 'mcg', suggestions: ['Salmon', 'Egg yolk', 'Fortified oat milk', 'Mushrooms'] },
    { key: 'magnesium', target: blueprint.microTargets?.magnesium ?? 320, unit: 'mg', suggestions: ['Spinach', 'Pumpkin seeds', 'Dark chocolate', 'Banana', 'Avocado'] },
    { key: 'calcium', target: blueprint.microTargets?.calcium ?? 1000, unit: 'mg', suggestions: ['Dairy milk', 'Tofu', 'Broccoli', 'Fortified plant milk', 'Almonds'] },
  ]

  return checks
    .map((c) => {
      const current = (log as any)[c.key] ?? 0
      const pct = Math.round((current / c.target) * 100)
      return { nutrient: c.key, current, target: c.target, pct, unit: c.unit, suggestions: c.suggestions }
    })
    .filter((d) => d.pct < 60)
    .sort((a, b) => a.pct - b.pct)
}
