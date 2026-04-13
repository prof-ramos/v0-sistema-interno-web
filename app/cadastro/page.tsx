'use client'

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { Plus, Sparkles, User, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader, SectionCard } from '@/components/layout'
import { FormField, FormSection, ActionButtons } from '@/components/forms'
import { EmptyState } from '@/components/data'
import { ConfirmDialog, CadastroStatusBadge } from '@/components/feedback'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useAppStore } from '@/store/use-app-store'
import { useValidation } from '@/hooks/use-validation'
import { useAutoSave } from '@/hooks/use-debounce'
import { isDeepEqual } from '@/lib/utils'
import { cadastroSchema, maskCPFOrCNPJ, maskPhone, maskCEP } from '@/lib/validations'
import { UF_OPTIONS } from '@/lib/constants'
import type { CadastroForm, Cadastro } from '@/lib/types'

const initialFormData: CadastroForm = {
  nome: '',
  cpfCnpj: '',
  tipo: 'FISICA',
  email: '',
  telefone: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  observacoes: '',
  status: 'ATIVO',
}

export default function CadastroPage() {
  const { 
    rascunhos,
    saveRascunhoCadastro,
    clearRascunhoCadastro,
  } = useAppStore()

  const [localCadastros, setLocalCadastros] = useState<Cadastro[]>([])
  const [formData, setFormData] = useState<CadastroForm>(initialFormData)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const fetchCadastros = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/cadastros', { signal })
      if (!response.ok) throw new Error('Erro ao carregar cadastros')
      const result = await response.json()
      setLocalCadastros(Array.isArray(result) ? result : result.data || [])
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      toast.error('Não foi possível carregar a lista de cadastros.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchCadastros(controller.signal)
    return () => controller.abort()
  }, [fetchCadastros])

  const { touched, validateField, validateAll, setTouched, clearErrors, getFieldError } = useValidation({
    schema: cadastroSchema,
  })

  // Load draft on mount (once only)
  const hydratedRef = useRef(false)
  useEffect(() => {
    if (rascunhos.cadastro && !selectedId && !hydratedRef.current) {
      setFormData((prev) => ({ ...prev, ...rascunhos.cadastro }))
      hydratedRef.current = true
    }
  }, [rascunhos.cadastro, selectedId])

  const hasUnsavedDraftChanges = useMemo(
    () => !isDeepEqual(formData, initialFormData) && !isDeepEqual(formData, rascunhos.cadastro),
    [formData, rascunhos.cadastro]
  )

  // Auto-save draft
  useAutoSave(
    formData,
    (data) => {
      if (!selectedId) {
        saveRascunhoCadastro(data)
      }
    },
    1500,
    !selectedId && hasUnsavedDraftChanges
  )

  const handleFieldChange = useCallback((field: keyof CadastroForm, value: string) => {
    const nextData = { ...formData, [field]: value }
    setFormData(nextData)
    if (touched[field]) {
      validateField(field, value, nextData)
    }
  }, [formData, touched, validateField])

  const handleFieldBlur = useCallback((field: keyof CadastroForm) => {
    setTouched(field)
    validateField(field, formData[field], formData)
  }, [formData, setTouched, validateField])

  const handleSelectCadastro = useCallback((cadastro: Cadastro) => {
    setSelectedId(cadastro.id)
    setFormData({
      nome: cadastro.nome,
      cpfCnpj: cadastro.cpfCnpj,
      tipo: cadastro.tipo,
      email: cadastro.email,
      telefone: cadastro.telefone,
      cep: cadastro.cep,
      logradouro: cadastro.logradouro,
      numero: cadastro.numero,
      complemento: cadastro.complemento || '',
      bairro: cadastro.bairro,
      cidade: cadastro.cidade,
      uf: cadastro.uf,
      observacoes: cadastro.observacoes || '',
      status: cadastro.status,
    })
    clearErrors()
  }, [clearErrors])

  const handleNewCadastro = useCallback(() => {
    setSelectedId(null)
    setFormData(initialFormData)
    clearErrors()
    hydratedRef.current = false
  }, [clearErrors])

  const handleSubmit = useCallback(async () => {
    if (!validateAll(formData)) {
      toast.error('Por favor, corrija os erros no formulário.')
      return
    }

    setIsSubmitting(true)
    
    try {
      const url = selectedId ? `/api/cadastros/${selectedId}` : '/api/cadastros'
      const method = selectedId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao salvar cadastro')
      }

      toast.success(selectedId ? 'Cadastro atualizado com sucesso!' : 'Cadastro criado com sucesso!')
      
      if (!selectedId) {
        clearRascunhoCadastro()
      }
      
      handleNewCadastro()
      fetchCadastros()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar cadastro. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, selectedId, validateAll, clearRascunhoCadastro, handleNewCadastro, fetchCadastros])

  const handleDelete = useCallback((id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (itemToDelete) {
      try {
        const response = await fetch(`/api/cadastros/${itemToDelete}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Erro ao excluir')
        
        toast.success('Cadastro excluído com sucesso!')
        if (selectedId === itemToDelete) {
          handleNewCadastro()
        }
        fetchCadastros()
      } catch (error) {
        toast.error('Erro ao excluir cadastro.')
      } finally {
        setDeleteDialogOpen(false)
        setItemToDelete(null)
      }
    }
  }, [itemToDelete, selectedId, handleNewCadastro, fetchCadastros])

  const handleGenerateAI = useCallback(() => {
    toast.info('Funcionalidade de IA em desenvolvimento...', {
      description: 'Em breve você poderá gerar dados automaticamente.',
    })
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cadastro"
        subtitle="Gerencie cadastros de pessoas e empresas"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGenerateAI}>
              <Sparkles className="mr-2 size-4" />
              Gerar com IA
            </Button>
            <Button onClick={handleNewCadastro}>
              <Plus className="mr-2 size-4" />
              Novo Cadastro
            </Button>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Dados do Cadastro">
            <form noValidate onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              {/* Dados Principais */}
              <FormSection title="Dados Principais" description="Informações básicas do cadastro">
                <FormField
                  type="text"
                  label="Nome Completo"
                  name="nome"
                  value={formData.nome}
                  onChange={(v) => handleFieldChange('nome', v)}
                  onBlur={() => handleFieldBlur('nome')}
                  error={getFieldError('nome')}
                  required
                  placeholder="Digite o nome completo"
                  className="sm:col-span-2"
                />
                <FormField
                  type="text"
                  label="CPF/CNPJ"
                  name="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={(v) => handleFieldChange('cpfCnpj', v)}
                  onBlur={() => handleFieldBlur('cpfCnpj')}
                  error={getFieldError('cpfCnpj')}
                  mask={maskCPFOrCNPJ}
                  required
                  placeholder="000.000.000-00"
                />
                <FormField
                  type="select"
                  label="Tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={(v) => handleFieldChange('tipo', v)}
                  options={[
                    { value: 'FISICA', label: 'Pessoa Física' },
                    { value: 'JURIDICA', label: 'Pessoa Jurídica' },
                  ]}
                />
              </FormSection>

              <Separator />

              {/* Contato */}
              <FormSection title="Contato" description="Informações de contato">
                <FormField
                  type="email"
                  label="E-mail"
                  name="email"
                  value={formData.email}
                  onChange={(v) => handleFieldChange('email', v)}
                  onBlur={() => handleFieldBlur('email')}
                  error={getFieldError('email')}
                  required
                  placeholder="email@exemplo.com"
                />
                <FormField
                  type="tel"
                  label="Telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={(v) => handleFieldChange('telefone', v)}
                  onBlur={() => handleFieldBlur('telefone')}
                  error={getFieldError('telefone')}
                  mask={maskPhone}
                  required
                  placeholder="(00) 00000-0000"
                />
              </FormSection>

              <Separator />

              {/* Endereço */}
              <FormSection title="Endereço" description="Informações de localização">
                <FormField
                  type="text"
                  label="CEP"
                  name="cep"
                  value={formData.cep}
                  onChange={(v) => handleFieldChange('cep', v)}
                  onBlur={() => handleFieldBlur('cep')}
                  error={getFieldError('cep')}
                  mask={maskCEP}
                  required
                  placeholder="00000-000"
                />
                <FormField
                  type="text"
                  label="Logradouro"
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={(v) => handleFieldChange('logradouro', v)}
                  onBlur={() => handleFieldBlur('logradouro')}
                  error={getFieldError('logradouro')}
                  required
                  placeholder="Rua, Avenida, etc."
                />
                <FormField
                  type="text"
                  label="Número"
                  name="numero"
                  value={formData.numero}
                  onChange={(v) => handleFieldChange('numero', v)}
                  onBlur={() => handleFieldBlur('numero')}
                  error={getFieldError('numero')}
                  required
                  placeholder="123"
                />
                <FormField
                  type="text"
                  label="Complemento"
                  name="complemento"
                  value={formData.complemento || ''}
                  onChange={(v) => handleFieldChange('complemento', v)}
                  placeholder="Apto, Sala, etc."
                />
                <FormField
                  type="text"
                  label="Bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={(v) => handleFieldChange('bairro', v)}
                  onBlur={() => handleFieldBlur('bairro')}
                  error={getFieldError('bairro')}
                  required
                  placeholder="Nome do bairro"
                />
                <FormField
                  type="text"
                  label="Cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={(v) => handleFieldChange('cidade', v)}
                  onBlur={() => handleFieldBlur('cidade')}
                  error={getFieldError('cidade')}
                  required
                  placeholder="Nome da cidade"
                />
                <FormField
                  type="select"
                  label="UF"
                  name="uf"
                  value={formData.uf}
                  onChange={(v) => handleFieldChange('uf', v)}
                  onBlur={() => handleFieldBlur('uf')}
                  error={getFieldError('uf')}
                  options={UF_OPTIONS}
                  required
                  placeholder="Selecione o estado"
                />
                <FormField
                  type="select"
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={(v) => handleFieldChange('status', v)}
                  options={[
                    { value: 'ATIVO', label: 'Ativo' },
                    { value: 'INATIVO', label: 'Inativo' },
                    { value: 'PENDENTE', label: 'Pendente' },
                  ]}
                />
              </FormSection>

              <Separator />

              {/* Observações */}
              <FormSection title="Observações" description="Informações adicionais">
                <FormField
                  type="textarea"
                  label="Observações"
                  name="observacoes"
                  value={formData.observacoes || ''}
                  onChange={(v) => handleFieldChange('observacoes', v)}
                  placeholder="Digite observações adicionais..."
                  rows={3}
                  className="sm:col-span-2"
                />
              </FormSection>

              <ActionButtons
                onSubmit={handleSubmit}
                onCancel={selectedId ? handleNewCadastro : undefined}
                submitLabel={selectedId ? 'Atualizar' : 'Salvar'}
                cancelLabel="Cancelar"
                isSubmitting={isSubmitting}
              />
            </form>
          </SectionCard>
        </div>

        {/* Saved Items List */}
        <div>
          <SectionCard 
            title="Cadastros Salvos" 
            description={`${localCadastros.length} registros`}
            contentClassName="p-0"
          >
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : localCadastros.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={User}
                  title="Nenhum cadastro"
                  description="Crie seu primeiro cadastro usando o formulário ao lado."
                />
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="divide-y">
                  {localCadastros.map((cadastro) => (
                    <div
                      key={cadastro.id}
                      className={`flex items-center justify-between p-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                        selectedId === cadastro.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => handleSelectCadastro(cadastro)}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{cadastro.nome}</p>
                        <p className="truncate text-xs text-muted-foreground">{cadastro.email}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <CadastroStatusBadge status={cadastro.status} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          aria-label={`Excluir cadastro de ${cadastro.nome}`}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            handleDelete(cadastro.id)
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </SectionCard>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Cadastro"
        description="Tem certeza que deseja excluir este cadastro? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  )
}
