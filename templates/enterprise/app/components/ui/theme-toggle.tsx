import { cn } from '@/lib/utils'
import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { href, useRouteLoaderData } from 'react-router'

interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

export function ThemeToggle({ className, size = 'md' }: ThemeToggleProps) {
  const [isToggling, setIsToggling] = useState(false)
  // Get root data by route ID (React Router v7 file-based routing)
  const rootData = useRouteLoaderData<{ theme: 'light' | 'dark' } | undefined>('root')

  // Get current theme from root loader data, fallback to light
  const theme = rootData?.theme || 'light'

  const handleToggleTheme = async () => {
    if (isToggling) return

    setIsToggling(true)

    try {
      // Call the layout route with the toggle-theme action
      const response = await fetch(href('/api/action/:action_id', { action_id: 'toggle-theme' }), { method: 'POST' })

      if (response.ok) {
        // Reload the page to apply the new theme
        window.location.reload()
      } else {
        console.error('Failed to toggle theme')
        setIsToggling(false)
      }
    } catch (error) {
      console.error('Error toggling theme:', error)
      setIsToggling(false)
    }
  }

  return (
    <button
      onClick={handleToggleTheme}
      disabled={isToggling}
      className={`
        inline-flex items-center justify-center rounded-md p-2
        text-sm font-medium transition-colors
        hover:bg-accent hover:text-accent-foreground
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        disabled:pointer-events-none disabled:opacity-50
        ${className || ''}
      `}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {isToggling ? (
        <div
          className={cn('animate-spin rounded-full border-2 border-current border-t-transparent', sizeClasses[size])}
        />
      ) : theme === 'light' ? (
        <Moon className={sizeClasses[size]} />
      ) : (
        <Sun className={sizeClasses[size]} />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
