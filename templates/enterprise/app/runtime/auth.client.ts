import { getBaseUrl } from '@/lib/env'
import { inferAdditionalFields, passkeyClient, usernameClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { AuthServer } from './auth.server'

export const authClient = createAuthClient({
  baseURL: getBaseUrl(), // getAbsUrl('/api/auth'),
  plugins: [inferAdditionalFields<AuthServer>(), usernameClient(), passkeyClient()],
})

// Export commonly used auth functions for convenience
export const { signIn, signUp, signOut, getSession, useSession } = authClient
