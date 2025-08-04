import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import type { Route } from './+types/root'
import './app.css'
import { VercelAnalytics } from './lib/vercel/analytics/analytics'
import { VercelSpeedInsights } from './lib/vercel/speed-insights/speed-insights'
import { getRequestInfo } from './runtime/contexts.server'
import {
  actionRateLimitMiddleware,
  apiAuthRateLimitMiddleware,
  loadSessionMiddleware,
  requestInfoMiddleware,
} from './runtime/middlewares.server'
import { appConfig } from './config'

export const unstable_middleware = [
  requestInfoMiddleware,
  // General rate limiters:
  apiAuthRateLimitMiddleware,
  actionRateLimitMiddleware,
  // Load session after rate limiting, for security and performance
  loadSessionMiddleware,
]

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    as: 'style',
    rel: 'stylesheet preload prefetch',
    crossOrigin: 'anonymous',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export const loader = async ({ context }: Route.LoaderArgs) => ({ theme: getRequestInfo(context)?.theme })

export default function App({ loaderData }: Route.ComponentProps) {
  const { theme } = loaderData

  return (
    <html lang="en" className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={appConfig.name} />
        <meta name="application-name" content={appConfig.name} />
        <meta name="theme-color" content={appConfig.themeColor} />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
      </head>
      <body>
        <VercelAnalytics />
        <div className="app-container">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <VercelSpeedInsights />
      </body>
    </html>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'

  const statusCode = () => {
    if (!isRouteErrorResponse(error)) {
      return '500'
    }
    // Supported error code messages
    switch (error.status) {
      case 200:
        return '200'
      case 403:
        return '403'
      case 404:
        return '404'
      default:
        return '500'
    }
  }
  const errorStatusCode = statusCode()
  const errorData = {
    200: {
      message: '200',
      details: 'The request was successful.',
    },
    403: {
      message: 'Error 403',
      details: 'You are not authorized to access this resource.',
    },
    404: {
      message: 'Error 404',
      details: 'The requested page could not be found.',
    },
    500: {
      message: 'Internal Server Error',
      details: 'An unexpected error occurred. If the problem persists, please contact support.',
    },
  }

  if (isRouteErrorResponse(error)) {
    message = 'Error ' + error.status
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    message = 'Uncaught Error'
    details = error.message
  } else {
    message = errorData[errorStatusCode].message
    details = errorData[errorStatusCode].details
  }

  return (
    <div className="placeholder-index relative flex h-full min-h-screen w-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 sm:pt-8 sm:pb-16 dark:bg-white dark:from-blue-950 dark:to-blue-900">
      <div className="relative mx-auto max-w-[90rem] sm:px-6 lg:px-8">
        <div className="relative flex min-h-72 flex-col justify-center p-1 sm:overflow-hidden sm:rounded-2xl md:p-4 lg:p-6">
          <h1 className="w-full pb-2 text-center text-2xl text-red-600">{message}</h1>
          <p className="w-full text-center text-lg dark:text-white">{details}</p>
        </div>
      </div>
    </div>
  )
}
