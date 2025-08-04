export interface KvStoreService {
  has(key: string): Promise<boolean>
  get(key: string): Promise<string | null>
  hashGetField(key: string, field: string): Promise<string | null>
  getObject<T = any>(key: string): Promise<T | null>
  set(key: string, value: string, expirationSeconds: number): Promise<void>
  setObject(key: string, value: any, expirationSeconds: number): Promise<void>
  hashSetField(key: string, field: string, value: string | undefined): Promise<void>
  delete(...keys: string[]): Promise<number>
}
