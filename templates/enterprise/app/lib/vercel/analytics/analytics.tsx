import { Analytics } from '@vercel/analytics/react'
import type { AnalyticsProps, BeforeSend, BeforeSendEvent } from './types'
import { getBasePath, useRoute } from './utils'

export function VercelAnalytics(props: Omit<AnalyticsProps, 'route'>): React.ReactNode {
  return <Analytics {...useRoute()} {...props} basePath={getBasePath()} framework="react-router" />
}
export type { AnalyticsProps, BeforeSend, BeforeSendEvent }
