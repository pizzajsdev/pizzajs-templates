import { Ratelimit } from '@upstash/ratelimit'

export type RateLimiterResult = Awaited<ReturnType<typeof Ratelimit.prototype.limit>>

export interface RateLimiterService {
  limit(identifier: string): Promise<RateLimiterResult>
}
