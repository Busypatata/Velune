import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Velune database...')

  // Seed Titles
  const titles = [
    { name: 'Fresh Sprout', emoji: '🌱', tier: 'beginner', description: 'Just starting your journey', condition: { type: 'level', value: 1 } },
    { name: 'Tiny Taster', emoji: '🍽️', tier: 'beginner', description: 'Log your first 7 meals', condition: { type: 'meals_logged', value: 7 } },
    { name: 'Newbie Biter', emoji: '🥄', tier: 'beginner', description: 'Complete 3 days of logging', condition: { type: 'streak', streakType: 'logging', days: 3 } },
    { name: 'Green Guardian', emoji: '🌿', tier: 'intermediate', description: '30-day balanced diet streak', condition: { type: 'streak', streakType: 'balanced', days: 30 } },
    { name: 'Macro Keeper', emoji: '⚖️', tier: 'intermediate', description: 'Hit all macros for 14 days', condition: { type: 'streak', streakType: 'balanced', days: 14 } },
    { name: 'Iron Hunter', emoji: '🔩', tier: 'intermediate', description: 'Complete iron goals for 20 days', condition: { type: 'mineral_streak', mineral: 'iron', days: 20 } },
    { name: 'Protein Beast', emoji: '💪', tier: 'rare', description: '75-day protein streak', condition: { type: 'streak', streakType: 'protein', days: 75 } },
    { name: 'Vitamin Monarch', emoji: '👑', tier: 'rare', description: '60-day vitamin completion streak', condition: { type: 'streak', streakType: 'vitamins', days: 60 } },
    { name: 'Nutrient Phantom', emoji: '👻', tier: 'rare', description: 'Discover 20 collectibles', condition: { type: 'collectibles', value: 20 } },
    { name: 'Celestial Eater', emoji: '🌙', tier: 'legendary', description: 'Reach Level 81', condition: { type: 'level', value: 81 } },
    { name: 'Divine Alchemist', emoji: '⚗️', tier: 'legendary', description: '100-day balanced streak', condition: { type: 'streak', streakType: 'balanced', days: 100 } },
    { name: 'Nutrient Sovereign', emoji: '🌟', tier: 'legendary', description: 'Reach Level 100', condition: { type: 'level', value: 100 } },
    { name: 'Verdant Sage', emoji: '🌳', tier: 'intermediate', description: 'Reach Level 30', condition: { type: 'level', value: 30 } },
    { name: 'Hydration Monarch', emoji: '💧', tier: 'rare', description: '50-day hydration streak', condition: { type: 'streak', streakType: 'hydration', days: 50 } },
    { name: 'Recipe Weaver', emoji: '📖', tier: 'intermediate', description: 'Upload 10 recipes', condition: { type: 'recipes_uploaded', value: 10 } },
    { name: 'Battle Champion', emoji: '⚔️', tier: 'rare', description: 'Win 25 battles', condition: { type: 'battles_won', value: 25 } },
  ]

  for (const t of titles) {
    await prisma.title.upsert({
      where: { name: t.name },
      update: {},
      create: t,
    })
  }

  // Seed Collectibles
  const collectibles = [
    { name: 'Dragonfruit Panda', emoji: '🐼', description: 'A mystical panda born from the dragonfruit spirit', rarity: 'rare', triggerFood: 'dragonfruit', triggerType: 'food' },
    { name: 'Matcha Fox', emoji: '🦊', description: 'A serene fox infused with the essence of matcha', rarity: 'rare', triggerFood: 'matcha', triggerType: 'food' },
    { name: 'Kimchi Beast', emoji: '🥬', description: 'A fierce creature born from fermented kimchi energy', rarity: 'common', triggerFood: 'kimchi', triggerType: 'food' },
    { name: 'Mango Serpent', emoji: '🐉', description: 'A golden serpent that emerged from tropical mango groves', rarity: 'rare', triggerFood: 'mango', triggerType: 'food' },
    { name: 'Purple Sweet Potato Spirit', emoji: '🍠', description: 'An ancient spirit dwelling in purple sweet potatoes', rarity: 'epic', triggerFood: 'purple sweet potato', triggerType: 'food' },
    { name: 'Blueberry Ghost', emoji: '🫐', description: 'A playful ghost that smells like fresh blueberries', rarity: 'rare', triggerFood: 'blueberry', triggerType: 'food' },
    { name: 'Açaí Phoenix', emoji: '🔥', description: 'A phoenix reborn from the açaí bowl depths', rarity: 'epic', triggerFood: 'acai', triggerType: 'food' },
    { name: 'Tempeh Warrior', emoji: '⚔️', description: 'A brave warrior forged from fermented tempeh', rarity: 'rare', triggerFood: 'tempeh', triggerType: 'food' },
    { name: 'Avocado Sprite', emoji: '🥑', description: 'A tiny sprite living inside the perfect avocado', rarity: 'common', triggerFood: 'avocado', triggerType: 'food' },
    { name: 'Kiwi Goblin', emoji: '🥝', description: 'A mischievous goblin with spiky kiwi skin', rarity: 'common', triggerFood: 'kiwi', triggerType: 'food' },
    { name: 'Sakura Blossom', emoji: '🌸', description: 'A spirit that blooms with every vitamin streak', rarity: 'common', triggerType: 'streak', triggerValue: 30 },
    { name: 'Alphonso Guardian', emoji: '🥭', description: 'The guardian of the Alphonso mango realm', rarity: 'common', triggerFood: 'alphonso mango', triggerType: 'food' },
    { name: 'Celestial Lotus', emoji: '🪷', description: 'Unlocked only by the most dedicated souls — Level 50', rarity: 'legendary', triggerType: 'level', triggerValue: 50 },
    { name: 'Moonberry Wisp', emoji: '✨', description: 'A rare wisp that appears at 100-day streaks', rarity: 'legendary', triggerType: 'streak', triggerValue: 100 },
  ]

  for (const c of collectibles) {
    await prisma.collectible.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    })
  }

  // Seed demo user
  const passwordHash = await bcrypt.hash('velune123', 12)
  const demoUser = await prisma.user.upsert({
    where: { username: 'ara_so' },
    update: {},
    create: {
      email: 'ara@velune.app',
      username: 'ara_so',
      name: 'Ara Soo',
      passwordHash,
      level: 27,
      xpLifestyle: 8420,
      xpSocial: 1240,
      activeTitle: 'Green Guardian',
      blueprint: {
        create: {
          age: 24,
          weight: 58,
          height: 165,
          gender: 'female',
          activityLevel: 'moderate',
          goal: 'healthy_lifestyle',
          dietaryPref: 'vegetarian',
          allergies: [],
          cuisines: ['Indian', 'Japanese', 'Mediterranean'],
          calorieTarget: 2000,
          proteinTarget: 120,
          carbTarget: 200,
          fatTarget: 65,
          waterTarget: 2000,
          fiberTarget: 25,
          microTargets: {
            vitaminA: 900,
            vitaminC: 75,
            vitaminD: 15,
            vitaminB12: 2.4,
            iron: 18,
            calcium: 1000,
            magnesium: 320,
            potassium: 3500,
          },
        },
      },
      mascot: {
        create: {
          mascotType: 'fox',
          name: 'Lumie',
          mood: 'happy',
        },
      },
      streaks: {
        create: [
          { type: 'protein', currentDays: 47, longestDays: 47, isActive: true },
          { type: 'hydration', currentDays: 12, longestDays: 18, isActive: true },
          { type: 'breakfast', currentDays: 23, longestDays: 23, isActive: true },
          { type: 'balanced', currentDays: 8, longestDays: 31, isActive: true },
        ],
      },
      gardenElements: {
        create: [
          { type: 'rose', emoji: '🌹', posX: 10, posY: 20 },
          { type: 'tree', emoji: '🌳', posX: 25, posY: 40 },
          { type: 'butterfly', emoji: '🦋', posX: 50, posY: 15 },
          { type: 'flowers', emoji: '🌸', posX: 65, posY: 35 },
          { type: 'river', emoji: '🌊', posX: 80, posY: 20 },
          { type: 'leaf', emoji: '🌿', posX: 40, posY: 55 },
        ],
      },
    },
  })

  // Seed food items
  const foods = [
    // ── Eggs & Dairy ──────────────────────────────────────────────────────────
    { name: 'White Egg', emoji: '🥚', category: 'Eggs & Dairy', calories: 72, protein: 6.63, carbs: 0.5, fat: 5, fiber: 0, iron: 0.9, vitaminA: 75, vitaminD: 1, vitaminB12: 0.5, calcium: 28, potassium: 69 },
    { name: 'Brown Egg', emoji: '🥚', category: 'Eggs & Dairy', calories: 185, protein: 12.8, carbs: 1.5, fat: 13.8, fiber: 0, iron: 2.9, vitaminA: 215, vitaminD: 3.8, vitaminB12: 3.8, calcium: 64 },
    { name: 'Egg White', emoji: '🥚', category: 'Eggs & Dairy', calories: 52, protein: 10.9, carbs: 0.7, fat: 0.2, fiber: 0, vitaminB12: 0.09, calcium: 7, potassium: 163 },
    { name: 'Whole Milk', emoji: '🥛', category: 'Eggs & Dairy', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, calcium: 113, vitaminD: 1.0, vitaminB12: 0.45, potassium: 150 },
    { name: 'Greek Yogurt', emoji: '🥛', category: 'Eggs & Dairy', calories: 97, protein: 9, carbs: 3.6, fat: 5, fiber: 0, calcium: 110, vitaminB12: 0.75, potassium: 141 },
    { name: 'Cheddar Cheese', emoji: '🧀', category: 'Eggs & Dairy', calories: 403, protein: 25, carbs: 1.3, fat: 33, fiber: 0, calcium: 721, vitaminA: 265, vitaminB12: 0.83, sodium: 621 },
    { name: 'Paneer', emoji: '🧀', category: 'Eggs & Dairy', calories: 265, protein: 18, carbs: 3.5, fat: 20, fiber: 0, calcium: 480, vitaminA: 120 },
    { name: 'Cottage Cheese', emoji: '🧀', category: 'Eggs & Dairy', calories: 98, protein: 11.1, carbs: 3.4, fat: 4.3, fiber: 0, calcium: 83, vitaminB12: 0.43, sodium: 364 },
    { name: 'Butter', emoji: '🧈', category: 'Eggs & Dairy', calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, vitaminA: 684, vitaminD: 1.5 },
    { name: 'Oat Milk', emoji: '🥛', category: 'Plant Milk', calories: 52, protein: 1.2, carbs: 9, fat: 1.5, fiber: 0.8, calcium: 120, vitaminD: 1.0 },
    { name: 'Almond Milk', emoji: '🥛', category: 'Plant Milk', calories: 17, protein: 0.6, carbs: 1.4, fat: 1.1, fiber: 0.2, calcium: 184 },
    { name: 'Soy Milk', emoji: '🥛', category: 'Plant Milk', calories: 54, protein: 3.3, carbs: 6.3, fat: 1.8, fiber: 0.5, calcium: 123, vitaminD: 1.2, vitaminB12: 0.45, potassium: 287 },
    { name: 'Coconut Milk', emoji: '🥥', category: 'Plant Milk', calories: 230, protein: 2.3, carbs: 5.5, fat: 23.8, fiber: 2.2, iron: 3.3, magnesium: 37, potassium: 263 },

    // ── Meat & Poultry ────────────────────────────────────────────────────────
    { name: 'Chicken Breast', emoji: '🍗', category: 'Meat & Poultry', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, iron: 0.9, vitaminB12: 0.3, potassium: 256, zinc: 1 },
    { name: 'Chicken Thigh', emoji: '🍗', category: 'Meat & Poultry', calories: 209, protein: 26, carbs: 0, fat: 11, fiber: 0, iron: 1.3, vitaminB12: 0.33, potassium: 220, zinc: 2.4 },
    { name: 'Chicken Drumstick', emoji: '🍗', category: 'Meat & Poultry', calories: 172, protein: 28, carbs: 0, fat: 5.7, fiber: 0, iron: 1.3, vitaminB12: 0.33, potassium: 240 },
    { name: 'Turkey Breast', emoji: '🦃', category: 'Meat & Poultry', calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0, iron: 1.4, vitaminB12: 0.3, potassium: 305, zinc: 2 },
    { name: 'Beef Steak', emoji: '🥩', category: 'Beef', calories: 271, protein: 26, carbs: 0, fat: 18, fiber: 0, iron: 2.6, vitaminB12: 2.5, potassium: 318, zinc: 5.4 },
    { name: 'Ground Beef (lean)', emoji: '🥩', category: 'Beef', calories: 215, protein: 26.1, carbs: 0, fat: 11.8, fiber: 0, iron: 2.6, vitaminB12: 2.3, potassium: 332, zinc: 5.1 },
    { name: 'Beef Liver', emoji: '🫀', category: 'Beef', calories: 175, protein: 27, carbs: 4, fat: 5, fiber: 0, iron: 6.5, vitaminA: 4968, vitaminB12: 70, vitaminC: 1.3, zinc: 4, potassium: 313 },
    { name: 'Pork Chop', emoji: '🥩', category: 'Pork', calories: 231, protein: 25.7, carbs: 0, fat: 13.7, fiber: 0, iron: 0.9, vitaminB12: 0.6, potassium: 382, zinc: 2.4 },
    { name: 'Pork Belly', emoji: '🥩', category: 'Pork', calories: 518, protein: 9.3, carbs: 0, fat: 53, fiber: 0, vitaminB12: 0.4, potassium: 178 },
    { name: 'Bacon', emoji: '🥓', category: 'Pork', calories: 541, protein: 37, carbs: 1.4, fat: 42, fiber: 0, iron: 1.1, vitaminB12: 0.68, sodium: 1717, zinc: 3.3 },
    { name: 'Ham', emoji: '🍖', category: 'Pork', calories: 145, protein: 21, carbs: 1.5, fat: 5.5, fiber: 0, iron: 1.1, vitaminB12: 0.6, sodium: 1203, zinc: 2.5 },
    { name: 'Pork Ribs', emoji: '🍖', category: 'Pork', calories: 297, protein: 20, carbs: 0, fat: 24, fiber: 0, iron: 1.4, vitaminB12: 0.9, potassium: 290, zinc: 4.1 },
    { name: 'Lamb Chop', emoji: '🥩', category: 'Lamb', calories: 294, protein: 25, carbs: 0, fat: 21, fiber: 0, iron: 1.9, vitaminB12: 2.7, potassium: 310, zinc: 3.9 },
    { name: 'Ground Lamb', emoji: '🥩', category: 'Lamb', calories: 282, protein: 22, carbs: 0, fat: 21, fiber: 0, iron: 1.8, vitaminB12: 2.5, zinc: 3.7 },
    { name: 'Duck Breast', emoji: '🦆', category: 'Meat & Poultry', calories: 201, protein: 23, carbs: 0, fat: 11.2, fiber: 0, iron: 2.7, vitaminB12: 0.3, potassium: 271 },

    // ── Fish & Seafood ────────────────────────────────────────────────────────
    { name: 'Salmon', emoji: '🐟', category: 'Fish & Seafood', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, vitaminD: 14.4, vitaminB12: 3.2, potassium: 363, omega3: 2.3 },
    { name: 'Tuna (canned)', emoji: '🐟', category: 'Fish & Seafood', calories: 116, protein: 25.5, carbs: 0, fat: 1, fiber: 0, vitaminD: 1.7, vitaminB12: 2.5, potassium: 207, sodium: 325 },
    { name: 'Sardines', emoji: '🐟', category: 'Fish & Seafood', calories: 208, protein: 24.6, carbs: 0, fat: 11.5, fiber: 0, calcium: 382, vitaminD: 4.8, vitaminB12: 8.9, iron: 2.9 },
    { name: 'Mackerel', emoji: '🐟', category: 'Fish & Seafood', calories: 205, protein: 18.6, carbs: 0, fat: 13.9, fiber: 0, vitaminD: 16.1, vitaminB12: 19, potassium: 314 },
    { name: 'Cod', emoji: '🐟', category: 'Fish & Seafood', calories: 82, protein: 17.8, carbs: 0, fat: 0.7, fiber: 0, vitaminD: 0.9, vitaminB12: 0.9, potassium: 413 },
    { name: 'Tilapia', emoji: '🐟', category: 'Fish & Seafood', calories: 96, protein: 20.1, carbs: 0, fat: 1.7, fiber: 0, vitaminB12: 1.6, potassium: 302, magnesium: 27 },
    { name: 'Shrimp', emoji: '🦐', category: 'Fish & Seafood', calories: 85, protein: 20.1, carbs: 0.2, fat: 0.5, fiber: 0, vitaminB12: 1.2, iron: 0.5, calcium: 52, zinc: 1.3 },
    { name: 'Prawns', emoji: '🦐', category: 'shrimp', calories: 99, protein: 23.7, carbs: 0.2, fat: 0.3, fiber: 0, vitaminB12: 1.2, iron: 0.5, calcium: 52, zinc: 1.3 },
    { name: 'Crab', emoji: '🦀', category: 'Fish & Seafood', calories: 97, protein: 19, carbs: 0, fat: 1.5, fiber: 0, vitaminB12: 9, zinc: 3.6, calcium: 89 },
    { name: 'Squid', emoji: '🦑', category: 'Fish & Seafood', calories: 92, protein: 15.6, carbs: 3.1, fat: 1.4, fiber: 0, vitaminB12: 1.3, iron: 0.7, zinc: 1.5 },
    { name: 'Catfish', emoji: '🐟', category: 'Fish & Seafood', calories: 105, protein: 18.1, carbs: 0, fat: 2.8, fiber: 0, vitaminD: 11.9, vitaminB12: 2.1, potassium: 358 },

    // ── Fruits ────────────────────────────────────────────────────────────────
    { name: 'Watermelon', emoji: '🍉', category: 'Fruits', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, fiber: 0.4, vitaminC: 8.1, vitaminA: 28, potassium: 112 },
    { name: 'Mango', emoji: '🥭', category: 'Fruits', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, vitaminA: 54, vitaminC: 36, potassium: 168, isRare: true },
    { name: 'Banana', emoji: '🍌', category: 'Fruits', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, vitaminC: 8.7, potassium: 358, magnesium: 27 },
    { name: 'Avocado', emoji: '🥑', category: 'Fruits', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, vitaminK: 21, potassium: 485, magnesium: 29 },
    { name: 'Apple', emoji: '🍎', category: 'Fruits', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, vitaminC: 4.6, potassium: 107 },
    { name: 'Orange', emoji: '🍊', category: 'Fruits', calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1, fiber: 2.4, vitaminC: 53.2, vitaminA: 11, potassium: 181, calcium: 40 },
    { name: 'Grapes', emoji: '🍇', category: 'Fruits', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, vitaminC: 10.8, vitaminK: 14.6, potassium: 191 },
    { name: 'Strawberry', emoji: '🍓', category: 'Berries', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, vitaminC: 58.8, potassium: 153, iron: 0.4 },
    { name: 'Blueberry', emoji: '🫐', category: 'Berries', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, vitaminC: 9.7, vitaminK: 19, isRare: true },
    { name: 'Raspberry', emoji: '🍒', category: 'Berries', calories: 52, protein: 1.2, carbs: 11.9, fat: 0.7, fiber: 6.5, vitaminC: 26.2, vitaminK: 7.8, potassium: 151 },
    { name: 'Pineapple', emoji: '🍍', category: 'Fruits', calories: 50, protein: 0.5, carbs: 13.1, fat: 0.1, fiber: 1.4, vitaminC: 47.8, potassium: 109, magnesium: 12 },
    { name: 'Papaya', emoji: '🍈', category: 'Fruits', calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, vitaminC: 61.8, vitaminA: 47, potassium: 182 },
    { name: 'Peach', emoji: '🍑', category: 'Fruits', calories: 39, protein: 0.9, carbs: 9.5, fat: 0.3, fiber: 1.5, vitaminC: 6.6, vitaminA: 16, potassium: 190 },
    { name: 'Pear', emoji: '🍐', category: 'Fruits', calories: 57, protein: 0.4, carbs: 15.2, fat: 0.1, fiber: 3.1, vitaminC: 4.3, potassium: 116 },
    { name: 'Kiwi', emoji: '🥝', category: 'Fruits', calories: 61, protein: 1.1, carbs: 15, fat: 0.5, fiber: 3, vitaminC: 92.7, vitaminK: 40, potassium: 312 },
    { name: 'Plum', emoji: '🍑', category: 'Fruits', calories: 46, protein: 0.7, carbs: 11.4, fat: 0.3, fiber: 1.4, vitaminC: 9.5, vitaminA: 17, potassium: 157 },
    { name: 'Lychee', emoji: '🍈', category: 'Fruits', calories: 66, protein: 0.8, carbs: 16.5, fat: 0.4, fiber: 1.3, vitaminC: 71.5, potassium: 171 },
    { name: 'Guava', emoji: '🍐', category: 'Fruits', calories: 68, protein: 2.6, carbs: 14.3, fat: 1, fiber: 5.4, vitaminC: 228, vitaminA: 31, potassium: 417, magnesium: 22 },
    { name: 'Pomegranate', emoji: '🍎', category: 'Fruits', calories: 83, protein: 1.7, carbs: 18.7, fat: 1.2, fiber: 4, vitaminC: 10.2, potassium: 236, iron: 0.3 },
    { name: 'Jackfruit', emoji: '🍈', category: 'Fruits', calories: 95, protein: 1.7, carbs: 23.2, fat: 0.6, fiber: 1.5, vitaminC: 13.7, vitaminA: 5, potassium: 303 },
    { name: 'Coconut Flesh', emoji: '🥥', category: 'Fruits', calories: 354, protein: 3.3, carbs: 15.2, fat: 33.5, fiber: 9, iron: 2.4, magnesium: 32, potassium: 356 },
    { name: 'Dragonfruit', emoji: '🐉', category: 'Exotic Fruits', calories: 60, protein: 1.2, carbs: 13, fat: 0, fiber: 3, vitaminC: 20.5, iron: 0.65, magnesium: 18, isRare: true },
    { name: 'Açaí', emoji: '🍇', category: 'Exotic Fruits', calories: 70, protein: 1.5, carbs: 4, fat: 5, fiber: 2, vitaminA: 15, vitaminC: 9.6, calcium: 35, iron: 0.7, isRare: true },
    { name: 'Lemon', emoji: '🍋', category: 'Fruits', calories: 29, protein: 1.1, carbs: 9.3, fat: 0.3, fiber: 2.8, vitaminC: 53, potassium: 138 },
    { name: 'Lime', emoji: '🍋', category: 'Fruits', calories: 30, protein: 0.7, carbs: 10.5, fat: 0.2, fiber: 2.8, vitaminC: 29.1, potassium: 102 },
    { name: 'Cherries', emoji: '🍒', category: 'Fruits', calories: 63, protein: 1.1, carbs: 16, fat: 0.2, fiber: 2.1, vitaminC: 7, potassium: 222 },
    { name: 'Melon (Cantaloupe)', emoji: '🍈', category: 'Fruits', calories: 34, protein: 0.8, carbs: 8.2, fat: 0.2, fiber: 0.9, vitaminA: 169, vitaminC: 36.7, potassium: 267 },
    { name: 'Fig', emoji: '🫐', category: 'Fruits', calories: 74, protein: 0.8, carbs: 19.2, fat: 0.3, fiber: 2.9, potassium: 232, calcium: 35, magnesium: 17 },
    { name: 'Date', emoji: '🌴', category: 'Fruits', calories: 277, protein: 1.8, carbs: 74.9, fat: 0.2, fiber: 6.7, potassium: 696, magnesium: 54, iron: 0.9 },

    // ── Vegetables ────────────────────────────────────────────────────────────
    { name: 'Spinach', emoji: '🥬', category: 'Vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, iron: 2.7, vitaminA: 469, vitaminC: 28, vitaminK: 483, magnesium: 79, potassium: 558 },
    { name: 'Broccoli', emoji: '🥦', category: 'Vegetables', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, vitaminC: 89, vitaminK: 102, vitaminA: 31, calcium: 47, iron: 0.7 },
    { name: 'Sweet Potato', emoji: '🍠', category: 'Vegetables', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, vitaminA: 709, vitaminC: 2.4, potassium: 337 },
    { name: 'Purple Sweet Potato', emoji: '🍠', category: 'Vegetables', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, vitaminA: 709, vitaminC: 2.4, potassium: 337, isRare: true },
    { name: 'Carrot', emoji: '🥕', category: 'Vegetables', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, vitaminA: 835, vitaminC: 5.9, vitaminK: 13, potassium: 320 },
    { name: 'Tomato', emoji: '🍅', category: 'Vegetables', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, vitaminC: 13.7, vitaminA: 42, vitaminK: 7.9, potassium: 237 },
    { name: 'Cucumber', emoji: '🥒', category: 'Vegetables', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, vitaminC: 2.8, vitaminK: 16.4, potassium: 147 },
    { name: 'Bell Pepper', emoji: '🫑', category: 'Vegetables', calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, vitaminC: 127.7, vitaminA: 157, vitaminK: 4.9, potassium: 211 },
    { name: 'Onion', emoji: '🧅', category: 'Vegetables', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, vitaminC: 7.4, vitaminB12: 0, potassium: 146, calcium: 23 },
    { name: 'Garlic', emoji: '🧄', category: 'Vegetables', calories: 149, protein: 6.4, carbs: 33.1, fat: 0.5, fiber: 2.1, vitaminC: 31.2, vitaminB12: 0, calcium: 181, iron: 1.7 },
    { name: 'Cauliflower', emoji: '🥦', category: 'Vegetables', calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, vitaminC: 48.2, vitaminK: 15.5, potassium: 299 },
    { name: 'Kale', emoji: '🥬', category: 'Vegetables', calories: 49, protein: 4.3, carbs: 8.8, fat: 0.9, fiber: 3.6, vitaminA: 500, vitaminC: 120, vitaminK: 817, calcium: 150, iron: 1.5, magnesium: 47 },
    { name: 'Cabbage', emoji: '🥬', category: 'Vegetables', calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1, fiber: 2.5, vitaminC: 36.6, vitaminK: 76, potassium: 170 },
    { name: 'Zucchini', emoji: '🥒', category: 'Vegetables', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, vitaminC: 17.9, vitaminA: 10, potassium: 261 },
    { name: 'Eggplant', emoji: '🍆', category: 'Vegetables', calories: 25, protein: 1, carbs: 5.9, fat: 0.2, fiber: 3, vitaminC: 2.2, potassium: 229 },
    { name: 'Mushroom', emoji: '🍄', category: 'Vegetables', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, vitaminD: 0.2, vitaminB12: 0, iron: 0.5, potassium: 318 },
    { name: 'Peas', emoji: '🟢', category: 'Vegetables', calories: 81, protein: 5.4, carbs: 14.5, fat: 0.4, fiber: 5.1, vitaminC: 40, vitaminA: 38, vitaminK: 24.8, iron: 1.5, magnesium: 33 },
    { name: 'Corn', emoji: '🌽', category: 'Vegetables', calories: 86, protein: 3.2, carbs: 19, fat: 1.2, fiber: 2.7, vitaminC: 6.8, vitaminA: 10, potassium: 270, magnesium: 37 },
    { name: 'Beetroot', emoji: '🫀', category: 'Vegetables', calories: 43, protein: 1.6, carbs: 9.6, fat: 0.2, fiber: 2.8, vitaminC: 4.9, potassium: 325, iron: 0.8, magnesium: 23 },
    { name: 'Asparagus', emoji: '🌿', category: 'Vegetables', calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, fiber: 2.1, vitaminC: 5.6, vitaminK: 41.6, vitaminA: 38, iron: 2.1, potassium: 202 },
    { name: 'Celery', emoji: '🥬', category: 'Vegetables', calories: 16, protein: 0.7, carbs: 3, fat: 0.2, fiber: 1.6, vitaminC: 3.1, vitaminK: 29.3, potassium: 260 },
    { name: 'Leek', emoji: '🥬', category: 'Vegetables', calories: 61, protein: 1.5, carbs: 14.2, fat: 0.3, fiber: 1.8, vitaminC: 12, vitaminK: 47, vitaminA: 83, iron: 2.1, potassium: 180 },
    { name: 'Pumpkin', emoji: '🎃', category: 'Vegetables', calories: 26, protein: 1, carbs: 6.5, fat: 0.1, fiber: 0.5, vitaminA: 426, vitaminC: 9, potassium: 340 },
    { name: 'Okra', emoji: '🌿', category: 'Vegetables', calories: 33, protein: 1.9, carbs: 7.5, fat: 0.2, fiber: 3.2, vitaminC: 23, vitaminK: 31.3, calcium: 82, magnesium: 57, iron: 0.6 },
    { name: 'Bitter Gourd', emoji: '🥒', category: 'Vegetables', calories: 17, protein: 1, carbs: 3.7, fat: 0.2, fiber: 2.8, vitaminC: 84, vitaminA: 24, iron: 0.4, potassium: 296 },
    { name: 'Radish', emoji: '🌸', category: 'Vegetables', calories: 16, protein: 0.7, carbs: 3.4, fat: 0.1, fiber: 1.6, vitaminC: 14.8, potassium: 233 },
    { name: 'Cabbage (Red)', emoji: '🥬', category: 'Vegetables', calories: 31, protein: 1.4, carbs: 7.4, fat: 0.2, fiber: 2.1, vitaminC: 57, vitaminK: 38.2, potassium: 243 },

    // ── Grains & Breads ───────────────────────────────────────────────────────
    { name: 'Brown Rice', emoji: '🍚', category: 'Grains', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, magnesium: 43, potassium: 79 },
    { name: 'Jasmine Rice', emoji: '🌾', category: 'Grains', calories: 130, protein: 2.4, carbs: 28, fat: 0.3, fiber: 0.4 },
    { name: 'White Rice', emoji: '🍚', category: 'Grains', calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, fiber: 0.4, iron: 0.2, magnesium: 12, potassium: 35 },
    { name: 'Quinoa', emoji: '🌾', category: 'Grains', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, iron: 1.5, magnesium: 64, potassium: 172, zinc: 1.1 },
    { name: 'Oats', emoji: '🌾', category: 'Grains', calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 10.6, iron: 4.7, magnesium: 177, zinc: 4 },
    { name: 'Whole Wheat Bread', emoji: '🍞', category: 'Breads', calories: 247, protein: 13, carbs: 41, fat: 4.2, fiber: 7, iron: 4.6, calcium: 75, magnesium: 87 },
    { name: 'White Bread', emoji: '🍞', category: 'Breads', calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, iron: 3.6, calcium: 182, potassium: 100 },
    { name: 'Pasta', emoji: '🍝', category: 'Grains', calories: 157, protein: 5.8, carbs: 30.9, fat: 0.9, fiber: 1.8, iron: 1.3, magnesium: 25, potassium: 44 },
    { name: 'Couscous', emoji: '🌾', category: 'Grains', calories: 112, protein: 3.8, carbs: 23.2, fat: 0.2, fiber: 1.4, iron: 0.4, magnesium: 8, potassium: 58 },
    { name: 'Barley', emoji: '🌾', category: 'Grains', calories: 123, protein: 2.3, carbs: 28.2, fat: 0.4, fiber: 3.8, iron: 1.3, magnesium: 22, potassium: 93 },
    { name: 'Roti (Chapati)', emoji: '🫓', category: 'Breads', calories: 297, protein: 9.2, carbs: 53.4, fat: 5.3, fiber: 4.1, iron: 3.9, calcium: 39, magnesium: 37 },
    { name: 'Naan', emoji: '🫓', category: 'Breads', calories: 310, protein: 9.4, carbs: 50, fat: 8.4, fiber: 1.7, calcium: 72, iron: 2.9 },

    // ── Legumes ───────────────────────────────────────────────────────────────
    { name: 'Lentils', emoji: '🫘', category: 'Legumes', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, iron: 3.3, magnesium: 36, potassium: 369, zinc: 1.3 },
    { name: 'Chickpeas', emoji: '🫘', category: 'Legumes', calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6, iron: 2.9, magnesium: 48, potassium: 291, zinc: 1.5 },
    { name: 'Black Beans', emoji: '🫘', category: 'Legumes', calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5, fiber: 8.7, iron: 2.1, magnesium: 60, potassium: 355, calcium: 27 },
    { name: 'Kidney Beans', emoji: '🫘', category: 'Legumes', calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5, fiber: 6.4, iron: 2.9, magnesium: 45, potassium: 403, calcium: 50 },
    { name: 'Green Beans', emoji: '🫘', category: 'Legumes', calories: 31, protein: 1.8, carbs: 7, fat: 0.2, fiber: 2.7, vitaminC: 12.2, vitaminK: 14.4, vitaminA: 35, potassium: 211 },
    { name: 'Edamame', emoji: '🫘', category: 'Legumes', calories: 121, protein: 11.9, carbs: 8.9, fat: 5.2, fiber: 5.2, iron: 2.3, calcium: 63, vitaminC: 6.1, potassium: 436 },
    { name: 'Mung Beans', emoji: '🫘', category: 'Legumes', calories: 105, protein: 7.1, carbs: 19.2, fat: 0.4, fiber: 7.6, iron: 1.8, magnesium: 48, potassium: 369 },

    // ── Soy Products ──────────────────────────────────────────────────────────
    { name: 'Tofu', emoji: '🧊', category: 'Soy Products', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, calcium: 350, iron: 1.6, magnesium: 30 },
    { name: 'Tempeh', emoji: '🫘', category: 'Fermented', calories: 193, protein: 19, carbs: 9, fat: 11, fiber: 0, iron: 2.7, calcium: 111, magnesium: 81, isRare: true },
    { name: 'Soy Protein Powder', emoji: '💪', category: 'Soy Products', calories: 338, protein: 80, carbs: 3, fat: 3.4, fiber: 2, iron: 9.4, calcium: 175, zinc: 4.5 },
    { name: 'Edamame', emoji: '🫘', category: 'Soy Products', calories: 121, protein: 11.9, carbs: 8.9, fat: 5.2, fiber: 5.2, iron: 2.3, calcium: 63, vitaminC: 6.1 },
    { name: 'Miso', emoji: '🍜', category: 'Fermented', calories: 199, protein: 11.7, carbs: 26.5, fat: 6, fiber: 5.4, iron: 2.5, sodium: 3728, calcium: 57, zinc: 2.6 },

    // ── Nuts & Seeds ──────────────────────────────────────────────────────────
    { name: 'Pumpkin Seeds', emoji: '🌰', category: 'Seeds & Nuts', calories: 559, protein: 30, carbs: 11, fat: 49, fiber: 6, magnesium: 592, zinc: 7.6, iron: 8.8, potassium: 809 },
    { name: 'Almonds', emoji: '🌰', category: 'Seeds & Nuts', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5, vitaminE: 25.6, magnesium: 270, calcium: 264, iron: 3.7 },
    { name: 'Walnuts', emoji: '🌰', category: 'Seeds & Nuts', calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2, fiber: 6.7, magnesium: 158, potassium: 441, iron: 2.9 },
    { name: 'Cashews', emoji: '🌰', category: 'Seeds & Nuts', calories: 553, protein: 18.2, carbs: 30.2, fat: 43.8, fiber: 3.3, magnesium: 292, zinc: 5.8, iron: 6.7 },
    { name: 'Peanuts', emoji: '🥜', category: 'Seeds & Nuts', calories: 567, protein: 25.8, carbs: 16.1, fat: 49.2, fiber: 8.5, magnesium: 168, zinc: 3.3, iron: 4.6, potassium: 705 },
    { name: 'Peanut Butter', emoji: '🥜', category: 'Seeds & Nuts', calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, magnesium: 168, potassium: 558, zinc: 2.9, iron: 1.9 },
    { name: 'Chia Seeds', emoji: '🌱', category: 'Seeds & Nuts', calories: 486, protein: 16.5, carbs: 42.1, fat: 30.7, fiber: 34.4, calcium: 631, iron: 7.7, magnesium: 335, potassium: 407 },
    { name: 'Flaxseeds', emoji: '🌱', category: 'Seeds & Nuts', calories: 534, protein: 18.3, carbs: 28.9, fat: 42.2, fiber: 27.3, calcium: 255, iron: 5.7, magnesium: 392, potassium: 813 },
    { name: 'Sunflower Seeds', emoji: '🌻', category: 'Seeds & Nuts', calories: 584, protein: 20.8, carbs: 20, fat: 51.5, fiber: 8.6, vitaminE: 35.2, magnesium: 325, zinc: 5, iron: 5.3 },
    { name: 'Sesame Seeds', emoji: '🌱', category: 'Seeds & Nuts', calories: 573, protein: 17.7, carbs: 23.5, fat: 49.7, fiber: 11.8, calcium: 975, iron: 14.6, magnesium: 351, zinc: 7.8 },
    { name: 'Pistachio', emoji: '🌰', category: 'Seeds & Nuts', calories: 562, protein: 20.2, carbs: 27.5, fat: 45.3, fiber: 10.3, potassium: 1025, iron: 3.9, magnesium: 121, zinc: 2.2 },

    // ── Supplements & Proteins ────────────────────────────────────────────────
    { name: 'Whey Protein', emoji: '💪', category: 'Powders & Supplements', calories: 400, protein: 80, carbs: 8, fat: 5, fiber: 0, calcium: 600, iron: 1, vitaminD: 2 },
    { name: 'Casein Protein', emoji: '💪', category: 'Powders & Supplements', calories: 370, protein: 82, carbs: 4, fat: 2, fiber: 0, calcium: 800, vitaminD: 1.5 },
    { name: 'Matcha Powder', emoji: '🍵', category: 'Powders & Supplements', calories: 3, protein: 0.2, carbs: 0.4, fat: 0, fiber: 0, vitaminA: 27, vitaminC: 0.5, iron: 0.17, isRare: true },

    // ── Water & Beverages ─────────────────────────────────────────────────────
    { name: 'Water', emoji: '💧', category: 'Beverages', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, water: 100 },
    { name: 'Green Tea', emoji: '🍵', category: 'Beverages', calories: 1, protein: 0.2, carbs: 0.2, fat: 0, fiber: 0, vitaminC: 0.3 },
    { name: 'Black Coffee', emoji: '☕', category: 'Beverages', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, potassium: 49 },
    { name: 'Orange Juice', emoji: '🍊', category: 'Beverages', calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2, fiber: 0.2, vitaminC: 50, potassium: 200 },
    { name: 'Coconut Water', emoji: '🥥', category: 'Beverages', calories: 19, protein: 0.7, carbs: 3.7, fat: 0.2, fiber: 1.1, potassium: 250, magnesium: 25, vitaminC: 2.4 },

    // ── Fermented & Condiments ────────────────────────────────────────────────
    { name: 'Kimchi', emoji: '🥬', category: 'Fermented', calories: 15, protein: 1.1, carbs: 2.4, fat: 0.5, fiber: 1.6, vitaminC: 10, vitaminK: 43, iron: 0.35, isRare: true },
    { name: 'Olive Oil', emoji: '🫒', category: 'Oils & Fats', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, vitaminE: 14.4, vitaminK: 60.2 },
    { name: 'Ghee', emoji: '🧈', category: 'Oils & Fats', calories: 900, protein: 0, carbs: 0, fat: 99.8, fiber: 0, vitaminA: 840, vitaminD: 1.5 },
    { name: 'Honey', emoji: '🍯', category: 'Sweeteners', calories: 304, protein: 0.3, carbs: 82.4, fat: 0, fiber: 0.2, potassium: 52, iron: 0.4 },
  ]

  for (const f of foods) {
    const fo = f as any
    await prisma.foodItem.upsert({
      where: { usdaFdcId: `seed-${f.name.toLowerCase().replace(/\s/g, '-')}` },
      update: {},
      create: {
        name:       f.name,
        emoji:      fo.emoji      ?? null,
        category:   fo.category   ?? null,
        usdaFdcId:  `seed-${f.name.toLowerCase().replace(/\s/g, '-')}`,
        calories:   f.calories,
        protein:    f.protein,
        carbs:      f.carbs,
        fat:        f.fat,
        fiber:      f.fiber,
        sugar:      fo.sugar      ?? 0,
        sodium:     fo.sodium     ?? 0,
        calcium:    fo.calcium    ?? 0,
        iron:       fo.iron       ?? 0,
        vitaminA:   fo.vitaminA   ?? 0,
        vitaminC:   fo.vitaminC   ?? 0,
        vitaminD:   fo.vitaminD   ?? 0,
        vitaminB12: fo.vitaminB12 ?? 0,
        vitaminK:   fo.vitaminK   ?? 0,
        magnesium:  fo.magnesium  ?? 0,
        potassium:  fo.potassium  ?? 0,
        zinc:       fo.zinc       ?? 0,
        isRare:     fo.isRare     ?? false,
      },
    })
  }

  console.log('✅ Seed complete!')
  console.log(`   Demo user: ara@velune.app / velune123`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
