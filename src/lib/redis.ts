import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as { redis: Redis | undefined }

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  })

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

// Cache helpers
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const val = await redis.get(key)
    return val ? JSON.parse(val) : null
  } catch { return null }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 60): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  } catch { /* silent */ }
}

export async function cacheDel(key: string): Promise<void> {
  try { await redis.del(key) } catch { /* silent */ }
}

export const CACHE_KEYS = {
  dailyLog: (userId: string, date: string) => `daily:${userId}:${date}`,
  userProfile: (userId: string) => `profile:${userId}`,
  leaderboard: (type: string) => `lb:${type}`,
  feed: (userId: string, page: number) => `feed:${userId}:${page}`,
  notifications: (userId: string) => `notifs:${userId}`,
  foodSearch: (q: string) => `food:search:${q.toLowerCase().trim()}`,
} as const
