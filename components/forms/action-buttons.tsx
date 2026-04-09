import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface ActionButtonsProps {
  onSubmit?: () => void
  onCancel?: () => void
  onReset?: () => void
  submitLabel?: string
  cancelLabel?: string
  resetLabel?: string
  isSubmitting?: boolean
  isDisabled?: boolean
  showReset?: boolean
  className?: string
  align?: 'left' | 'center' | 'right'
}

export function ActionButtons({
  onSubmit,
  onCancel,
  onReset,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  resetLabel = 'Limpar',
  isSubmitting = false,
  isDisabled = false,
  showReset = false,
  className,
  align = 'right',
}: ActionButtonsProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 pt-4 border-t',
        align === 'left' && 'justify-start',
        align === 'center' && 'justify-center',
        align === 'right' && 'justify-end',
        className
      )}
    >
      {showReset && onReset && (
        <Button
          type="button"
          variant="ghost"
          onClick={onReset}
          disabled={isSubmitting}
        >
          {resetLabel}
        </Button>
      )}
      
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
      )}
      
      {onSubmit && (
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitting || isDisabled}
        >
          {isSubmitting && <Spinner className="mr-2 size-4" />}
          {submitLabel}
        </Button>
      )}
    </div>
  )
}
