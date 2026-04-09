import { test, expect } from '@playwright/test'
import { DocumentosPage } from './pages/documentos-page'

const SEED_ROW_COUNT = 4 // 3 data rows + 1 header row

test.describe('Documentos', () => {
  let pageObj: DocumentosPage

  test.beforeEach(async ({ page }) => {
    pageObj = new DocumentosPage(page)
    await pageObj.clearState()
    await pageObj.goto()
  })

  test('should render page with header and table', async () => {
    await expect(pageObj.heading).toBeVisible()
    await expect(pageObj.pageDescription).toBeVisible()
    await expect(pageObj.novoDocumentoButton).toBeVisible()
    await expect(pageObj.dataTable).toBeVisible()
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(SEED_ROW_COUNT)
  })

  test('should search documents by text', async () => {
    await pageObj.search('OF-001')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(2) // 1 data + 1 header

    await pageObj.search('')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(SEED_ROW_COUNT)

    await pageObj.search('Secretaria')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(2)
  })

  test('should filter by Tipo', async () => {
    await pageObj.filterByTipo('Memorando')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(2)

    await pageObj.filterByTipo('Ofício')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(2)
  })

  test('should filter by Status', async () => {
    await pageObj.filterByStatus('Finalizado')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(2)

    await pageObj.filterByStatus('Enviado')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(2)

    await pageObj.filterByStatus('Arquivado')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(2)
  })

  test('should filter by Tipo and Status combined', async () => {
    await pageObj.filterByTipo('Ofício')
    await pageObj.filterByStatus('Finalizado')
    // Assuming our seed data has 1 Ofício Finalizado + 1 header = 2 rows
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(2)
  })

  test('should clear filters', async () => {
    await pageObj.search('OF-001')
    await expect(pageObj.clearFiltersButton).toBeVisible()

    await pageObj.clearFilters()
    await expect(pageObj.searchInput).toHaveValue('')
    await expect(pageObj.tipoFilter).toContainText('Tipo')
    await expect(pageObj.statusFilter).toContainText('Status')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(SEED_ROW_COUNT)
  })

  test('should view document details in dialog', async () => {
    await pageObj.viewRowByText('OF-001/2024')
    await expect(pageObj.viewDialog).toBeVisible()
    await expect(pageObj.viewDialog.getByRole('heading')).toContainText('OF-001/2024')
    await expect(pageObj.viewDialog.getByRole('heading')).toContainText('Ofício de Comunicação')
    
    await pageObj.closeViewDialog()
    await expect(pageObj.viewDialog).toBeHidden()
  })

  test('should delete document with confirmation', async () => {
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(SEED_ROW_COUNT)

    await pageObj.deleteRowByText('OF-001/2024')
    await expect(pageObj.deleteDialog).toBeVisible()
    await pageObj.confirmDelete()

    await expect(pageObj.getToast('Documento excluído com sucesso!')).toBeVisible()
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(SEED_ROW_COUNT - 1)
  })

  test('should cancel delete operation', async () => {
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(SEED_ROW_COUNT)

    await pageObj.deleteRowByText('OF-001/2024')
    await expect(pageObj.deleteDialog).toBeVisible()
    await pageObj.cancelDelete()

    await expect(pageObj.deleteDialog).not.toBeVisible()
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(SEED_ROW_COUNT)
  })
})
