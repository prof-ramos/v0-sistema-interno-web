'use client'

import { useState, useMemo, useCallback } from 'react'
import { Plus, Eye, Trash2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader, SectionCard } from '@/components/layout'
import { DataTable, FiltersBar } from '@/components/data'
import { DocumentoStatusBadge, ConfirmDialog } from '@/components/feedback'
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
  TIPO_DOCUMENTO_LABELS,
  STATUS_DOCUMENTO_LABELS,
} from '@/lib/constants'
import type { Documento, Column, FilterConfig } from '@/lib/types'

const filterConfigs: FilterConfig[] = [
  {
    key: 'tipo',
    label: 'Tipo',
    type: 'select',
    options: Object.entries(TIPO_DOCUMENTO_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: Object.entries(STATUS_DOCUMENTO_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
]

export default function DocumentosPage() {
  const { documentos, deleteDocumento } = useAppStore()
  
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [selectedDocumento, setSelectedDocumento] = useState<Documento | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const filteredData = useMemo(() => {
    return documentos.filter((item) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch = 
          item.titulo.toLowerCase().includes(searchLower) ||
          item.numero.toLowerCase().includes(searchLower) ||
          item.assunto.toLowerCase().includes(searchLower) ||
          item.destinatario.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      
      // Tipo filter
      if (filters.tipo && filters.tipo !== 'all' && item.tipo !== filters.tipo) {
        return false
      }
      
      // Status filter
      if (filters.status && filters.status !== 'all' && item.status !== filters.status) {
        return false
      }
      
      return true
    })
  }, [documentos, search, filters])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch('')
    setFilters({})
  }, [])

  const handleView = useCallback((documento: Documento) => {
    setSelectedDocumento(documento)
    setViewDialogOpen(true)
  }, [])

  const handleDelete = useCallback((id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }, [])

  const confirmDelete = useCallback(() => {
    if (itemToDelete) {
      deleteDocumento(itemToDelete)
      toast.success('Documento excluído com sucesso!')
      setItemToDelete(null)
    }
  }, [itemToDelete, deleteDocumento])

  const columns: Column<Documento>[] = useMemo(() => [
    {
      key: 'numero',
      header: 'Número',
      sortable: true,
      width: '120px',
      render: (item) => (
        <span className="font-mono text-sm">{item.numero}</span>
      ),
    },
    {
      key: 'titulo',
      header: 'Título',
      sortable: true,
      render: (item) => (
        <div className="min-w-0">
          <p className="truncate font-serif font-bold">{item.titulo}</p>
          <p className="truncate text-xs text-muted-foreground">{item.assunto}</p>
        </div>
      ),
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (item) => (
        <span className="text-sm capitalize">
          {TIPO_DOCUMENTO_LABELS[item.tipo]}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <DocumentoStatusBadge status={item.status} />,
    },
    {
      key: 'dataDocumento',
      header: 'Data',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.dataDocumento).toLocaleDateString('pt-BR')}
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
            aria-label={`Visualizar documento: ${item.numero} - ${item.titulo}`}
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
            aria-label={`Excluir documento: ${item.numero} - ${item.titulo}`}
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
    <div className="space-y-8">
      <PageHeader
        title="Documentos"
        subtitle="Gerencie ofícios, memorandos e outros documentos"
        actions={
          <Button onClick={() => toast.info('Editor de documentos em desenvolvimento')}>
            <Plus className="mr-2 size-4" />
            Novo Documento
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
            placeholder="Buscar por numero, titulo, assunto ou destinatario..."
          />

          <DataTable
            data={filteredData}
            columns={columns}
            keyExtractor={(item) => item.id}
            onRowClick={handleView}
            emptyMessage="Nenhum documento encontrado."
          />
        </div>
      </SectionCard>

      {/* Document Preview Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              {selectedDocumento?.numero} - {selectedDocumento?.titulo}
            </DialogTitle>
            <DialogDescription>
              Visualizacao do documento
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocumento && (
            <div className="space-y-6">
              <div className="flex gap-2">
                <DocumentoStatusBadge status={selectedDocumento.status} />
                <span className="text-sm text-muted-foreground capitalize">
                  {TIPO_DOCUMENTO_LABELS[selectedDocumento.tipo]}
                </span>
              </div>
              
              {/* Document Preview */}
              <div className="rounded-lg border bg-white p-6 document-text">
                <div className="space-y-4 text-sm">
                  <div className="text-center space-y-1">
                    <p className="font-bold uppercase">{TIPO_DOCUMENTO_LABELS[selectedDocumento.tipo]}</p>
                    <p className="font-semibold">{selectedDocumento.numero}</p>
                  </div>
                  
                  <div className="text-right text-muted-foreground">
                    {new Date(selectedDocumento.dataDocumento).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  
                  <div className="space-y-1">
                    <p><strong>De:</strong> {selectedDocumento.remetente}</p>
                    <p><strong>Para:</strong> {selectedDocumento.destinatario}</p>
                    <p><strong>Assunto:</strong> {selectedDocumento.assunto}</p>
                  </div>
                  
                  <div className="pt-4 border-t whitespace-pre-wrap leading-relaxed">
                    {selectedDocumento.conteudo}
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Criado em: {new Date(selectedDocumento.criadoEm).toLocaleString('pt-BR')}
                {selectedDocumento.atualizadoEm !== selectedDocumento.criadoEm && (
                  <> | Atualizado em: {new Date(selectedDocumento.atualizadoEm).toLocaleString('pt-BR')}</>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Documento"
        description="Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  )
}
