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
  TipoDocumento,
  Cadastro,
  Solicitacao,
  Documento,
  ConfiguracoesApp
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
  { label: 'Solicitacoes', href: ROUTES.SOLICITACOES, icon: FileText },
  { label: 'Documentos', href: ROUTES.DOCUMENTOS, icon: FolderOpen },
  { label: 'Configuracoes', href: ROUTES.CONFIGURACOES, icon: Settings },
]

// ===== LABELS =====

export const STATUS_SOLICITACAO_LABELS: Record<StatusSolicitacao, string> = {
  pendente: 'Pendente',
  em_analise: 'Em Analise',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  concluida: 'Concluida',
}

export const STATUS_SOLICITACAO_COLORS: Record<StatusSolicitacao, string> = {
  pendente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  em_analise: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  aprovada: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejeitada: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  concluida: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
}

export const PRIORIDADE_LABELS: Record<Prioridade, string> = {
  baixa: 'Baixa',
  media: 'Media',
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
  oficio: 'Oficio',
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
  { value: 'AP', label: 'Amapa' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceara' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espirito Santo' },
  { value: 'GO', label: 'Goias' },
  { value: 'MA', label: 'Maranhao' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Para' },
  { value: 'PB', label: 'Paraiba' },
  { value: 'PR', label: 'Parana' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piaui' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondonia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'Sao Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
]

// ===== DADOS MOCKADOS =====

export const MOCK_CADASTROS: Cadastro[] = [
  {
    id: '1',
    nome: 'Maria Silva Santos',
    cpfCnpj: '123.456.789-00',
    tipo: 'pessoa_fisica',
    email: 'maria.silva@email.com',
    telefone: '(11) 99999-8888',
    cep: '01310-100',
    logradouro: 'Avenida Paulista',
    numero: '1000',
    complemento: 'Sala 101',
    bairro: 'Bela Vista',
    cidade: 'Sao Paulo',
    uf: 'SP',
    observacoes: 'Cliente VIP',
    status: 'ativo',
    criadoEm: '2024-01-15T10:30:00Z',
    atualizadoEm: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    nome: 'Tech Solutions LTDA',
    cpfCnpj: '12.345.678/0001-90',
    tipo: 'pessoa_juridica',
    email: 'contato@techsolutions.com.br',
    telefone: '(11) 3333-4444',
    cep: '04543-011',
    logradouro: 'Rua Funchal',
    numero: '500',
    bairro: 'Vila Olimpia',
    cidade: 'Sao Paulo',
    uf: 'SP',
    status: 'ativo',
    criadoEm: '2024-02-01T14:00:00Z',
    atualizadoEm: '2024-02-01T14:00:00Z',
  },
  {
    id: '3',
    nome: 'Joao Pedro Oliveira',
    cpfCnpj: '987.654.321-00',
    tipo: 'pessoa_fisica',
    email: 'joao.oliveira@email.com',
    telefone: '(21) 98888-7777',
    cep: '22041-080',
    logradouro: 'Rua Barata Ribeiro',
    numero: '200',
    bairro: 'Copacabana',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    status: 'pendente',
    criadoEm: '2024-02-10T09:15:00Z',
    atualizadoEm: '2024-02-10T09:15:00Z',
  },
]

export const MOCK_SOLICITACOES: Solicitacao[] = [
  {
    id: '1',
    titulo: 'Solicitacao de Ferias',
    descricao: 'Solicitacao de ferias para o periodo de 01/03 a 15/03/2024',
    tipo: 'ferias',
    solicitanteId: '1',
    solicitanteNome: 'Maria Silva Santos',
    status: 'pendente',
    prioridade: 'media',
    dataLimite: '2024-02-25',
    criadoEm: '2024-02-10T10:00:00Z',
    atualizadoEm: '2024-02-10T10:00:00Z',
  },
  {
    id: '2',
    titulo: 'Aprovacao de Orcamento',
    descricao: 'Solicito aprovacao do orcamento para aquisicao de equipamentos de TI',
    tipo: 'orcamento',
    solicitanteId: '2',
    solicitanteNome: 'Tech Solutions LTDA',
    status: 'em_analise',
    prioridade: 'alta',
    responsavelId: '3',
    responsavelNome: 'Carlos Mendes',
    dataLimite: '2024-02-20',
    criadoEm: '2024-02-05T14:30:00Z',
    atualizadoEm: '2024-02-08T09:00:00Z',
  },
  {
    id: '3',
    titulo: 'Manutencao Urgente',
    descricao: 'Necessidade de manutencao emergencial no sistema de ar condicionado',
    tipo: 'manutencao',
    solicitanteId: '1',
    solicitanteNome: 'Maria Silva Santos',
    status: 'aprovada',
    prioridade: 'urgente',
    responsavelId: '4',
    responsavelNome: 'Roberto Lima',
    criadoEm: '2024-02-12T08:00:00Z',
    atualizadoEm: '2024-02-12T10:30:00Z',
  },
]

export const MOCK_DOCUMENTOS: Documento[] = [
  {
    id: '1',
    numero: 'OF-001/2024',
    tipo: 'oficio',
    titulo: 'Oficio de Comunicacao',
    conteudo: 'Prezado(a) Senhor(a),\n\nVimos por meio deste comunicar...',
    destinatario: 'Secretaria de Administracao',
    remetente: 'Departamento de RH',
    assunto: 'Comunicacao de Alteracao de Horario',
    dataDocumento: '2024-02-15',
    status: 'finalizado',
    criadoEm: '2024-02-15T09:00:00Z',
    atualizadoEm: '2024-02-15T11:30:00Z',
  },
  {
    id: '2',
    numero: 'MEM-005/2024',
    tipo: 'memorando',
    titulo: 'Memorando Interno',
    conteudo: 'Informamos que a partir do dia 01/03/2024...',
    destinatario: 'Todos os Setores',
    remetente: 'Diretoria Geral',
    assunto: 'Nova Politica de Home Office',
    dataDocumento: '2024-02-10',
    status: 'enviado',
    criadoEm: '2024-02-10T14:00:00Z',
    atualizadoEm: '2024-02-11T08:00:00Z',
  },
  {
    id: '3',
    numero: 'PORT-002/2024',
    tipo: 'portaria',
    titulo: 'Portaria de Nomeacao',
    conteudo: 'O Diretor Geral, no uso de suas atribuicoes...',
    destinatario: 'Departamento Pessoal',
    remetente: 'Diretoria Geral',
    assunto: 'Nomeacao de Coordenador',
    dataDocumento: '2024-02-01',
    status: 'arquivado',
    criadoEm: '2024-02-01T10:00:00Z',
    atualizadoEm: '2024-02-05T16:00:00Z',
  },
]

export const DEFAULT_CONFIGURACOES: ConfiguracoesApp = {
  perfil: {
    nome: 'Usuario do Sistema',
    email: 'usuario@sistema.gov.br',
    cargo: 'Analista',
    setor: 'Administracao',
  },
  tema: 'system',
  notificacoes: {
    email: true,
    push: true,
    sms: false,
  },
  idioma: 'pt-BR',
}
