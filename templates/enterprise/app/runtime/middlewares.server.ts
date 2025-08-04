import { dlog } from '@/lib/env'
import { getClientIPAddress } from '@/lib/http/get-client-ip'
import { getClientLocales } from '@/lib/http/get-client-locales'
import { href, redirect, type unstable_MiddlewareFunction as MiddlewareFn } from 'react-router'
import authServer from './auth.server'
import { requestInfoContext, sessionContext } from './contexts.server'
import { parseThemeCookie } from './cookies.server'
import { rateLimiters } from './ratelimit.server'

// React-Router middlewares. Docs: https://reactrouter.com/how-to/middleware

export const requestInfoMiddleware: MiddlewareFn = async ({ request, context }) => {
  dlog('[requestInfoMiddleware] called.')
  const clientIp = getClientIPAddress(request)
  const clientLocales = getClientLocales(request)
  const theme = await parseThemeCookie(request)

  context.set(requestInfoContext, { url: new URL(request.url), clientIp, clientLocales, theme })
}

export const loadSessionMiddleware: MiddlewareFn = async ({ context, request }) => {
  dlog('[loadSessionMiddleware] called.')
  const currentSession = context.get(sessionContext)
  if (currentSession) {
    return
  }

  const session = await authServer.api.getSession({
    headers: request.headers,
  })
  if (session) {
    context.set(sessionContext, session)
    dlog('  - Session found. User:', session.user.email)
  }
}

export const requiresAuthMiddleware: MiddlewareFn = async ({ context }) => {
  dlog('[requiresAuthMiddleware] called.')
  const currentSession = context.get(sessionContext)
  if (!currentSession) {
    throw redirect(href('/login'))
  }
}

export const apiAuthRateLimitMiddleware: MiddlewareFn = async ({ request }) => {
  dlog('[authRateLimitMiddleware] called.')
  const pathname = new URL(request.url).pathname
  if (!pathname.startsWith('/api/auth')) {
    return
  }

  dlog('[authRateLimitMiddleware] ACTIVATED.', { pathname })
  const limitKey = getClientIPAddress(request) || '127.0.0.1'
  const ratelimit = await rateLimiters.auth.limit(limitKey)
  if (!ratelimit.success) {
    console.warn('[rate-limiter] auth rate limit exceeded', { limitKey, pathname })
    throw redirect(href('/error') + '?code=rate_limit_exceeded&backUrl=' + encodeURIComponent(pathname))
  }

  return
}

export const actionRateLimitMiddleware: MiddlewareFn = async ({ request }) => {
  dlog('[actionRateLimitMiddleware] called.')
  if (!['post', 'put', 'patch', 'delete'].includes(request.method.toLowerCase())) {
    return
  }

  const pathname = new URL(request.url).pathname
  if (pathname.startsWith('/api/auth')) {
    // Do not rate limit auth actions, since we already have a rate limit on the auth routes
    return
  }

  dlog('[actionRateLimitMiddleware] ACTIVATED.', { pathname })
  const limitKey = getClientIPAddress(request) || '127.0.0.1'
  const ratelimit = await rateLimiters.actions.limit(limitKey)

  if (!ratelimit.success) {
    console.warn('[rate-limiter] action rate limit exceeded', { limitKey, pathname })
    throw redirect(href('/error') + '?code=rate_limit_exceeded&backUrl=' + encodeURIComponent(pathname))
  }

  return
}
