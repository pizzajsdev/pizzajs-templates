import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import type { RateLimiterResult, RateLimiterService } from './types'

export class UpstashRateLimiter implements RateLimiterService {
  private readonly redis: Redis
  private readonly ratelimit: Ratelimit

  constructor(redis: Redis, limiter?: Ratelimit['limiter'], prefix?: string) {
    this.redis = redis
    this.ratelimit = new Ratelimit({
      redis: this.redis,
      // Create a new ratelimiter, that allows 10 requests per 10 seconds
      limiter: limiter || Ratelimit.slidingWindow(10, '10 m'),
      analytics: true,
      /**
       * Optional prefix for the keys used in redis. This is useful if you want to share a redis
       * instance with other applications and want to avoid key collisions. The default prefix is
       * "@upstash/ratelimit"
       */
      prefix: '@upstash/ratelimit' + (prefix ? `/${prefix}` : ''),
    })
  }

  async limit(identifier: string): Promise<RateLimiterResult> {
    try {
      return await this.ratelimit.limit(identifier)
    } catch (error) {
      console.error('Error using the rate limiter', String(error))
      throw new Error('Rate limiter error: ' + String(error))
    }
  }
}
