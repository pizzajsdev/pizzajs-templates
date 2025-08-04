import { getBaseUrl } from '@/lib/env'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { username } from 'better-auth/plugins'
import { passkey } from 'better-auth/plugins/passkey'
import db from './db.server'

const authServer = betterAuth({
  appName: 'template-enterprise',
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [passkey(), username()],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Request offline access to get refresh tokens
      accessType: 'offline',
      // Always prompt for account selection as recommended in Better Auth docs
      prompt: 'select_account+consent',
    },
  },
  // Configure session and security
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  // Configure base URL for OAuth redirects
  baseURL: getBaseUrl(),
  // Security settings
  trustedOrigins: [getBaseUrl()].filter(Boolean),
})

export type CurrentSession = typeof authServer.$Infer.Session
export type CurrentSessionUser = (typeof authServer.$Infer.Session)['user']
export type AuthServer = typeof authServer

export default authServer
