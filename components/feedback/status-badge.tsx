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
        'font-normal',
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
        'font-normal',
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
  rascunho: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  finalizado: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  enviado: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  arquivado: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
}

export function DocumentoStatusBadge({ status, className }: DocumentoStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'font-normal',
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
  ativo: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inativo: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  pendente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
}

export function CadastroStatusBadge({ status, className }: CadastroStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'font-normal',
        CADASTRO_STATUS_COLORS[status],
        className
      )}
    >
      {STATUS_CADASTRO_LABELS[status]}
    </Badge>
  )
}
