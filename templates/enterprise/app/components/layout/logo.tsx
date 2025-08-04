import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return <img src="/images/logo.svg" className={cn('w-16 h-full object-contain', className)} alt="Logo" />
}
