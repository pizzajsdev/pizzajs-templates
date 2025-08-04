import type { ClientLocales } from '@/lib/http/get-client-locales'
import { unstable_createContext as createMiddlewareContext, unstable_RouterContextProvider } from 'react-router'
import type { CurrentSession, CurrentSessionUser } from './auth.server'

// React-Router middleware contexts. Docs: https://reactrouter.com/how-to/middleware
export type RequestInfo = {
  url: URL
  clientIp: string | null
  clientLocales: ClientLocales
  theme: string | undefined
}

export const requestInfoContext = createMiddlewareContext<RequestInfo | null>(null)
export function getRequestInfo(context: unstable_RouterContextProvider): RequestInfo | null {
  return context.get(requestInfoContext)
}

export const sessionContext = createMiddlewareContext<CurrentSession | null>(null)
export function getCurrentSession(context: unstable_RouterContextProvider): CurrentSession | null {
  return context.get(sessionContext)
}
export function getCurrentUser(context: unstable_RouterContextProvider): CurrentSessionUser | null {
  return getCurrentSession(context)?.user ?? null
}
