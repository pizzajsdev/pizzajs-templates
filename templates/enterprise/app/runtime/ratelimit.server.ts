import type { RateLimiterService } from '@/lib/ratelimit/types'
import { UpstashRateLimiter } from '@/lib/ratelimit/upstash-ratelimiter'
import { Ratelimit } from '@upstash/ratelimit'
import { _redisClient } from './cache.server'

export const rateLimiters: Record<string, RateLimiterService> = {
  // Max 10 during 1 minute
  auth: new UpstashRateLimiter(_redisClient, Ratelimit.slidingWindow(10, '1 m'), 'auth'),
  // Max 8 during 10 seconds (less than 1 per second)
  actions: new UpstashRateLimiter(_redisClient, Ratelimit.slidingWindow(8, '10 s'), 'actions'),
}
