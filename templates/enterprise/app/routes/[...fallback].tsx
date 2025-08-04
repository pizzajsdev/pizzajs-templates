import { dlog } from '@/lib/env'
import { notFound } from '@/lib/utils/responses'
import seo from '@/lib/utils/seo'
import { redirect } from 'react-router'
import type { Route } from './+types/[...fallback]'

export function meta() {
  return [seo.title('Page Not Found'), seo.robots(['noindex', 'nofollow'])]
}

const neverGonnaGiveYouUp = 'https://www.youtube.com/watch?v=lYBUbBu4W08'
const routeRedirects: Array<[RegExp, string]> = [
  // Redirects for your old routes.
  // [/^pokemon$/, '/pokedex/national'],
  // Redirects for malicious crawlers. Usually you want these redirects configured in an upper layer like Cloudflare,
  // but it's good to have them here as a fallback or demonstration.
  [/^\\.?env/, neverGonnaGiveYouUp],
  [/^api\/\\.?env/, neverGonnaGiveYouUp],
  [/^wp-.*/, neverGonnaGiveYouUp],
  [/^\.git\/.*/, neverGonnaGiveYouUp],
  [/^Application\/.*/, neverGonnaGiveYouUp],
  [/^phpinfo/, neverGonnaGiveYouUp],
]

function getMatchingRedirect(pathname: string) {
  const matchingRedirect = routeRedirects.find(([regex]) => {
    return regex.test(pathname)
  })
  return matchingRedirect?.[1]
}

export async function loader({ request }: Route.LoaderArgs) {
  // Check for pre-configured redirects first
  const url = new URL(request.url)
  const redirectPath = getMatchingRedirect(url.pathname.replace(/^\//, ''))?.replace(/\/$/, '')
  if (redirectPath) {
    dlog('[catch-all fallback] redirecting to', { redirectPath, pathname: url.pathname })
    throw redirect(redirectPath)
  }

  // Will show this 404 page below with a 404 status code. If thrown, it will show the root ErrorBoundary instead.
  return notFound()
}

// Fallback
export default function Page(_props: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  )
}
