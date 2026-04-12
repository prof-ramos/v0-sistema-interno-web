import type { Cadastro, ConfiguracoesApp, Documento, Solicitacao } from './types'

// Helper to generate dates relative to now
function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export const MOCK_CADASTROS: Cadastro[] = [
  {
    id: '1',
    nome: 'Ana Exemplo da Silva',
    cpfCnpj: '000.000.001-91',
    tipo: 'FISICA',
    email: 'ana.exemplo@example.com',
    telefone: '(00) 90000-0001',
    cep: '00000-001',
    logradouro: 'Rua dos Testes',
    numero: '100',
    complemento: 'Sala 1',
    bairro: 'Bairro Exemplo',
    cidade: 'Cidade Teste',
    uf: 'SP',
    observacoes: 'Cadastro de demonstração',
    status: 'ATIVO',
    criadoEm: daysAgo(60),
    atualizadoEm: daysAgo(60),
  },
  {
    id: '2',
    nome: 'Empresa Fictícia LTDA',
    cpfCnpj: '00.000.000/0001-91',
    tipo: 'JURIDICA',
    email: 'contato@empresa-ficticia.example.com',
    telefone: '(00) 3000-0002',
    cep: '00000-002',
    logradouro: 'Avenida dos Dados',
    numero: '200',
    bairro: 'Centro Teste',
    cidade: 'Cidade Teste',
    uf: 'SP',
    status: 'ATIVO',
    criadoEm: daysAgo(45),
    atualizadoEm: daysAgo(45),
  },
  {
    id: '3',
    nome: 'Carlos Demonstração Oliveira',
    cpfCnpj: '000.000.002-82',
    tipo: 'FISICA',
    email: 'carlos.demo@example.com',
    telefone: '(00) 90000-0003',
    cep: '00000-003',
    logradouro: 'Rua Fictícia',
    numero: '300',
    bairro: 'Bairro Demo',
    cidade: 'Cidade Demo',
    uf: 'RJ',
    status: 'PENDENTE',
    criadoEm: daysAgo(30),
    atualizadoEm: daysAgo(30),
  },
]

export const MOCK_SOLICITACOES: Solicitacao[] = [
  {
    id: '1',
    titulo: 'Solicitação de Férias',
    descricao: 'Solicitação de férias para o período de 01/03 a 15/03',
    tipo: 'ferias',
    solicitanteId: '1',
    solicitanteNome: 'Ana Exemplo da Silva',
    status: 'pendente',
    prioridade: 'media',
    dataLimite: daysFromNow(15),
    criadoEm: daysAgo(5),
    atualizadoEm: daysAgo(5),
  },
  {
    id: '2',
    titulo: 'Aprovação de Orçamento',
    descricao: 'Solicito aprovação do orçamento para aquisição de equipamentos de TI',
    tipo: 'orcamento',
    solicitanteId: '2',
    solicitanteNome: 'Empresa Fictícia LTDA',
    status: 'em_analise',
    prioridade: 'alta',
    responsavelId: '3',
    responsavelNome: 'Carlos Demonstração Oliveira',
    dataLimite: daysFromNow(10),
    criadoEm: daysAgo(10),
    atualizadoEm: daysAgo(7),
  },
  {
    id: '3',
    titulo: 'Manutenção Urgente',
    descricao: 'Necessidade de manutenção emergencial no sistema de ar condicionado',
    tipo: 'manutencao',
    solicitanteId: '1',
    solicitanteNome: 'Ana Exemplo da Silva',
    status: 'aprovada',
    prioridade: 'urgente',
    responsavelId: '4',
    responsavelNome: 'Roberto Demo Lima',
    criadoEm: daysAgo(3),
    atualizadoEm: daysAgo(2),
  },
]

export const MOCK_DOCUMENTOS: Documento[] = [
  {
    id: '1',
    numero: 'OF-001/2024',
    tipo: 'oficio',
    titulo: 'Ofício de Comunicação',
    conteudo: 'Prezado(a) Senhor(a),\n\nVimos por meio deste comunicar...',
    destinatario: 'Secretaria de Administração',
    remetente: 'Departamento de RH',
    assunto: 'Comunicação de Alteração de Horário',
    dataDocumento: daysFromNow(-10),
    status: 'finalizado',
    criadoEm: daysAgo(10),
    atualizadoEm: daysAgo(8),
  },
  {
    id: '2',
    numero: 'MEM-005/2024',
    tipo: 'memorando',
    titulo: 'Memorando Interno',
    conteudo: 'Informamos que a partir do próximo mês...',
    destinatario: 'Todos os Setores',
    remetente: 'Diretoria Geral',
    assunto: 'Nova Política de Home Office',
    dataDocumento: daysFromNow(-15),
    status: 'enviado',
    criadoEm: daysAgo(15),
    atualizadoEm: daysAgo(14),
  },
  {
    id: '3',
    numero: 'PORT-002/2024',
    tipo: 'portaria',
    titulo: 'Portaria de Nomeação',
    conteudo: 'O Diretor Geral, no uso de suas atribuições...',
    destinatario: 'Departamento Pessoal',
    remetente: 'Diretoria Geral',
    assunto: 'Nomeação de Coordenador',
    dataDocumento: daysFromNow(-30),
    status: 'arquivado',
    criadoEm: daysAgo(30),
    atualizadoEm: daysAgo(25),
  },
]

export const DEFAULT_CONFIGURACOES: ConfiguracoesApp = {
  perfil: {
    nome: 'Usuário do Sistema',
    email: 'usuario@example.com',
    cargo: 'Analista',
    setor: 'Administração',
  },
  tema: 'system',
  notificacoes: {
    email: true,
    push: true,
    sms: false,
  },
  idioma: 'pt-BR',
}
