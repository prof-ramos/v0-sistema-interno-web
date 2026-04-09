'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { 
  Users, 
  FileText, 
  FolderOpen, 
  TrendingUp,
  TrendingDown,
  Plus,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { PageHeader, SectionCard } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge, PrioridadeBadge } from '@/components/feedback'
import { useAppStore } from '@/store/use-app-store'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const getTrendStyles = (change: string) => {
  const isPositive = change.startsWith('+');
  return {
    isPositive,
    colorClass: isPositive ? 'text-green-600' : 'text-red-600',
    Icon: isPositive ? TrendingUp : TrendingDown,
  };
};

const TrendIndicator = ({ change }: { change: string }) => {
  const { colorClass, Icon } = getTrendStyles(change);
  return <Icon className={cn('size-3', colorClass)} />;
};

export default function DashboardPage() {
  const { cadastros, solicitacoes, documentos } = useAppStore()

  const stats = useMemo(() => [
    {
      label: 'Cadastros',
      value: cadastros.length,
      icon: Users,
      href: ROUTES.CADASTRO,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
      change: '+12%',
    },
    {
      label: 'Solicitações',
      value: solicitacoes.length,
      icon: FileText,
      href: ROUTES.SOLICITACOES,
      color: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400',
      change: '+8%',
    },
    {
      label: 'Documentos',
      value: documentos.length,
      icon: FolderOpen,
      href: ROUTES.DOCUMENTOS,
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
      change: '+15%',
    },
    {
      label: 'Pendentes',
      value: solicitacoes.filter(s => s.status === 'pendente').length,
      icon: Clock,
      href: ROUTES.SOLICITACOES,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
      change: '-5%',
    },
  ], [cadastros, solicitacoes, documentos])

  const recentSolicitacoes = useMemo(() => 
    [...solicitacoes]
      .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
      .slice(0, 5),
    [solicitacoes]
  )

  const quickActions = [
    { label: 'Novo Cadastro', href: ROUTES.CADASTRO, icon: Users },
    { label: 'Nova Solicitação', href: ROUTES.SOLICITACOES, icon: FileText },
    { label: 'Novo Documento', href: ROUTES.DOCUMENTOS, icon: FolderOpen },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do sistema"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link 
            key={stat.label} 
            href={stat.href}
            aria-label={`Ver ${stat.label}: ${stat.value}`}
          >
            <Card className="transition-all hover:shadow-md hover:border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                  <div className={cn('rounded-lg p-2', stat.color)}>
                    <stat.icon className="size-5" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendIndicator change={stat.change} />
                  <span className={getTrendStyles(stat.change).colorClass}>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
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
          {recentSolicitacoes.length === 0 ? (
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
                    <p className="truncate font-medium text-sm">
                      {solicitacao.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground">
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
                  <Plus className="mr-2 size-4" />
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
ef={action.href} aria-label={`Realizar ${action.label}`}>
                  <Plus className="mr-2 size-4" />
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
