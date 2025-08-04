import { RedisCacheDbService } from '@/lib/cache/redis-cache'
import { singleton } from '@/lib/utils/singleton'
import { Redis } from '@upstash/redis'
import { envVars } from './env.server'

export const _redisClient = singleton('_redis_connection', () => {
  return new Redis({
    url: envVars.UPSTASH_REDIS_REST_URL,
    token: envVars.UPSTASH_REDIS_REST_TOKEN,
  })
})

export const cacheDbService = new RedisCacheDbService(_redisClient)
