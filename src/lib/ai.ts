import OpenAI from 'openai'
import type { Deficiency, NutritionBlueprint } from '@/types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function getSmartRecommendations(
  deficiencies: Deficiency[],
  blueprint: NutritionBlueprint
): Promise<{ foods: string[]; message: string }> {
  if (!process.env.OPENAI_API_KEY) {
    // Fallback without API key
    return getFallbackRecommendations(deficiencies, blueprint)
  }

  try {
    const prompt = `You are a friendly nutrition companion for an app called Velune.
The user's diet preference is: ${blueprint.dietaryPref}
Allergies: ${blueprint.allergies.join(', ') || 'none'}
Favorite cuisines: ${blueprint.cuisines.join(', ') || 'any'}
Goal: ${blueprint.goal}

Their current deficiencies:
${deficiencies.map((d) => `- ${d.nutrient}: ${d.pct}% complete (${d.current}/${d.target} ${d.unit})`).join('\n')}

Suggest 5-6 specific foods or snacks they could eat NOW to fix these gaps.
Keep suggestions aligned with their diet preference and avoid allergens.
Format: JSON { "foods": ["food1", "food2", ...], "message": "friendly 1-sentence tip" }
Only respond with valid JSON.`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    })

    const text = response.choices[0]?.message?.content || '{}'
    return JSON.parse(text)
  } catch {
    return getFallbackRecommendations(deficiencies, blueprint)
  }
}

function getFallbackRecommendations(
  deficiencies: Deficiency[],
  blueprint: NutritionBlueprint
): { foods: string[]; message: string } {
  const allSuggestions = deficiencies.flatMap((d) => d.suggestions)
  const unique = [...new Set(allSuggestions)].slice(0, 6)
  const isVegan = blueprint.dietaryPref === 'vegan'

  const filtered = isVegan
    ? unique.filter((f) => !['Chicken breast', 'Salmon', 'Greek yogurt', 'Egg yolk'].includes(f))
    : unique

  return {
    foods: filtered.slice(0, 5),
    message: `You're low on ${deficiencies[0]?.nutrient ?? 'some nutrients'} — try adding these to your next meal!`,
  }
}
