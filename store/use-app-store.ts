import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  AppState, 
  Cadastro, 
  CadastroForm,
  Solicitacao, 
  SolicitacaoForm,
  Documento,
  DocumentoForm,
  ConfiguracoesApp 
} from '@/lib/types'
import { 
  DEFAULT_CONFIGURACOES,
  MOCK_CADASTROS,
  MOCK_DOCUMENTOS,
  MOCK_SOLICITACOES,
} from '@/lib/mock-data'

// Gerar ID único
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Data atual ISO
function now(): string {
  return new Date().toISOString()
}

interface AppStore extends AppState {
  // Cadastros - Somente leitura local (populado via Fetch)
  setCadastros: (cadastros: Cadastro[]) => void
  
  // Solicitações (Manter local por ora conforme plano)
  addSolicitacao: (data: SolicitacaoForm) => Solicitacao
  updateSolicitacao: (id: string, data: Partial<SolicitacaoForm>) => void
  deleteSolicitacao: (id: string) => void
  
  // Documentos (Manter local por ora conforme plano)
  addDocumento: (data: DocumentoForm) => Documento
  updateDocumento: (id: string, data: Partial<DocumentoForm>) => void
  deleteDocumento: (id: string) => void
  
  // Configurações
  updateConfiguracoes: (data: Partial<ConfiguracoesApp>) => void

  // Rascunhos
  saveRascunhoCadastro: (data: Partial<CadastroForm>) => void
  clearRascunhoCadastro: () => void
  saveRascunhoSolicitacao: (data: Partial<SolicitacaoForm>) => void
  clearRascunhoSolicitacao: () => void
  saveRascunhoDocumento: (data: Partial<DocumentoForm>) => void
  clearRascunhoDocumento: () => void
  
  // Reset
  resetToMockData: () => void
}

const initialState: AppState = {
  cadastros: [],
  solicitacoes: MOCK_SOLICITACOES,
  documentos: MOCK_DOCUMENTOS,
  configuracoes: DEFAULT_CONFIGURACOES,
  rascunhos: {},
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // ===== CADASTROS =====
      setCadastros: (cadastros) => set({ cadastros }),
      
      // ===== SOLICITAÇÕES =====
      addSolicitacao: (data) => {
        const novaSolicitacao: Solicitacao = {
          ...data,
          id: generateId(),
          criadoEm: now(),
          atualizadoEm: now(),
        }
        set((state) => ({
          solicitacoes: [...state.solicitacoes, novaSolicitacao],
        }))
        return novaSolicitacao
      },
      
      updateSolicitacao: (id, data) => {
        set((state) => ({
          solicitacoes: state.solicitacoes.map((s) =>
            s.id === id ? { ...s, ...data, atualizadoEm: now() } : s
          ),
        }))
      },
      
      deleteSolicitacao: (id) => {
        set((state) => ({
          solicitacoes: state.solicitacoes.filter((s) => s.id !== id),
        }))
      },
      
      // ===== DOCUMENTOS =====
      addDocumento: (data) => {
        const novoDocumento: Documento = {
          ...data,
          id: generateId(),
          criadoEm: now(),
          atualizadoEm: now(),
        }
        set((state) => ({
          documentos: [...state.documentos, novoDocumento],
        }))
        return novoDocumento
      },
      
      updateDocumento: (id, data) => {
        set((state) => ({
          documentos: state.documentos.map((d) =>
            d.id === id ? { ...d, ...data, atualizadoEm: now() } : d
          ),
        }))
      },
      
      deleteDocumento: (id) => {
        set((state) => ({
          documentos: state.documentos.filter((d) => d.id !== id),
        }))
      },
      
      // ===== CONFIGURAÇÕES =====
      updateConfiguracoes: (data) => {
        set((state) => ({
          configuracoes: {
            ...state.configuracoes,
            ...data,
            perfil: data.perfil 
              ? { ...state.configuracoes.perfil, ...data.perfil }
              : state.configuracoes.perfil,
            notificacoes: data.notificacoes
              ? { ...state.configuracoes.notificacoes, ...data.notificacoes }
              : state.configuracoes.notificacoes,
          },
        }))
      },

      // ===== RASCUNHOS =====
      saveRascunhoCadastro: (data) => {
        set((state) => ({
          rascunhos: { ...state.rascunhos, cadastro: data },
        }))
      },
      
      clearRascunhoCadastro: () => {
        set((state) => ({
          rascunhos: { ...state.rascunhos, cadastro: undefined },
        }))
      },
      
      saveRascunhoSolicitacao: (data) => {
        set((state) => ({
          rascunhos: { ...state.rascunhos, solicitacao: data },
        }))
      },
      
      clearRascunhoSolicitacao: () => {
        set((state) => ({
          rascunhos: { ...state.rascunhos, solicitacao: undefined },
        }))
      },
      
      saveRascunhoDocumento: (data) => {
        set((state) => ({
          rascunhos: { ...state.rascunhos, documento: data },
        }))
      },
      
      clearRascunhoDocumento: () => {
        set((state) => ({
          rascunhos: { ...state.rascunhos, documento: undefined },
        }))
      },
      
      // ===== RESET =====
      resetToMockData: () => {
        set(initialState)
      },
    }),
    {
      name: 'sistema-interno-storage-v2',
      partialize: (state) => ({
        // ⚠ PII Compliance: 
        // 1. Cadastros removidos (persistência no backend Prisma)
        // 2. Perfil removido (PII sensível: nome, email)
        solicitacoes: state.solicitacoes,
        documentos: state.documentos,
        configuracoes: {
          ...state.configuracoes,
          perfil: undefined, // Reset do perfil no reload para segurança até migração de API
        },
        rascunhos: state.rascunhos,
      }),
    }
  )
)

