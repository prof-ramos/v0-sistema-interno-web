// ===== TIPOS BASE =====

export interface BaseEntity {
  id: string
  criadoEm: string
  atualizadoEm: string
}

// ===== CADASTRO =====

export interface Cadastro extends BaseEntity {
  // Dados Principais
  nome: string
  cpfCnpj: string
  tipo: 'FISICA' | 'JURIDICA'
  
  // Contato
  email: string
  telefone: string
  
  // Endereço
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  uf: string
  
  // Observações
  observacoes?: string
  
  // Status
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE'
}

export type CadastroForm = Omit<Cadastro, 'id' | 'criadoEm' | 'atualizadoEm'>

// ===== SOLICITAÇÃO =====

export type StatusSolicitacao = 'PENDENTE' | 'EM_ANALISE' | 'APROVADA' | 'REJEITADA' | 'CONCLUIDA'
export type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'

export interface Solicitacao extends BaseEntity {
  titulo: string
  descricao: string
  tipo: string
  solicitanteId: string
  solicitanteNome: string
  status: StatusSolicitacao
  prioridade: Prioridade
  dataLimite?: string
  responsavelId?: string
  responsavelNome?: string
  anexos?: string[]
}

export type SolicitacaoForm = Omit<Solicitacao, 'id' | 'criadoEm' | 'atualizadoEm'>

// ===== DOCUMENTO =====

export type TipoDocumento = 'OFICIO' | 'MEMORANDO' | 'PORTARIA' | 'DECRETO' | 'CONTRATO' | 'OUTRO'

export interface Documento extends BaseEntity {
  numero: string
  tipo: TipoDocumento
  titulo: string
  conteudo: string
  destinatario: string
  remetente: string
  assunto: string
  dataDocumento: string
  status: 'RASCUNHO' | 'FINALIZADO' | 'ENVIADO' | 'ARQUIVADO'
  anexos?: string[]
}

export type DocumentoForm = Omit<Documento, 'id' | 'criadoEm' | 'atualizadoEm'>

// ===== CONFIGURAÇÕES =====

export interface ConfiguracoesApp {
  perfil: {
    nome: string
    email: string
    cargo: string
    setor: string
    avatar?: string
  }
  tema: 'light' | 'dark' | 'system'
  notificacoes: {
    email: boolean
    push: boolean
    sms: boolean
  }
  idioma: 'pt-BR' | 'en-US' | 'es-ES'
}

// ===== APP STATE =====

export interface AppState {
  // Dados
  cadastros: Cadastro[]
  solicitacoes: Solicitacao[]
  documentos: Documento[]
  configuracoes: ConfiguracoesApp

  // Rascunhos (para auto-save)
  rascunhos: {
    cadastro?: Partial<CadastroForm>
    solicitacao?: Partial<SolicitacaoForm>
    documento?: Partial<DocumentoForm>
  }
}

// ===== TABELA =====

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  sortableValue?: (item: T) => string | number | Date | null | undefined
  sortable?: boolean
  width?: string
}

// ===== FILTROS =====

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'date' | 'text'
  options?: FilterOption[]
}
