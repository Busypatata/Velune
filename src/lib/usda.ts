const USDA_BASE = 'https://api.nal.usda.gov/fdc/v1'
const API_KEY = process.env.USDA_API_KEY || ''

export interface USDAFood {
  fdcId: number
  description: string
  dataType: string
  brandOwner?: string
  foodNutrients: USDANutrient[]
}

export interface USDANutrient {
  nutrientId: number
  nutrientName: string
  value: number
  unitName: string
}

// USDA nutrient ID mapping
const NUTRIENT_MAP: Record<string, number> = {
  calories:   1008,
  protein:    1003,
  fat:        1004,
  carbs:      1005,
  fiber:      1079,
  sugar:      2000,
  sodium:     1093,
  calcium:    1087,
  iron:       1089,
  vitaminA:   1106,
  vitaminC:   1162,
  vitaminD:   1114,
  vitaminB12: 1178,
  vitaminK:   1185,
  magnesium:  1090,
  potassium:  1092,
  zinc:       1095,
}

export async function searchUSDAFoods(query: string, pageSize = 10): Promise<USDAFood[]> {
  const res = await fetch(
    `${USDA_BASE}/foods/search?query=${encodeURIComponent(query)}&pageSize=${pageSize}&api_key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.foods || []
}

export async function getUSDAFood(fdcId: string): Promise<USDAFood | null> {
  const res = await fetch(
    `${USDA_BASE}/food/${fdcId}?api_key=${API_KEY}`,
    { next: { revalidate: 86400 } }
  )
  if (!res.ok) return null
  return res.json()
}

export function extractNutrients(food: USDAFood): Record<string, number> {
  const result: Record<string, number> = {}
  for (const [key, nutrientId] of Object.entries(NUTRIENT_MAP)) {
    const nutrient = food.foodNutrients.find((n) => n.nutrientId === nutrientId)
    result[key] = nutrient?.value ?? 0
  }
  return result
}

export function normalizeToPerGram(nutrients: Record<string, number>, gramsPer100g = 100) {
  const factor = 100 / gramsPer100g
  return Object.fromEntries(Object.entries(nutrients).map(([k, v]) => [k, v * factor]))
}
