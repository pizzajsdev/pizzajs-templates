import type { KvStoreService } from './types'

export class NullCacheDbService implements KvStoreService {
  async has(): Promise<boolean> {
    return false
  }

  async get(): Promise<string | null> {
    return null
  }

  async hashGetField(): Promise<string | null> {
    return null
  }

  async getObject(): Promise<any | null> {
    return null
  }

  async set(): Promise<void> {
    return
  }

  async setObject(): Promise<void> {
    return
  }

  async hashSetField(): Promise<void> {
    return
  }

  async delete(): Promise<number> {
    return 0
  }
}
