import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SectionCardProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
  noPadding?: boolean
}

export function SectionCard({ 
  title, 
  description, 
  actions,
  children, 
  className,
  contentClassName,
  noPadding = false,
}: SectionCardProps) {
  const hasHeader = title || description || actions

  return (
    <Card className={cn('border-border shadow-sm', className)}>
      {hasHeader && (
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            {title && <CardTitle className="text-base font-medium">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </CardHeader>
      )}
      <CardContent className={cn(
        !hasHeader && 'pt-6',
        noPadding && 'p-0',
        contentClassName
      )}>
        {children}
      </CardContent>
    </Card>
  )
}
