import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { searchUSDAFoods, extractNutrients } from '@/lib/usda'
import { cacheGet, cacheSet, CACHE_KEYS } from '@/lib/redis'

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q') ?? ''
  if (!q.trim()) return NextResponse.json({ foods: [] })

  // Check cache
  const cached = await cacheGet(CACHE_KEYS.foodSearch(q))
  if (cached) return NextResponse.json({ foods: cached })

  // Search local DB first
  const localFoods = await prisma.foodItem.findMany({
    where: { name: { contains: q, mode: 'insensitive' } },
    take: 8,
    orderBy: { name: 'asc' },
  })

  let foods = localFoods.map((f) => ({
    id: f.id,
    name: f.name,
    emoji: f.emoji,
    calories: f.calories,
    protein: f.protein,
    carbs: f.carbs,
    fat: f.fat,
    fiber: f.fiber,
    isRare: f.isRare,
    source: 'local',
  }))

  // If not enough local results, fetch from USDA
  if (foods.length < 5) {
    try {
      const usdaResults = await searchUSDAFoods(q, 8)
      for (const usdaFood of usdaResults.slice(0, 5)) {
        // Check if already in DB
        const existing = await prisma.foodItem.findUnique({
          where: { usdaFdcId: String(usdaFood.fdcId) },
        })

        if (existing) {
          if (!foods.find((f) => f.id === existing.id)) {
            foods.push({ id: existing.id, name: existing.name, emoji: existing.emoji, calories: existing.calories, protein: existing.protein, carbs: existing.carbs, fat: existing.fat, fiber: existing.fiber, isRare: existing.isRare, source: 'local' })
          }
          continue
        }

        // Save to DB for future use
        const nutrients = extractNutrients(usdaFood)
        const saved = await prisma.foodItem.create({
          data: {
            name: usdaFood.description,
            usdaFdcId: String(usdaFood.fdcId),
            category: usdaFood.dataType,
            calories:   nutrients.calories  ?? 0,
            protein:    nutrients.protein   ?? 0,
            carbs:      nutrients.carbs     ?? 0,
            fat:        nutrients.fat       ?? 0,
            fiber:      nutrients.fiber     ?? 0,
            sugar:      nutrients.sugar     ?? 0,
            sodium:     nutrients.sodium    ?? 0,
            calcium:    nutrients.calcium   ?? 0,
            iron:       nutrients.iron      ?? 0,
            vitaminA:   nutrients.vitaminA  ?? 0,
            vitaminC:   nutrients.vitaminC  ?? 0,
            vitaminD:   nutrients.vitaminD  ?? 0,
            vitaminB12: nutrients.vitaminB12 ?? 0,
            vitaminK:   nutrients.vitaminK  ?? 0,
            magnesium:  nutrients.magnesium ?? 0,
            potassium:  nutrients.potassium ?? 0,
            zinc:       nutrients.zinc      ?? 0,
          },
        })

        foods.push({
          id: saved.id, name: saved.name, emoji: saved.emoji,
          calories: saved.calories, protein: saved.protein,
          carbs: saved.carbs, fat: saved.fat, fiber: saved.fiber,
          isRare: saved.isRare, source: 'usda',
        })
      }
    } catch (err) {
      console.error('[food-search] USDA error:', err)
    }
  }

  await cacheSet(CACHE_KEYS.foodSearch(q), foods, 300)
  return NextResponse.json({ foods })
}
