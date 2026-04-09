import { cn } from '@/lib/utils'

interface ToolbarProps {
  children: React.ReactNode
  className?: string
  sticky?: boolean
}

export function Toolbar({ children, className, sticky = false }: ToolbarProps) {
  return (
    <div 
      className={cn(
        'flex items-center justify-between gap-4 rounded-lg border bg-card p-3',
        sticky && 'sticky top-0 z-10',
        className
      )}
    >
      {children}
    </div>
  )
}

interface ToolbarGroupProps {
  children: React.ReactNode
  className?: string
}

export function ToolbarGroup({ children, className }: ToolbarGroupProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {children}
    </div>
  )
}
