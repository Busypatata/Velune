// ─── User & Auth ─────────────────────────────────────────────────────────────

export interface VeluneUser {
  id: string
  email: string
  username: string
  name: string | null
  image: string | null
  bio: string | null
  level: number
  xpLifestyle: number
  xpSocial: number
  activeTitle: string | null
  blueprint: NutritionBlueprint | null
  mascot: UserMascot | null
  streaks: Streak[]
  titles: UserTitle[]
  collectibles: UserCollectible[]
  gardenElements: GardenElement[]
  createdAt: Date
}

export interface NutritionBlueprint {
  id: string
  age: number
  weight: number
  height: number
  gender: string
  activityLevel: string
  goal: string
  dietaryPref: string
  allergies: string[]
  cuisines: string[]
  calorieTarget: number
  proteinTarget: number
  carbTarget: number
  fatTarget: number
  waterTarget: number
  fiberTarget: number
  microTargets: Record<string, number>
}

// ─── Gamification ─────────────────────────────────────────────────────────────

export interface Streak {
  id: string
  type: StreakType
  currentDays: number
  longestDays: number
  lastLogDate: string | null
  isActive: boolean
}

export type StreakType = 'protein' | 'hydration' | 'vitamins' | 'breakfast' | 'balanced' | 'logging'

export interface UserTitle {
  id: string
  titleId: string
  title: Title
  unlockedAt: Date
  isEquipped: boolean
}

export interface Title {
  id: string
  name: string
  emoji: string
  tier: TitleTier
  description: string
  condition: TitleCondition
}

export type TitleTier = 'beginner' | 'intermediate' | 'rare' | 'legendary'

export interface TitleCondition {
  type: string
  streakType?: string
  days?: number
  value?: number
  mineral?: string
}

export interface UserCollectible {
  id: string
  collectibleId: string
  collectible: Collectible
  discoveredAt: Date
  isDisplayed: boolean
}

export interface Collectible {
  id: string
  name: string
  emoji: string
  description: string
  rarity: CollectibleRarity
  triggerFood: string | null
  triggerType: string | null
  triggerValue: number | null
}

export type CollectibleRarity = 'common' | 'rare' | 'epic' | 'legendary'

// ─── Garden ───────────────────────────────────────────────────────────────────

export interface GardenElement {
  id: string
  type: string
  emoji: string
  posX: number
  posY: number
  isVisible: boolean
  unlockedAt: Date
}

export interface UserMascot {
  id: string
  mascotType: MascotType
  name: string
  mood: MascotMood
  skinId: string | null
}

export type MascotType = 'fox' | 'bunny' | 'dragon' | 'blob' | 'cat'
export type MascotMood = 'happy' | 'thirsty' | 'sad' | 'excited' | 'tired'

export const MASCOT_EMOJIS: Record<MascotType, string> = {
  fox: '🦊',
  bunny: '🐰',
  dragon: '🐲',
  blob: '🫧',
  cat: '🐱',
}

export const MASCOT_MOODS: Record<MascotMood, { emoji: string; message: string; speech: string }> = {
  happy:    { emoji: '🦊', message: 'Feeling great today! ✨', speech: "You're crushing it! Keep that streak going 🔥" },
  thirsty:  { emoji: '😴', message: 'Feeling a little thirsty...', speech: "Drink some water! I believe in you 💙" },
  sad:      { emoji: '😢', message: 'A meal was missed...', speech: "Hey, it's okay. Log something small! 🍎" },
  excited:  { emoji: '🎉', message: 'LEVEL UP! So proud of you!', speech: "You just gained XP! The garden grows! 🌱" },
  tired:    { emoji: '😪', message: 'Nutrients are running low...', speech: "Time to eat something nutritious! 🥗" },
}

// ─── Food & Nutrition ─────────────────────────────────────────────────────────

export interface FoodItem {
  id: string
  name: string
  emoji: string | null
  category: string | null
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
  calcium: number
  iron: number
  vitaminA: number
  vitaminC: number
  vitaminD: number
  vitaminB12: number
  vitaminK: number
  magnesium: number
  potassium: number
  zinc: number
  isRare: boolean
  collectibleId: string | null
}

export interface MealFood {
  id: string
  food: FoodItem
  quantity: number
  unit: FoodUnit
}

export type FoodUnit = 'g' | 'ml' | 'tsp' | 'tbsp' | 'cup' | 'piece' | 'slice'

