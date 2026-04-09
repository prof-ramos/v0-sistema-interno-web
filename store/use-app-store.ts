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
  MOCK_CADASTROS, 
  MOCK_SOLICITACOES, 
  MOCK_DOCUMENTOS,
  DEFAULT_CONFIGURACOES 
} from '@/lib/constants'

// Gerar ID único
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Data atual ISO
function now(): string {
  return new Date().toISOString()
}

interface AppStore extends AppState {
  // Cadastros
  addCadastro: (data: CadastroForm) => Cadastro
  updateCadastro: (id: string, data: Partial<CadastroForm>) => void
  deleteCadastro: (id: string) => void
  
  // Solicitações
  addSolicitacao: (data: SolicitacaoForm) => Solicitacao
  updateSolicitacao: (id: string, data: Partial<SolicitacaoForm>) => void
  deleteSolicitacao: (id: string) => void
  
  // Documentos
  addDocumento: (data: DocumentoForm) => Documento
  updateDocumento: (id: string, data: Partial<DocumentoForm>) => void
  deleteDocumento: (id: string) => void
  
  // Configurações
  updateConfiguracoes: (data: Partial<ConfiguracoesApp>) => void
  
  // UI
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  
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
  cadastros: MOCK_CADASTROS,
  solicitacoes: MOCK_SOLICITACOES,
  documentos: MOCK_DOCUMENTOS,
  configuracoes: DEFAULT_CONFIGURACOES,
  sidebarCollapsed: false,
  rascunhos: {},
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // ===== CADASTROS =====
      addCadastro: (data) => {
        const novoCadastro: Cadastro = {
          ...data,
          id: generateId(),
          criadoEm: now(),
          atualizadoEm: now(),
        }
        set((state) => ({
          cadastros: [...state.cadastros, novoCadastro],
        }))
        return novoCadastro
      },
      
      updateCadastro: (id, data) => {
        set((state) => ({
          cadastros: state.cadastros.map((c) =>
            c.id === id ? { ...c, ...data, atualizadoEm: now() } : c
          ),
        }))
      },
      
      deleteCadastro: (id) => {
        set((state) => ({
          cadastros: state.cadastros.filter((c) => c.id !== id),
        }))
      },
      
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
      
      // ===== UI =====
      toggleSidebar: () => {
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        }))
      },
      
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed })
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
      name: 'sistema-interno-storage',
      partialize: (state) => ({
        cadastros: state.cadastros,
        solicitacoes: state.solicitacoes,
        documentos: state.documentos,
        configuracoes: state.configuracoes,
        rascunhos: state.rascunhos,
      }),
    }
  )
)

// Seletores para uso otimizado
export const useCadastros = () => useAppStore((state) => state.cadastros)
export const useSolicitacoes = () => useAppStore((state) => state.solicitacoes)
export const useDocumentos = () => useAppStore((state) => state.documentos)
export const useConfiguracoes = () => useAppStore((state) => state.configuracoes)
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed)
export const useRascunhos = () => useAppStore((state) => state.rascunhos)
