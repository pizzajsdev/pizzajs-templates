import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'
import { authClient } from '@/runtime/auth.client'
import type { CurrentSessionUser } from '@/runtime/auth.server'
import { BarChart3, BookOpen, Briefcase, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Logo } from './logo'
import { appConfig } from '@/config'

interface HeaderProps {
  user?: CurrentSessionUser | null
  className?: string
}

export function Header({ user, className }: HeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      authenticated: true,
    },
    {
      label: 'Documentation',
      href: '/docs',
      icon: BookOpen,
      public: true,
    },
    {
      label: 'Careers',
      href: '/careers',
      icon: Briefcase,
      public: true,
    },
  ]

  const visibleItems = navigationItems.filter((item) => item.public || (item.authenticated && user))

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setIsMobileMenuOpen(false)
    try {
      await authClient.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  const handleSignIn = () => {
    setIsMobileMenuOpen(false)
    window.location.href = '/login'
  }

  return (
    <header className={cn('bg-card shadow-sm border-b', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Bar - Logo, Navigation, and Controls */}
        <div className="flex justify-between items-center h-16">
          <div className="contents">
            {/* Logo and Title */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0">
              <Logo />
              <h1 className="sr-only">{appConfig.name}</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 lg:gap-2">
              {visibleItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-label={item.label}
                    title={item.label}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      'text-muted-foreground hover:text-foreground hover:bg-accent',
                      'hover:scale-105 active:scale-95',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <Button onClick={handleLogout} disabled={isLoggingOut} variant="outline" size="sm">
                {isLoggingOut ? 'Signing out...' : 'Sign out'}
              </Button>
            ) : (
              <Button onClick={handleSignIn} variant="default" size="sm">
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            {/* User Info */}
            {user && <div className="text-sm text-muted-foreground mb-4 px-2">Welcome, {user.name || user.email}!</div>}

            {/* Navigation Items */}
            <div className="space-y-2 mb-4">
              {visibleItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      'text-muted-foreground hover:text-foreground hover:bg-accent',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Auth Button */}
            {user ? (
              <Button onClick={handleLogout} disabled={isLoggingOut} variant="outline" size="sm" className="w-full">
                {isLoggingOut ? 'Signing out...' : 'Sign out'}
              </Button>
            ) : (
              <Button onClick={handleSignIn} variant="default" size="sm" className="w-full">
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
