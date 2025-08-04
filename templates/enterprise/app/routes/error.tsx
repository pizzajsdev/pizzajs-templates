import seo from '@/lib/utils/seo'
import { AlertTriangleIcon } from 'lucide-react'
import { Link, type unstable_MiddlewareFunction as MiddlewareFn } from 'react-router'
import type { Route } from './+types/error'

const errorMessages: Record<string, { title: string; status: number; description: string }> = {
  rate_limit_exceeded: {
    title: 'Too Many Requests',
    status: 429,
    description:
      'You have made too many requests in a short period of time. Please try again after one minute or more.',
  },
  unknown: {
    title: 'Unexpected Error',
    status: 499, // Not 500, to avoid false positives when users visit the page directly without the error code
    description: 'An unexpected error occurred. Please try again later.',
  },
}

function _getError(request: Request) {
  const url = new URL(request.url)
  const errorCode = url.searchParams.get('error') || url.searchParams.get('code') || 'unknown'
  return errorMessages[errorCode] || errorMessages['unknown']
}

export const meta = (args: Route.MetaArgs) => [
  seo.title(args.data?.error?.title ? 'Error: ' + args.data.error.title : 'Internal Error'),
  seo.noIndexNoFollow(),
]

export const loader = async ({ request }: Route.LoaderArgs) => ({
  error: _getError(request),
  backUrl: new URL(request.url).searchParams.get('backUrl'),
})

export const unstable_middleware: MiddlewareFn[] = [
  async ({ request }, next) => {
    const error = _getError(request)

    // The result of next() should be a Response object, since it's the last middleware in the chain.
    const nextResponse = (await next()) as Response
    const response = new Response(nextResponse.body, {
      status: error.status,
      statusText: error.title,
      headers: nextResponse.headers,
    })

    return response
  },
]

export default function Page({ loaderData }: Route.ComponentProps) {
  const { error, backUrl } = loaderData
  const { title, description } = error

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <div className="bg-gray-800 overflow-hidden rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-red-400">
            <AlertTriangleIcon className="h-6 w-6" />
            {title}
          </h2>
          <p className="mt-2 text-red-300">{description}</p>
        </div>
        <div className="bg-gray-900 p-4">
          <p className="text-gray-400 text-sm">
            If you continue to experience issues, please contact support for assistance.
          </p>
        </div>
        <div className="bg-gray-800 flex justify-between p-6">
          {backUrl && (
            <a href={backUrl} className="bg-gray-700 hover:bg-gray-600 rounded px-4 py-2 text-white">
              Go Back
            </a>
          )}
          {!backUrl && (
            <button
              className="bg-gray-700 hover:bg-gray-600 rounded px-4 py-2 text-white"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          )}
          <Link to="/" className="bg-primary-600 hover:bg-primary-500 text-primary-foreground rounded px-4 py-2">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