export interface Meal {
  id: string
  name: string | null
  mealType: MealType
  loggedAt: Date
  date: string
  emoji: string | null
  foods: MealFood[]
  isTemplate: boolean
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface DailyLog {
  id: string
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  water: number
  vitaminA: number
  vitaminC: number
  vitaminD: number
  vitaminB12: number
  iron: number
  magnesium: number
  calcium: number
  potassium: number
  caloriesPct: number
  proteinPct: number
  vitaminsPct: number
  hydrationPct: number
  mineralsPct: number
  fiberPct: number
  xpEarned: number
}

export interface NutrientRing {
  key: string
  label: string
  pct: number
  color: string
  current: number
  target: number
  unit: string
}

// ─── Social ───────────────────────────────────────────────────────────────────

export interface Post {
  id: string
  userId: string
  user: PublicUser
  content: string
  postType: PostType
  imageUrl: string | null
  recipe: Recipe | null
  metadata: Record<string, unknown> | null
  likeCount: number
  commentCount: number
  isLiked?: boolean
  createdAt: Date
}

export type PostType = 'general' | 'achievement' | 'recipe' | 'transformation' | 'collectible'

export interface Comment {
  id: string
  userId: string
  user: PublicUser
  content: string
  createdAt: Date
}

export interface PublicUser {
  id: string
  username: string
  name: string | null
  image: string | null
  level: number
  activeTitle: string | null
}

export interface FriendRequest {
  id: string
  sender: PublicUser
  receiver: PublicUser
  status: 'pending' | 'accepted' | 'ghosted'
  createdAt: Date
}

export interface NutritionMatch {
  user: PublicUser
  score: number
}

// ─── Recipes ──────────────────────────────────────────────────────────────────

export interface Recipe {
  id: string
  userId: string
  user: PublicUser
  title: string
  description: string | null
  imageUrl: string | null
  emoji: string
  prepTime: number | null
  cookTime: number | null
  servings: number
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  tags: string[]
  isVegan: boolean
  isVegetarian: boolean
  isHighProtein: boolean
  isLowCalorie: boolean
  isIronRich: boolean
  isVitaminRich: boolean
  isQuick: boolean
  isBudget: boolean
  likeCount: number
  isLiked?: boolean
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  createdAt: Date
}

export interface RecipeIngredient {
  id: string
  foodName: string
  quantity: number
  unit: string
  order: number
}

export interface RecipeStep {
  id: string
  stepNumber: number
  content: string
  duration: number | null
}

// ─── Battles ─────────────────────────────────────────────────────────────────

export interface Battle {
  id: string
  userA: PublicUser
  userB: PublicUser
  battleType: BattleType
  status: BattleStatus
  startDate: Date
  endDate: Date
  scoreA: number
  scoreB: number
  winnerId: string | null
  createdAt: Date
}

export type BattleType = 'protein' | 'hydration' | 'consistency' | 'balanced' | 'calories'
export type BattleStatus = 'pending' | 'active' | 'completed'

// ─── Notifications ───────────────────────────────────────────────────────────

export interface Notification {
  id: string
  type: NotificationType
  category: 'personal' | 'social'
  title: string
  message: string
  metadata: Record<string, unknown> | null
  isRead: boolean
  createdAt: Date
}

export type NotificationType =
  | 'deficiency'
  | 'streak_warning'
  | 'xp_gain'
  | 'garden_unlock'
  | 'friend_request'
  | 'battle_invite'
  | 'like'
  | 'comment'
  | 'level_up'
  | 'collectible'

// ─── XP System ───────────────────────────────────────────────────────────────

export const XP_THRESHOLDS: number[] = (() => {
  const thresholds: number[] = [0]
  // Levels 1-20: fast (200 XP each)
  for (let i = 1; i <= 20; i++) thresholds.push(thresholds[i - 1] + 200)
  // Levels 21-50: medium (400 XP each)
  for (let i = 21; i <= 50; i++) thresholds.push(thresholds[i - 1] + 400)
  // Levels 51-80: hard (800 XP each)
  for (let i = 51; i <= 80; i++) thresholds.push(thresholds[i - 1] + 800)
  // Levels 81-100: extreme (1500 XP each)
  for (let i = 81; i <= 100; i++) thresholds.push(thresholds[i - 1] + 1500)
  return thresholds
})()

export function getLevelFromXP(xp: number): { level: number; currentXP: number; nextXP: number; pct: number } {
  let level = 1
  for (let i = 1; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) level = i + 1
    else break
  }
  level = Math.min(level, 100)
  const currentXP = xp - XP_THRESHOLDS[level - 1]
  const nextXP = level < 100 ? XP_THRESHOLDS[level] - XP_THRESHOLDS[level - 1] : 1
  return { level, currentXP, nextXP, pct: Math.round((currentXP / nextXP) * 100) }
}

export const XP_REWARDS = {
  // Lifestyle XP
  DAILY_LOG_MEAL: 10,
  COMPLETE_CALORIES: 30,
  COMPLETE_PROTEIN: 25,
  COMPLETE_VITAMINS: 20,
  COMPLETE_HYDRATION: 20,
  COMPLETE_MINERALS: 15,
  COMPLETE_FIBER: 15,
  COMPLETE_ALL_NUTRIENTS: 50,
  STREAK_BONUS_7: 50,
  STREAK_BONUS_30: 200,
  STREAK_BONUS_100: 1000,
  // Social XP
  UPLOAD_RECIPE: 30,
  RECIPE_LIKED: 5,
  POST_CREATED: 10,
  COMMENT_GIVEN: 5,
  BATTLE_WIN: 100,
  BATTLE_PARTICIPATE: 20,
  GROUP_ACTIVITY: 10,
} as const

// ─── Garden ───────────────────────────────────────────────────────────────────

export const GARDEN_UNLOCK_CONDITIONS: Array<{
  type: string
  emoji: string
  condition: string
  description: string
}> = [
  { type: 'rose',       emoji: '🌹', condition: '15-day protein streak',     description: 'Roses bloom with every protein milestone' },
  { type: 'river',      emoji: '🌊', condition: '30-day hydration streak',    description: 'A river flows through your garden' },
  { type: 'butterfly',  emoji: '🦋', condition: '30-day vitamin streak',      description: 'Butterflies appear when vitamins are complete' },
  { type: 'tree',       emoji: '🌳', condition: '21-day balanced diet streak', description: 'Trees grow with balanced eating' },
  { type: 'chicken',    emoji: '🐔', condition: 'Eat chicken 10 times',       description: 'A little chicken appears in your garden' },
  { type: 'firefly',    emoji: '✨', condition: 'Reach Level 20',             description: 'Fireflies light up your garden at night' },
  { type: 'mushroom',   emoji: '🍄', condition: 'Eat 5 different fungi',      description: 'Magical mushrooms sprout in corners' },
  { type: 'rainbow',    emoji: '🌈', condition: 'Complete all nutrients for 7 days', description: 'A rainbow arches over your garden' },
]
