import type { KvStoreService } from './types'

interface CacheEntry {
  value: any
  expiresAt: number | null
}

interface HashEntry {
  key: string
  field: string
  value: any
}

export class IndexedDBCacheDbService implements KvStoreService {
  private readonly dbName: string
  private readonly storeName: string
  private readonly hashStoreName: string

  private db: IDBDatabase | null = null
  private dbInitPromise: Promise<void> | null = null

  constructor(dbName: string, storeName: string, hashStoreName: string) {
    this.dbName = dbName
    this.storeName = storeName
    this.hashStoreName = hashStoreName
    this.db = null
    this.dbInitPromise = null
  }

  private async initDb(): Promise<void> {
    if (this.db) return

    if (this.dbInitPromise) {
      return this.dbInitPromise
    }

    this.dbInitPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onerror = () => reject(request.error)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create store for regular key-value pairs
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' })
        }

        // Create store for hash fields
        if (!db.objectStoreNames.contains(this.hashStoreName)) {
          const hashStore = db.createObjectStore(this.hashStoreName, { keyPath: ['key', 'field'] })
          hashStore.createIndex('key_index', 'key')
        }
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
    })

    return this.dbInitPromise
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized')
    const transaction = this.db.transaction(storeName, mode)
    return transaction.objectStore(storeName)
  }

  async has(key: string): Promise<boolean> {
    await this.initDb()
    return new Promise((resolve, reject) => {
      const store = this.getStore(this.storeName)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const entry = request.result as CacheEntry | undefined
        if (!entry) {
          resolve(false)
          return
        }

        if (entry.expiresAt && entry.expiresAt < Date.now()) {
          resolve(false)
          return
        }

        resolve(true)
      }
    })
  }

  async get<T = any>(key: string): Promise<T | null> {
    await this.initDb()
    return new Promise((resolve, reject) => {
      const store = this.getStore(this.storeName)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const entry = request.result as CacheEntry | undefined
        if (!entry) {
          resolve(null)
          return
        }

        if (entry.expiresAt && entry.expiresAt < Date.now()) {
          resolve(null)
          return
        }

        resolve(entry.value)
      }
    })
  }

  async hashGetField(key: string, field: string): Promise<string | null> {
    await this.initDb()
    return new Promise((resolve, reject) => {
      const store = this.getStore(this.hashStoreName)
      const request = store.get([key, field])

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const entry = request.result as HashEntry | undefined
        resolve(entry?.value ?? null)
      }
    })
  }

  async getObject<T = any>(key: string): Promise<T | null> {
    const value = await this.get<T>(key)
    if (!value) return null
    try {
      return value
    } catch {
      return null
    }
  }

  async set<T = any>(key: string, value: T, expirationSeconds: number): Promise<void> {
    await this.initDb()
    return new Promise((resolve, reject) => {
      const store = this.getStore(this.storeName, 'readwrite')
      const expiresAt = expirationSeconds > 0 ? Date.now() + expirationSeconds * 1000 : null
      const request = store.put({ key, value, expiresAt })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async setObject<T = any>(key: string, value: T, expirationSeconds: number): Promise<void> {
    // const stringValue = JSON.stringify(value)
    return this.set(key, value, expirationSeconds)
  }

  async hashSetField(key: string, field: string, value: string | undefined): Promise<void> {
    await this.initDb()
    return new Promise((resolve, reject) => {
      const store = this.getStore(this.hashStoreName, 'readwrite')

      if (value === undefined) {
        const request = store.delete([key, field])
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      } else {
        const request = store.put({ key, field, value })
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      }
    })
  }

  async delete(...keys: string[]): Promise<number> {
    await this.initDb()
    return new Promise((resolve, reject) => {
      const store = this.getStore(this.storeName, 'readwrite')
      let deletedCount = 0
      let completedCount = 0

      const checkCompletion = () => {
        if (completedCount === keys.length) {
          resolve(deletedCount)
        }
      }

      keys.forEach((key) => {
        const request = store.delete(key)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          deletedCount++
          completedCount++
          checkCompletion()
        }
      })

      // Handle empty keys array
      if (keys.length === 0) {
        resolve(0)
      }
    })
  }
}
