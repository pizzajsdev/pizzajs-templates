import { SpeedInsights } from '@vercel/speed-insights/react'
import { getBasePath, useRoute } from '../analytics/utils'
import type { SpeedInsightsProps } from './types'

export function VercelSpeedInsights(props: Omit<SpeedInsightsProps, 'route'>): React.ReactNode {
  return <SpeedInsights route={useRoute().route} {...props} framework="react-router" basePath={getBasePath()} />
}
