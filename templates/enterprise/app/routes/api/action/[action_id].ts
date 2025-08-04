import { getRequestInfo } from '@/runtime/contexts.server'
import { themeCookie } from '@/runtime/cookies.server'
import type { Route } from './+types/[action_id]'

function toggleTheme(currentTheme: string | undefined) {
  return currentTheme === 'light' ? 'dark' : 'light'
}

export const action = async ({ request, params, context }: Route.ActionArgs) => {
  if (request.method.toUpperCase() !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (params.action_id === 'toggle-theme') {
    const newTheme = toggleTheme(getRequestInfo(context)?.theme)
    const cookieValue = await themeCookie.serialize(newTheme)

    // Return success response with the theme cookie
    return new Response(JSON.stringify({ success: true, theme: newTheme }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieValue,
      },
    })
  }

  // Default response for other requests
  return new Response(JSON.stringify({ success: false }), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
