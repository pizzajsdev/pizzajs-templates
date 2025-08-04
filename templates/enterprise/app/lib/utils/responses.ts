import { redirect } from 'react-router'

export const TEMPORARY_REDIRECT = 302
export const PERMANENT_REDIRECT = 301

export function externalRedirect(url: string, status: number = TEMPORARY_REDIRECT, headers?: HeadersInit): Response {
  return new Response(null, {
    status, // 302 = temporary redirect
    headers: {
      Location: url,
      ...headers,
    },
  })
}

export function permanentRedirect(url: string): Response {
  return redirect(url, { status: PERMANENT_REDIRECT })
}

export function temporaryExternalRedirect(url: string): Response {
  return externalRedirect(url, TEMPORARY_REDIRECT)
}

export function permanentExternalRedirect(url: string): Response {
  return externalRedirect(url, PERMANENT_REDIRECT)
}

export function notFound(body?: BodyInit): Response {
  return new Response(body, { status: 404 })
}

export function forbidden(body?: BodyInit): Response {
  return new Response(body, { status: 403 })
}

export function unauthorized(body?: BodyInit): Response {
  return new Response(body, { status: 401 })
}

export function badRequest(body?: BodyInit): Response {
  return new Response(body, { status: 400 })
}

export function badMethod(body?: BodyInit): Response {
  return new Response(body, { status: 405 })
}

export function serverError(body?: BodyInit): Response {
  return new Response(body, { status: 500 })
}
