'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Save, User, Palette, Bell, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader, SectionCard } from '@/components/layout'
import { FormField, FormSection } from '@/components/forms'
import { ConfirmDialog } from '@/components/feedback'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAppStore } from '@/store/use-app-store'
import { useAutoSave } from '@/hooks/use-debounce'
import type { ConfiguracoesApp } from '@/lib/types'

export default function ConfiguracoesPage() {
  const { configuracoes, updateConfiguracoes, resetToMockData } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  
  const [perfil, setPerfil] = useState(configuracoes.perfil)
  const [notificacoes, setNotificacoes] = useState(configuracoes.notificacoes)

  // Hydration fix for theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync with store
  useEffect(() => {
    setPerfil(configuracoes.perfil)
    setNotificacoes(configuracoes.notificacoes)
  }, [configuracoes])

  // Auto-save profile
  const { isSaving: isSavingPerfil } = useAutoSave(
    perfil,
    (data) => {
      updateConfiguracoes({ perfil: data })
    },
    1000,
    JSON.stringify(perfil) !== JSON.stringify(configuracoes.perfil)
  )

  // Auto-save notifications
  useAutoSave(
    notificacoes,
    (data) => {
      updateConfiguracoes({ notificacoes: data })
    },
    500,
    JSON.stringify(notificacoes) !== JSON.stringify(configuracoes.notificacoes)
  )

  const handlePerfilChange = useCallback((field: keyof typeof perfil, value: string) => {
    setPerfil((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleNotificacaoChange = useCallback((field: keyof typeof notificacoes, value: boolean) => {
    setNotificacoes((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleThemeChange = useCallback((newTheme: string) => {
    setTheme(newTheme)
    updateConfiguracoes({ tema: newTheme as ConfiguracoesApp['tema'] })
    toast.success('Tema alterado com sucesso!')
  }, [setTheme, updateConfiguracoes])

  const handleReset = useCallback(() => {
    resetToMockData()
    toast.success('Dados resetados para o estado inicial!')
    setResetDialogOpen(false)
  }, [resetToMockData])

  const handleSaveAll = useCallback(() => {
    updateConfiguracoes({ 
      perfil, 
      notificacoes,
      tema: theme as ConfiguracoesApp['tema'],
    })
    toast.success('Configuracoes salvas com sucesso!')
  }, [perfil, notificacoes, theme, updateConfiguracoes])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        subtitle="Personalize sua experiência no sistema"
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setResetDialogOpen(true)}
            >
              <RotateCcw className="mr-2 size-4" />
              Resetar Dados
            </Button>
            <Button onClick={handleSaveAll}>
              <Save className="mr-2 size-4" />
              Salvar Tudo
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Perfil */}
        <SectionCard
          title="Perfil"
          description="Informacoes pessoais e de contato"
          actions={
            isSavingPerfil && (
              <span className="text-xs text-muted-foreground animate-subtle-pulse">
                Salvando...
              </span>
            )
          }
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="size-8" />
            </div>
            <div>
              <p className="font-medium">{perfil.nome}</p>
              <p className="text-sm text-muted-foreground">{perfil.cargo}</p>
            </div>
          </div>
          
          <FormSection title="Dados Pessoais">
            <FormField
              type="text"
              label="Nome"
              name="nome"
              value={perfil.nome}
              onChange={(v) => handlePerfilChange('nome', v)}
              placeholder="Seu nome completo"
            />
            <FormField
              type="email"
              label="E-mail"
              name="email"
              value={perfil.email}
              onChange={(v) => handlePerfilChange('email', v)}
              placeholder="seu@email.com"
            />
            <FormField
              type="text"
              label="Cargo"
              name="cargo"
              value={perfil.cargo}
              onChange={(v) => handlePerfilChange('cargo', v)}
              placeholder="Seu cargo"
            />
            <FormField
              type="text"
              label="Setor"
              name="setor"
              value={perfil.setor}
              onChange={(v) => handlePerfilChange('setor', v)}
              placeholder="Seu setor"
            />
          </FormSection>
        </SectionCard>

        {/* Aparencia */}
        <SectionCard
          title="Aparência"
          description="Personalize a interface do sistema"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
                <Palette className="size-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Tema</p>
                <p className="text-sm text-muted-foreground">
                  Escolha entre claro, escuro ou automático
                </p>
              </div>
            </div>
            
            {mounted && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Claro' },
                  { value: 'dark', label: 'Escuro' },
                  { value: 'system', label: 'Sistema' },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={theme === option.value ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => handleThemeChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </SectionCard>

        {/* Notificacoes */}
        <SectionCard
          title="Notificações"
          description="Configure como deseja receber alertas"
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
                <Bell className="size-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium">Preferências de Notificação</p>
                <p className="text-sm text-muted-foreground">
                  Escolha como deseja ser notificado
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="text-base">
                    Notificações por E-mail
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações importantes no seu e-mail
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificacoes.email}
                  onCheckedChange={(v) => handleNotificacaoChange('email', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications" className="text-base">
                    Notificações Push
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas em tempo real no navegador
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notificacoes.push}
                  onCheckedChange={(v) => handleNotificacaoChange('push', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications" className="text-base">
                    Notificações por SMS
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba mensagens de texto para alertas urgentes
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notificacoes.sms}
                  onCheckedChange={(v) => handleNotificacaoChange('sms', v)}
                />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Reset Confirmation */}
      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="Resetar Dados"
        description="Tem certeza que deseja resetar todos os dados para o estado inicial? Isso irá restaurar os dados de exemplo e remover todas as alterações feitas. Esta ação não pode ser desfeita."
        confirmLabel="Resetar"
        onConfirm={handleReset}
        variant="destructive"
      />
    </div>
  )
}

