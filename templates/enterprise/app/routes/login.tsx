import { Logo } from '@/components/layout/logo'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { appConfig } from '@/config'
import seo from '@/lib/utils/seo'
import { authClient } from '@/runtime/auth.client'
import { getCurrentSession } from '@/runtime/contexts.server'
import { useState } from 'react'
import { redirect } from 'react-router'
import type { Route } from './+types/login'

export const meta: Route.MetaFunction = () => {
  return [seo.title('Login'), seo.description(`Sign in to your ${appConfig.name} account`)]
}

export const loader = async ({ context }: Route.LoaderArgs) => {
  // Redirect to dashboard if already authenticated (pseudolang spec)
  const session = getCurrentSession(context)

  if (session) {
    return redirect('/')
  }

  return {}
}

export const action = async () => {
  // Handle form submissions if needed
  return null
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard', // Redirect to dashboard as per pseudolang spec
      })
    } catch (error) {
      console.error('Google sign-in error:', error)
      // TODO: Add proper error handling with toast notifications
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-200 to-blue-500 dark:from-blue-800 dark:via-blue-600 dark:to-blue-950 flex items-center justify-center p-4">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Main login card */}
      <div className="bg-card rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 border">
        {/* Hero section with Pokedex logo */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <Logo className="w-32 h-12" />
            <h1 className="sr-only">{appConfig.name}</h1>
          </div>

          {/* "Gotta Catch 'Em All!" tagline as per pseudolang */}
          <p className="text-lg text-muted-foreground font-medium">Welcome to {appConfig.name}</p>

          <p className="text-sm text-muted-foreground mt-2">
            Sign in to access your account and manage your company's data
          </p>
        </div>

        {/* Sign in with Google button as per pseudolang */}
        <div className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">(Additional info here)</p>
        </div>
      </div>
    </div>
  )
}
