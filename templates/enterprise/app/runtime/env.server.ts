export const envVars = {
  APP_ENV: process.env.APP_ENV,
  APP_DOMAIN: process.env.APP_DOMAIN,
  APP_URL: process.env.IS_DEV_BUILD === '1' ? process.env.APP_DEV_BUILD_URL : process.env.APP_URL,
  // DBs
  DATABASE_URL: process.env.DATABASE_URL,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  // Auth
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  // OAuth providers
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
}

export const envName = {
  isProduction: envVars.APP_ENV === 'production',
  isDev: envVars.APP_ENV === 'development',
  isDevBuild: process.env.IS_DEV_BUILD === '1',
}

type EnvVars = typeof envVars
type EnvVarKey = keyof EnvVars

const optionalEnvVars: EnvVarKey[] = [
  // env vars that are not required. the rest will fail if not set.
]

function checkEnvVars() {
  const allKeys = Object.keys(envVars) as EnvVarKey[]
  for (const envVar of allKeys) {
    const isOptional = optionalEnvVars.includes(envVar)
    if (!isOptional && !envVars[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }
}

checkEnvVars()
