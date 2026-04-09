import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'

interface LoadingStateProps {
  text?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingState({ 
  text = 'Carregando...', 
  className,
  size = 'md' 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8',
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 p-8',
        className
      )}
    >
      <Spinner className={cn('text-primary', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-subtle-pulse">
          {text}
        </p>
      )}
    </div>
  )
}
