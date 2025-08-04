import { createCookie } from 'react-router'
import { envName, envVars } from './env.server'

export const themeCookie = createCookie('theme', {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 365, // 1 year
  secrets: undefined,
  // Set domain and secure only if in production
  ...(envName.isProduction ? { domain: envVars.APP_DOMAIN, secure: true } : {}),
})

export async function parseThemeCookie(request: Request, defaultValue?: string): Promise<string | undefined> {
  return (await themeCookie.parse(request.headers.get('Cookie'))) || defaultValue
}
