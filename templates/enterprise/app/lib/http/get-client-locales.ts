export type ClientLocales = string[]
export type ClientLocaleParserOptions = {
  /**
   * A validate callback that is called for each `locale`. If the `locale` is valid, return the `locale` as a string.
   * Otherwise return `undefined`, `null`, or an empty Array.
   * Should the callback throw an error, the error will be caught and the `locale` will be ignored.
   */
  validate?: (locale: string) => string | string[] | null | undefined

  /**
   * If set to `true`, the wildcard locale `*` will be returned in the array.
   * If set to `false`, the wildcard locale `*` will be ignored.
   * Defaults to `true`.
   */
  ignoreWildcard?: boolean
}

/**
 * Get the client's locales from the Accept-Language header.
 * If the header is not defined returns null.
 * If the header is defined return an array of locales, sorted by the quality
 * value.
 *
 * @example
 * export async function loader({ request }: Route.LoaderArgs) {
 *   let locales = getClientLocales(request)
 *   let date = new Date().toLocaleDateString(locales, {
 *     "day": "numeric",
 *   });
 *   return json({ date })
 * }
 */
export function getClientLocales(headers: Headers): ClientLocales
export function getClientLocales(request: Request): ClientLocales
export function getClientLocales(requestOrHeaders: Request | Headers): ClientLocales {
  let headers = requestOrHeaders instanceof Request ? requestOrHeaders.headers : requestOrHeaders

  let acceptLanguage = headers.get('Accept-Language')

  // if the header is not defined, return undefined
  if (!acceptLanguage) return []

  let locales = parseAcceptLanguage(acceptLanguage, {
    validate: Intl.DateTimeFormat.supportedLocalesOf,
    ignoreWildcard: true,
  })

  // if there are no locales found, return undefined
  if (locales.length === 0) return []
  // if there are multiple locales, return the array
  return locales
}

export const parseAcceptLanguage = (
  /** The value from the `Accept-Language` header.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
   */
  languageHeaderValue: string | null | undefined,
  options: ClientLocaleParserOptions = {},
): string[] => {
  if (!languageHeaderValue) return []
  const { ignoreWildcard = true, validate = (locale: string) => locale } = options

  return languageHeaderValue
    .split(',')
    .map((lang): [number, string] => {
      const [locale, q = 'q=1'] = lang.split(';')
      const trimmedLocale = locale.trim()
      const numQ = Number(q.replace(/q ?=/, ''))
      return [isNaN(numQ) ? 0 : numQ, trimmedLocale]
    })
    .sort(([q1], [q2]) => q2 - q1)
    .flatMap(([_, locale]) => {
      if (locale === '*' && ignoreWildcard) return []
      try {
        return validate(locale) || []
      } catch {
        return []
      }
    })
}
