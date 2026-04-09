'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/feedback'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container flex min-h-[50vh] max-w-3xl items-center justify-center p-6">
      <div className="w-full space-y-4">
        <ErrorAlert
          title="Algo deu errado"
          message="Não foi possível carregar esta página. Tente novamente ou volte para o início."
          onRetry={reset}
        />
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => window.location.assign('/')}>
            Voltar ao dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
