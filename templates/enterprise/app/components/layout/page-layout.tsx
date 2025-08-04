import { Header } from '@/components/layout/header'
import { cn } from '@/lib/utils'
import type { CurrentSessionUser } from '@/runtime/auth.server'

interface PageLayoutProps {
  children: React.ReactNode
  user?: CurrentSessionUser | null
  className?: string
  headerClassName?: string
}

export function PageLayout({ children, user, className, headerClassName }: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <Header user={user} className={headerClassName} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
