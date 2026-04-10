import type { Page, Locator } from '@playwright/test'
import { BasePage } from './base-page'

export class SolicitacoesPage extends BasePage {
  // Locators
  readonly heading: Locator
  readonly searchInput: Locator
  readonly statusFilter: Locator
  readonly prioridadeFilter: Locator
  readonly novaSolicitacaoButton: Locator
  readonly clearFiltersButton: Locator
  readonly dataTable: Locator
  readonly deleteDialog: Locator
  readonly viewDialog: Locator
  readonly subtitle: Locator

  constructor(page: Page) {
    super(page)
    this.heading = this.getHeading('Solicitações')
    this.subtitle = page.getByText('Gerencie solicitações e demandas')
    this.searchInput = page.getByPlaceholder('Buscar por título, descrição ou solicitante...')
    this.statusFilter = page.getByRole('combobox', { name: 'Status' })
    this.prioridadeFilter = page.getByRole('combobox', { name: 'Prioridade' })
    this.novaSolicitacaoButton = page.getByRole('button', { name: 'Nova Solicitação' })
    this.clearFiltersButton = page.getByRole('button', { name: 'Limpar' })
    this.dataTable = page.getByRole('table')
    this.deleteDialog = page.getByRole('alertdialog')
    this.viewDialog = page.getByRole('dialog').filter({ hasText: 'Detalhes da solicitação' })
  }

  async goto() {
    await super.goto('/solicitacoes')
  }

  async search(text: string) {
    await this.searchInput.fill(text)
  }

  async filterByStatus(status: string) {
    await this.statusFilter.click()
    await this.page.getByRole('option', { name: status }).click()
  }

  async filterByPrioridade(prioridade: string) {
    await this.prioridadeFilter.click()
    await this.page.getByRole('option', { name: prioridade }).click()
  }

  async clearFilters() {
    await this.clearFiltersButton.click()
  }

  findRowByText(text: string): Locator {
    return this.dataTable.getByRole('row').filter({ hasText: text })
  }

  private async getRowOrThrow(text: string): Promise<import('@playwright/test').Locator> {
    const rows = this.findRowByText(text)
    const count = await rows.count()
    if (count === 0) {
      throw new Error(`No row found for text: "${text}"`)
    }
    return rows.first()
  }

  async viewRowByText(text: string) {
    const row = await this.getRowOrThrow(text)
    await row.getByRole('button', { name: 'Visualizar' }).click()
  }

  async deleteRowByText(text: string) {
    const row = await this.getRowOrThrow(text)
    await row.getByRole('button', { name: 'Excluir' }).click()
  }

  async confirmDelete() {
    await this.deleteDialog.getByRole('button', { name: 'Excluir' }).click()
  }

  async cancelDelete() {
    await this.deleteDialog.getByRole('button', { name: 'Cancelar' }).click()
  }
}
