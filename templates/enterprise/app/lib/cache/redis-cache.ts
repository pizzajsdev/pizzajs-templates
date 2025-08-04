import { Redis } from '@upstash/redis'
import superjson from 'superjson'
import type { KvStoreService } from './types'

type RedisClient = Redis

export class RedisCacheDbService implements KvStoreService {
  private readonly redis: RedisClient

  constructor(redis: RedisClient) {
    this.redis = redis
  }

  public async has(key: string): Promise<boolean> {
    return (await this.get(key)) !== null
  }

  public async get(key: string): Promise<string | null> {
    return await this.redis.get(key)
  }

  public async hashGetField(key: string, field: string): Promise<string | null> {
    return await this.redis.hget(key, field)
  }

  public async getObject<T = any>(key: string): Promise<T | null> {
    const value = (await this.get(key)) as any
    if (typeof value === 'string') {
      return superjson.parse(value) as T
    }

    if (value !== null && typeof value === 'object' && value?.json) {
      return superjson.deserialize(value) as T
    }
    return value
  }

  public async set(key: string, value: string, expirationSeconds: number): Promise<void> {
    await this.redis.set(key, value, expirationSeconds > 0 ? { ex: expirationSeconds } : undefined)
  }

  public async setObject(key: string, value: any, expirationSeconds: number): Promise<void> {
    return await this.set(key, superjson.stringify(value), expirationSeconds)
  }

  public async hashSetField(key: string, field: string, value: string | undefined): Promise<void> {
    await this.redis.hset(key, { [field]: value })
  }

  public async delete(...keys: string[]): Promise<number> {
    return await this.redis.del(...keys)
  }

  public async hashDeleteFields(key: string, ...fields: string[]): Promise<void> {
    await this.redis.hdel(key, ...fields)
  }
}
