import type { Page, Locator } from '@playwright/test'
import { BasePage } from './base-page'

export class DocumentosPage extends BasePage {
  // Locators
  readonly heading: Locator
  readonly searchInput: Locator
  readonly tipoFilter: Locator
  readonly statusFilter: Locator
  readonly novoDocumentoButton: Locator
  readonly clearFiltersButton: Locator
  readonly dataTable: Locator
  readonly deleteDialog: Locator
  readonly viewDialog: Locator
  readonly pageDescription: Locator

  constructor(page: Page) {
    super(page)
    this.heading = this.getHeading('Documentos')
    this.pageDescription = page.getByTestId('page-description')
    this.searchInput = page.getByPlaceholder('Buscar por numero, titulo, assunto ou destinatario...')
    this.tipoFilter = page.getByRole('combobox', { name: 'Tipo' })
    this.statusFilter = page.getByRole('combobox', { name: 'Status' })
    this.novoDocumentoButton = page.getByRole('button', { name: 'Novo Documento' })
    this.clearFiltersButton = page.getByRole('button', { name: 'Limpar' })
    this.dataTable = page.getByRole('table')
    this.deleteDialog = page.getByRole('alertdialog', { name: 'Excluir Documento' })
    this.viewDialog = page.getByRole('dialog').filter({ hasText: 'Visualizacao do documento' })
  }

  async goto() {
    await super.goto('/documentos')
  }

  async search(text: string) {
    await this.searchInput.fill(text)
    await this.page.waitForTimeout(500)
  }

  private async selectFilter(filterLocator: Locator, option: string) {
    await filterLocator.click()
    await this.page.getByRole('option', { name: option }).click()
  }

  async filterByTipo(tipo: string) {
    await this.selectFilter(this.tipoFilter, tipo)
  }

  async filterByStatus(status: string) {
    await this.selectFilter(this.statusFilter, status)
  }

  async clearFilters() {
    await this.clearFiltersButton.click()
  }

  findRowByText(text: string): Locator {
    return this.dataTable.getByRole('row').filter({ hasText: text })
  }

  async viewRowByText(text: string) {
    const row = this.findRowByText(text).first()
    await row.getByRole('button', { name: 'Visualizar' }).click()
  }

  async closeViewDialog() {
    await this.viewDialog.getByRole('button', { name: /fechar|close/i }).click()
  }

  async deleteRowByText(text: string) {
    const row = this.findRowByText(text).first()
    await row.getByRole('button', { name: 'Excluir' }).click()
  }

  async confirmDelete() {
    await this.deleteDialog.getByRole('button', { name: 'Excluir' }).click()
  }

  async cancelDelete() {
    await this.deleteDialog.getByRole('button', { name: 'Cancelar' }).click()
  }
}
