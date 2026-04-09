'use client'

import { useState, useMemo, useCallback } from 'react'
import { Plus, Eye, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader, SectionCard } from '@/components/layout'
import { DataTable, FiltersBar } from '@/components/data'
import { StatusBadge, PrioridadeBadge, ConfirmDialog } from '@/components/feedback'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppStore } from '@/store/use-app-store'
import { 
  STATUS_SOLICITACAO_LABELS, 
  PRIORIDADE_LABELS,
} from '@/lib/constants'
import type { Solicitacao, Column, FilterConfig } from '@/lib/types'

const filterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: Object.entries(STATUS_SOLICITACAO_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    key: 'prioridade',
    label: 'Prioridade',
    type: 'select',
    options: Object.entries(PRIORIDADE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
]

export default function SolicitacoesPage() {
  const { solicitacoes, deleteSolicitacao } = useAppStore()
  
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitacao | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const filteredData = useMemo(() => {
    return solicitacoes.filter((item) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch = 
          item.titulo.toLowerCase().includes(searchLower) ||
          item.descricao.toLowerCase().includes(searchLower) ||
          item.solicitanteNome.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      
      // Status filter
      if (filters.status && filters.status !== 'all' && item.status !== filters.status) {
        return false
      }
      
      // Prioridade filter
      if (filters.prioridade && filters.prioridade !== 'all' && item.prioridade !== filters.prioridade) {
        return false
      }
      
      return true
    })
  }, [solicitacoes, search, filters])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch('')
    setFilters({})
  }, [])

  const handleView = useCallback((solicitacao: Solicitacao) => {
    setSelectedSolicitacao(solicitacao)
    setViewDialogOpen(true)
  }, [])

  const handleDelete = useCallback((id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }, [])

  const confirmDelete = useCallback(() => {
    if (itemToDelete) {
      deleteSolicitacao(itemToDelete)
      toast.success('Solicitacao excluida com sucesso!')
      setItemToDelete(null)
    }
  }, [itemToDelete, deleteSolicitacao])

  const columns: Column<Solicitacao>[] = useMemo(() => [
    {
      key: 'titulo',
      header: 'Titulo',
      sortable: true,
      render: (item) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{item.titulo}</p>
          <p className="truncate text-xs text-muted-foreground">{item.tipo}</p>
        </div>
      ),
    },
    {
      key: 'solicitanteNome',
      header: 'Solicitante',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'prioridade',
      header: 'Prioridade',
      render: (item) => <PrioridadeBadge prioridade={item.prioridade} />,
    },
    {
      key: 'criadoEm',
      header: 'Data',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.criadoEm).toLocaleDateString('pt-BR')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '100px',
      render: (item) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={(e) => {
              e.stopPropagation()
              handleView(item)
            }}
          >
            <Eye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(item.id)
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ], [handleView, handleDelete])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Solicitacoes"
        subtitle="Gerencie solicitacoes e demandas"
        actions={
          <Button onClick={() => toast.info('Formulario de nova solicitacao em desenvolvimento')}>
            <Plus className="mr-2 size-4" />
            Nova Solicitacao
          </Button>
        }
      />

      <SectionCard>
        <div className="space-y-4">
          <FiltersBar
            search={search}
            onSearchChange={setSearch}
            filters={filterConfigs}
            filterValues={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            placeholder="Buscar por titulo, descricao ou solicitante..."
          />

          <DataTable
            data={filteredData}
            columns={columns}
            keyExtractor={(item) => item.id}
            onRowClick={handleView}
            emptyMessage="Nenhuma solicitacao encontrada."
          />
        </div>
      </SectionCard>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedSolicitacao?.titulo}</DialogTitle>
            <DialogDescription>
              Detalhes da solicitacao
            </DialogDescription>
          </DialogHeader>
          
          {selectedSolicitacao && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <StatusBadge status={selectedSolicitacao.status} />
                <PrioridadeBadge prioridade={selectedSolicitacao.prioridade} />
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Tipo</p>
                  <p>{selectedSolicitacao.tipo}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Solicitante</p>
                  <p>{selectedSolicitacao.solicitanteNome}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Descricao</p>
                  <p className="whitespace-pre-wrap">{selectedSolicitacao.descricao}</p>
                </div>
                {selectedSolicitacao.dataLimite && (
                  <div>
                    <p className="font-medium text-muted-foreground">Data Limite</p>
                    <p>{new Date(selectedSolicitacao.dataLimite).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
                {selectedSolicitacao.responsavelNome && (
                  <div>
                    <p className="font-medium text-muted-foreground">Responsavel</p>
                    <p>{selectedSolicitacao.responsavelNome}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium text-muted-foreground">Criado em</p>
                  <p>{new Date(selectedSolicitacao.criadoEm).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Solicitacao"
        description="Tem certeza que deseja excluir esta solicitacao? Esta acao nao pode ser desfeita."
        confirmLabel="Excluir"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  )
}
