'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Plus, Save, Trash2, Sparkles, User } from 'lucide-react'
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
import { cadastroValidationRules, maskCPFOrCNPJ, maskPhone, maskCEP } from '@/lib/validations'
import { UF_OPTIONS } from '@/lib/constants'
import type { CadastroForm, Cadastro } from '@/lib/types'

const initialFormData: CadastroForm = {
  nome: '',
  cpfCnpj: '',
  tipo: 'pessoa_fisica',
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
  status: 'ativo',
}

export default function CadastroPage() {
  const { 
    cadastros, 
    addCadastro, 
    updateCadastro, 
    deleteCadastro,
    rascunhos,
    saveRascunhoCadastro,
    clearRascunhoCadastro,
  } = useAppStore()

  const [formData, setFormData] = useState<CadastroForm>(initialFormData)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const { errors, touched, validateField, validateAll, setTouched, clearErrors, getFieldError } = useValidation({
    rules: cadastroValidationRules,
  })

  // Load draft on mount
  useEffect(() => {
    if (rascunhos.cadastro && !selectedId) {
      setFormData({ ...initialFormData, ...rascunhos.cadastro })
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
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      if (field in cadastroValidationRules) {
        validateField(field as keyof typeof cadastroValidationRules, value)
      }
    }
  }, [touched, validateField])

  const handleFieldBlur = useCallback((field: keyof typeof cadastroValidationRules) => {
    setTouched(field)
    validateField(field, formData[field])
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
  }, [clearErrors])

  const handleSubmit = useCallback(async () => {
    if (!validateAll(formData)) {
      toast.error('Por favor, corrija os erros no formulario.')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      if (selectedId) {
        updateCadastro(selectedId, formData)
        toast.success('Cadastro atualizado com sucesso!')
      } else {
        addCadastro(formData)
        clearRascunhoCadastro()
        toast.success('Cadastro criado com sucesso!')
      }
      
      handleNewCadastro()
    } catch (error) {
      toast.error('Erro ao salvar cadastro. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, selectedId, validateAll, updateCadastro, addCadastro, clearRascunhoCadastro, handleNewCadastro])

  const handleDelete = useCallback((id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }, [])

  const confirmDelete = useCallback(() => {
    if (itemToDelete) {
      deleteCadastro(itemToDelete)
      toast.success('Cadastro excluído com sucesso!')
      if (selectedId === itemToDelete) {
        handleNewCadastro()
      }
      setItemToDelete(null)
    }
  }, [itemToDelete, deleteCadastro, selectedId, handleNewCadastro])

  const handleGenerateAI = useCallback(() => {
    toast.info('Funcionalidade de IA em desenvolvimento...', {
      description: 'Em breve voce podera gerar dados automaticamente.',
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
            <form noValidate onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
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
                  onChange={(v) => handleFieldChange('tipo', v as 'pessoa_fisica' | 'pessoa_juridica')}
                  options={[
                    { value: 'pessoa_fisica', label: 'Pessoa Fisica' },
                    { value: 'pessoa_juridica', label: 'Pessoa Juridica' },
                  ]}
                />
              </FormSection>

              <Separator />

              {/* Contato */}
              <FormSection title="Contato" description="Informacoes de contato">
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

              {/* Endereco */}
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
                  label="Numero"
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
                  onChange={(v) => handleFieldChange('status', v as 'ativo' | 'inativo' | 'pendente')}
                  options={[
                    { value: 'ativo', label: 'Ativo' },
                    { value: 'inativo', label: 'Inativo' },
                    { value: 'pendente', label: 'Pendente' },
                  ]}
                />
              </FormSection>

              <Separator />

              {/* Observacoes */}
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
            description={`${cadastros.length} registros`}
            contentClassName="p-0"
          >
            {cadastros.length === 0 ? (
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
                  {cadastros.map((cadastro) => (
                    <div
                      key={cadastro.id}
                      className={`flex items-center justify-between p-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                        selectedId === cadastro.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => handleSelectCadastro(cadastro)}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-serif font-bold">{cadastro.nome}</p>
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
