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
    this.deleteDialog = page.getByTestId('confirm-dialog')
    this.viewDialog = page.getByRole('dialog').filter({ hasText: 'Visualizacao do documento' })
  }

  async goto() {
    await super.goto('/documentos')
  }

  async search(text: string) {
    await this.searchInput.fill(text)
  }

  private async selectFilter(filterLocator: Locator, option: string) {
    await filterLocator.click()
    const optionLocator = this.page.getByRole('option', { name: option })
    await optionLocator.click()
    // Wait for dropdown to close and table to re-render
    await optionLocator.waitFor({ state: 'hidden', timeout: 5000 })
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

  async closeViewDialog() {
    await this.viewDialog.getByRole('button', { name: /fechar|close/i }).click()
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
