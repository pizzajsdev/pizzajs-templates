import seo from '@/lib/utils/seo'
import { getCurrentUser } from '@/runtime/contexts.server'
import { requiresAuthMiddleware } from '@/runtime/middlewares.server'
import type { Route } from './+types/dashboard'

export const unstable_middleware = [requiresAuthMiddleware]

export function meta({}: Route.MetaArgs) {
  return [seo.title('Dashboard')]
}

export const loader = async ({ context }: Route.LoaderArgs) => ({ user: getCurrentUser(context) })

export default function Page({ loaderData }: Route.ComponentProps) {
  return <div>Dashboard for {loaderData.user?.email}</div>
}
