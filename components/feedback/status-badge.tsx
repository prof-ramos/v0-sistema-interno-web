import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  STATUS_SOLICITACAO_LABELS,
  STATUS_SOLICITACAO_COLORS,
  PRIORIDADE_LABELS,
  PRIORIDADE_COLORS,
  STATUS_DOCUMENTO_LABELS,
  DOCUMENTO_STATUS_COLORS,
  STATUS_CADASTRO_LABELS,
  CADASTRO_STATUS_COLORS,
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
        'font-bold uppercase tracking-widest text-xs',
        STATUS_SOLICITACAO_COLORS[status.toUpperCase() as StatusSolicitacao],
        className
      )}
    >
      {STATUS_SOLICITACAO_LABELS[status.toUpperCase() as StatusSolicitacao]}
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
        'font-bold uppercase tracking-widest text-xs',
        PRIORIDADE_COLORS[prioridade.toUpperCase() as Prioridade],
        className
      )}
    >
      {PRIORIDADE_LABELS[prioridade.toUpperCase() as Prioridade]}
    </Badge>
  )
}

interface DocumentoStatusBadgeProps {
  status: 'RASCUNHO' | 'FINALIZADO' | 'ENVIADO' | 'ARQUIVADO'
  className?: string
}

export function DocumentoStatusBadge({ status, className }: DocumentoStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'font-bold uppercase tracking-widest text-xs',
        DOCUMENTO_STATUS_COLORS[status],
        className
      )}
    >
      {STATUS_DOCUMENTO_LABELS[status]}
    </Badge>
  )
}

interface CadastroStatusBadgeProps {
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE'
  className?: string
}

export function CadastroStatusBadge({ status, className }: CadastroStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-bold uppercase tracking-widest text-xs transition-colors',
        CADASTRO_STATUS_COLORS[status],
        className
      )}
    >
      {STATUS_CADASTRO_LABELS[status]}
    </Badge>
  )
}
