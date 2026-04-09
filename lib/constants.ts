import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FolderOpen, 
  Settings,
  type LucideIcon
} from 'lucide-react'
import type { 
  StatusSolicitacao, 
  Prioridade, 
  TipoDocumento
} from './types'

// ===== ROTAS =====

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const ROUTES = {
  DASHBOARD: '/',
  CADASTRO: '/cadastro',
  SOLICITACOES: '/solicitacoes',
  DOCUMENTOS: '/documentos',
  CONFIGURACOES: '/configuracoes',
} as const

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Cadastro', href: ROUTES.CADASTRO, icon: Users },
  { label: 'Solicitações', href: ROUTES.SOLICITACOES, icon: FileText },
  { label: 'Documentos', href: ROUTES.DOCUMENTOS, icon: FolderOpen },
  { label: 'Configurações', href: ROUTES.CONFIGURACOES, icon: Settings },
]

// ===== LABELS =====

export const STATUS_SOLICITACAO_LABELS: Record<StatusSolicitacao, string> = {
  pendente: 'Pendente',
  em_analise: 'Em Análise',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  concluida: 'Concluída',
}

export const STATUS_SOLICITACAO_COLORS: Record<StatusSolicitacao, string> = {
  pendente: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  em_analise: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  aprovada: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  rejeitada: 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive/80',
  concluida: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

export const PRIORIDADE_LABELS: Record<Prioridade, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente',
}

export const PRIORIDADE_COLORS: Record<Prioridade, string> = {
  baixa: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  media: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  alta: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  urgente: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export const TIPO_DOCUMENTO_LABELS: Record<TipoDocumento, string> = {
  oficio: 'Ofício',
  memorando: 'Memorando',
  portaria: 'Portaria',
  decreto: 'Decreto',
  contrato: 'Contrato',
  outro: 'Outro',
}

export const STATUS_DOCUMENTO_LABELS = {
  rascunho: 'Rascunho',
  finalizado: 'Finalizado',
  enviado: 'Enviado',
  arquivado: 'Arquivado',
}

export const STATUS_CADASTRO_LABELS = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  pendente: 'Pendente',
}

export const UF_OPTIONS = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
]
