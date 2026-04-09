import { AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ErrorAlertProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorAlert({
  title = 'Erro',
  message,
  onRetry,
  className,
}: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={cn('animate-fade-in', className)}>
      <AlertCircle className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-4 shrink-0"
          >
            <RefreshCw className="mr-1 size-3" />
            Tentar novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
