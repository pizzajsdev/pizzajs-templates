import { getAbsUrlUtil } from '@/lib/utils/urls'

export function isDev() {
  return import.meta.env.DEV === true
}

export function isServerSide() {
  return typeof window === 'undefined' && typeof document === 'undefined'
}

export function isClientSide() {
  return !isServerSide()
}

export function getBaseUrl(): string {
  if (isClientSide()) {
    return window.location.origin
  }

  if (typeof process === 'undefined') {
    throw new Error('process is not defined')
  }

  if (!process.env.APP_URL) {
    throw new Error('process.env.APP_URL is not defined')
  }

  return process.env.APP_URL
}

export function getAbsUrl(path?: string): string {
  return getAbsUrlUtil(path, getBaseUrl())
}

export function dlog(...args: any[]) {
  if (import.meta.env.DEV) {
    console.debug(...args)
  }
}
