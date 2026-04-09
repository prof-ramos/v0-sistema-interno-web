'use client'

import { useMemo, useSyncExternalStore } from 'react'
import Link from 'next/link'
import {
  Users,
  FileText,
  FolderOpen,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { PageHeader, SectionCard } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge, PrioridadeBadge } from '@/components/feedback'
import { useAppStore } from '@/store/use-app-store'
import { ROUTES } from '@/lib/constants'
import type { Solicitacao } from '@/lib/types'
import { cn } from '@/lib/utils'

const quickActions = [
  { label: 'Novo Cadastro', href: ROUTES.CADASTRO, icon: Users },
  { label: 'Nova Solicitação', href: ROUTES.SOLICITACOES, icon: FileText },
  { label: 'Novo Documento', href: ROUTES.DOCUMENTOS, icon: FolderOpen },
]

function subscribeToStoreHydration(callback: () => void) {
  const unsubscribeHydrate = useAppStore.persist.onHydrate(callback)
  const unsubscribeFinishHydration = useAppStore.persist.onFinishHydration(callback)

  return () => {
    unsubscribeHydrate()
    unsubscribeFinishHydration()
  }
}

export default function DashboardPage() {
  const { cadastros, solicitacoes, documentos } = useAppStore()
  const mounted = useSyncExternalStore(
    subscribeToStoreHydration,
    () => useAppStore.persist.hasHydrated(),
    () => false
  )

  const stats = useMemo(() => [
    {
      label: 'Cadastros',
      value: cadastros.length,
      icon: Users,
      href: ROUTES.CADASTRO,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
      detail: `${cadastros.filter((item) => item.status === 'ativo').length} ativos`,
    },
    {
      label: 'Solicitações',
      value: solicitacoes.length,
      icon: FileText,
      href: ROUTES.SOLICITACOES,
      color: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400',
      detail: `${solicitacoes.filter((item) => item.status === 'concluida').length} concluídas`,
    },
    {
      label: 'Documentos',
      value: documentos.length,
      icon: FolderOpen,
      href: ROUTES.DOCUMENTOS,
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
      detail: `${documentos.filter((item) => item.status === 'finalizado').length} finalizados`,
    },
    {
      label: 'Pendentes',
      value: solicitacoes.filter((s: Solicitacao) => s.status === 'pendente').length,
      icon: Clock,
      href: ROUTES.SOLICITACOES,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
      detail: `${solicitacoes.filter((item) => item.prioridade === 'urgente').length} urgentes`,
    },
  ], [cadastros, solicitacoes, documentos])

  const recentSolicitacoes = useMemo(() => 
    [...solicitacoes]
      .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
      .slice(0, 5),
    [solicitacoes]
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do sistema"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {!mounted ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[132px] w-full rounded-xl" />
          ))
        ) : (
          stats.map((stat) => (
            <Link 
              key={stat.label} 
              href={stat.href}
              aria-label={`Ver ${stat.label}: ${stat.value}`}
            >
              <Card className="transition-all hover:shadow-md hover:border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-base text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-semibold">{stat.value}</p>
                    </div>
                    <div className={cn('rounded-lg p-2.5', stat.color)}>
                      <stat.icon className="size-6" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span>{stat.detail}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <SectionCard
          title="Solicitações Recentes"
          description="Últimas solicitações registradas"
          className="lg:col-span-2"
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.SOLICITACOES} aria-label="Ver todas as solicitações">
                Ver todas
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          }
        >
          {!mounted ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-[68px] w-full rounded-lg" />
              ))}
            </div>
          ) : recentSolicitacoes.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nenhuma solicitação encontrada.
            </p>
          ) : (
            <div className="space-y-3">
              {recentSolicitacoes.map((solicitacao) => (
                <div
                  key={solicitacao.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-base">
                      {solicitacao.titulo}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {solicitacao.solicitanteNome} - {new Date(solicitacao.criadoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <PrioridadeBadge prioridade={solicitacao.prioridade} />
                    <StatusBadge status={solicitacao.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Quick Actions */}
        <SectionCard
          title="Ações Rápidas"
          description="Atalhos para operações comuns"
        >
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={action.href} aria-label={`Realizar ${action.label}`}>
                  <action.icon className="mr-2 size-4" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
