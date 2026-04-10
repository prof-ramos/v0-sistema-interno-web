import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  STATUS_SOLICITACAO_LABELS,
  STATUS_SOLICITACAO_COLORS,
  PRIORIDADE_LABELS,
  PRIORIDADE_COLORS,
  STATUS_DOCUMENTO_LABELS,
  STATUS_CADASTRO_LABELS,
} from '@/lib/constants'
import type { StatusSolicitacao, Prioridade } from '@/lib/types'

interface StatusBadgeProps {
  status: StatusSolicitacao
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'font-bold uppercase tracking-widest text-[10px]',
        STATUS_SOLICITACAO_COLORS[status],
        className
      )}
    >
      {STATUS_SOLICITACAO_LABELS[status]}
    </Badge>
  )
}

interface PrioridadeBadgeProps {
  prioridade: Prioridade
  className?: string
}

export function PrioridadeBadge({ prioridade, className }: PrioridadeBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'font-bold uppercase tracking-widest text-[10px]',
        PRIORIDADE_COLORS[prioridade],
        className
      )}
    >
      {PRIORIDADE_LABELS[prioridade]}
    </Badge>
  )
}

interface DocumentoStatusBadgeProps {
  status: 'rascunho' | 'finalizado' | 'enviado' | 'arquivado'
  className?: string
}

const DOCUMENTO_STATUS_COLORS = {
  rascunho: 'bg-muted text-muted-foreground',
  finalizado: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  enviado: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  arquivado: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
}

export function DocumentoStatusBadge({ status, className }: DocumentoStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'font-bold uppercase tracking-widest text-[10px]',
        DOCUMENTO_STATUS_COLORS[status],
        className
      )}
    >
      {STATUS_DOCUMENTO_LABELS[status]}
    </Badge>
  )
}

interface CadastroStatusBadgeProps {
  status: 'ativo' | 'inativo' | 'pendente'
  className?: string
}

const CADASTRO_STATUS_COLORS = {
  ativo: 'bg-success/15 text-success border-success/30 dark:bg-success/10 dark:text-success',
  inativo: 'bg-slate-100 text-slate-800 border-slate-200/50 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/50',
  pendente: 'bg-warning/15 text-warning border-warning/30 dark:bg-warning/10 dark:text-warning',
}

export function CadastroStatusBadge({ status, className }: CadastroStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-bold uppercase tracking-widest text-[10px] transition-colors',
        CADASTRO_STATUS_COLORS[status],
        className
      )}
    >
      {STATUS_CADASTRO_LABELS[status]}
    </Badge>
  )
}
