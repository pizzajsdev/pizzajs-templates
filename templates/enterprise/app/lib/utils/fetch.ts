export class HttpError extends Error {
  url: string
  response: Response

  constructor(url: string, response: Response) {
    super(`Failed to fetch ${url}. HTTP Error was ${response.status} ${response.statusText}`)
    this.url = url
    this.response = response
  }
}

export async function fetchJson<T = unknown>(url: string | Request | URL, init?: RequestInit | undefined): Promise<T> {
  const resp = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  })
  if (!resp.ok) {
    return new Promise<T>((_, reject) => {
      reject(new HttpError(url.toString(), resp))
    })
  }

  return await resp.json()
}
