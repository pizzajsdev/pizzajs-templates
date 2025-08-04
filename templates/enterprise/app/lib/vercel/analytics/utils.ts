import { useLocation, useParams } from 'react-router'

export const useRoute = (): { route: string | null; path: string } => {
  const params = useParams()
  const location = useLocation()
  return { route: computeRoute(location.pathname, params as never), path: location.pathname }
}

export function getBasePath(): string | undefined {
  try {
    return import.meta.env.VITE_VERCEL_OBSERVABILITY_BASEPATH
  } catch {
    // do nothing
  }

  return undefined
}

function computeRoute(pathname: string | null, pathParams: Record<string, string | string[]> | null): string | null {
  if (!pathname || !pathParams) {
    return pathname
  }

  let result = pathname
  try {
    const entries = Object.entries(pathParams)
    // simple keys must be handled first
    for (const [key, value] of entries) {
      if (!Array.isArray(value)) {
        const matcher = turnValueToRegExp(value)
        if (matcher.test(result)) {
          result = result.replace(matcher, `/[${key}]`)
        }
      }
    }
    // array values next
    for (const [key, value] of entries) {
      if (Array.isArray(value)) {
        const matcher = turnValueToRegExp(value.join('/'))
        if (matcher.test(result)) {
          result = result.replace(matcher, `/[...${key}]`)
        }
      }
    }
    return result
  } catch (e) {
    return pathname
  }
}

function turnValueToRegExp(value: string): RegExp {
  return new RegExp(`/${escapeRegExp(value)}(?=[/?#]|$)`)
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
