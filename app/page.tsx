'use client'

import { useState, useMemo, useEffect, useSyncExternalStore, useCallback } from 'react'
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
import type { Cadastro, Solicitacao } from '@/lib/types'
import { cn } from '@/lib/utils'

const CARD_SKELETON_HEIGHT = 'h-[132px]'

const quickActions = [
  { label: 'Novo Cadastro', href: ROUTES.CADASTRO, icon: Users },
  { label: 'Nova Solicitação', href: ROUTES.SOLICITACOES, icon: FileText },
  { label: 'Novo Documento', href: ROUTES.DOCUMENTOS, icon: FolderOpen },
] as const

function subscribeToStoreHydration(callback: () => void) {
  const unsubscribeHydrate = useAppStore.persist.onHydrate(callback)
  const unsubscribeFinishHydration = useAppStore.persist.onFinishHydration(callback)

  return () => {
    unsubscribeHydrate()
    unsubscribeFinishHydration()
  }
}

export default function DashboardPage() {
  const { solicitacoes, documentos } = useAppStore()
  const [localCadastros, setLocalCadastros] = useState<Cadastro[]>([])
  const [loadingCadastros, setLoadingCadastros] = useState(true)

  const mounted = useSyncExternalStore(
    subscribeToStoreHydration,
    () => useAppStore.persist.hasHydrated(),
    () => false
  )

  const fetchCadastros = useCallback(async () => {
    try {
      const resp = await fetch('/api/cadastros')
      if (!resp.ok) throw new Error('Erro ao carregar cadastros')
      const result = await resp.json()
      setLocalCadastros(Array.isArray(result) ? result : result.data || [])
    } catch {
      setLocalCadastros([])
    } finally {
      setLoadingCadastros(false)
    }
  }, [])

  useEffect(() => {
    fetchCadastros()
  }, [fetchCadastros])

  const pendentes = useMemo(
    () => solicitacoes.filter((s: Solicitacao) => s.status === 'PENDENTE'),
    [solicitacoes]
  )

  const stats = useMemo(() => [
    {
      label: 'Cadastros',
      value: localCadastros.length,
      icon: Users,
      href: ROUTES.CADASTRO,
      color: 'text-primary bg-primary/10 border-primary/20',
      detail: `${localCadastros.filter((item: Cadastro) => item.status === 'ATIVO').length} ativos`,
    },
    {
      label: 'Solicitações',
      value: solicitacoes.length,
      icon: FileText,
      href: ROUTES.SOLICITACOES,
      color: 'text-primary bg-primary/10 border-primary/20',
      detail: `${solicitacoes.filter((item) => item.status === 'CONCLUIDA').length} concluídas`,
    },
    {
      label: 'Documentos',
      value: documentos.length,
      icon: FolderOpen,
      href: ROUTES.DOCUMENTOS,
      color: 'text-primary bg-primary/10 border-primary/20',
      detail: `${documentos.filter((item) => item.status === 'FINALIZADO').length} finalizados`,
    },
    {
      label: 'Pendentes',
      value: pendentes.length,
      icon: Clock,
      href: ROUTES.SOLICITACOES,
      color: 'text-amber-700 bg-amber-50 dark:bg-amber-900/20 border-amber-200',
      detail: `${pendentes.filter((s) => s.prioridade === 'URGENTE').length} urgentes`,
    },
  ], [localCadastros, solicitacoes, documentos, pendentes])

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
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {!mounted || loadingCadastros ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className={`${CARD_SKELETON_HEIGHT} w-full rounded-sm`} />
          ))
        ) : (
          stats.map((stat) => (
            <Link 
              key={stat.label} 
              href={stat.href}
              aria-label={`Ver ${stat.label}: ${stat.value}`}
            >
              <Card className="transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 rounded-lg flex flex-col justify-between">
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <p className="text-base font-medium text-muted-foreground">{stat.label}</p>
                    <div className={cn('rounded-md p-3 border', stat.color)}>
                      <stat.icon className="size-5" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-auto">
                    <p className="text-5xl font-sans font-bold tracking-tight text-foreground">{stat.value}</p>
                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                      <span className="bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-sm">
                        {stat.detail}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
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
                  className="flex items-center justify-between rounded-sm border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif font-bold text-lg">
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
