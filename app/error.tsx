'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/feedback'
import { reportError } from '@/lib/error-reporting'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const router = useRouter()

  useEffect(() => {
    // reportError retorna uma Promise no nosso sistema interno, precisa ser engolida ou logada
    const report = async () => {
      try {
        await reportError(error, { component: 'GlobalError' })
      } catch (err) {
        console.error('Falha ao reportar o erro originário para o sistema de logs:', err)
      }
    }
    report()
  }, [error])

  return (
    <div className="container flex min-h-[50vh] max-w-3xl items-center justify-center p-6">
      <div className="w-full space-y-4">
        <ErrorAlert
          title="Algo deu errado"
          message={`Não foi possível carregar esta página. Tente novamente ou volte para o início.${error.digest ? ` (Erro ID: ${error.digest})` : ''}`}
          onRetry={reset}
        />
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => router.replace('/')}>
            Voltar ao dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
