import { PageLayout } from '@/components/layout/page-layout'
import { getCurrentUser } from '@/runtime/contexts.server'
import { Outlet } from 'react-router'
import type { Route } from './+types/layout'

export const loader = async ({ context, request }: Route.LoaderArgs) => ({
  user: getCurrentUser(context),
  isLoginPage: request.url.includes('/login'),
})

/**
 * Layout component shared by all routes
 * Provides PageLayout wrapper with user data and renders child routes via Outlet
 */
export default function Layout({ loaderData }: Route.ComponentProps) {
  if (loaderData.isLoginPage) {
    return <Outlet />
  }

  return (
    <PageLayout user={loaderData.user}>
      <Outlet />
    </PageLayout>
  )
}
