import { test, expect } from '@playwright/test'
import { SolicitacoesPage } from './pages/solicitacoes-page'

const SEED_ROW_COUNT = 4 // 3 data rows + 1 header row
const EXPECTED_FILTERED_COUNT = 2 // 1 data row + 1 header row
const SEED_TITLE = 'Solicitação de Férias'
const SEED_NAME = 'Maria Silva Santos'

test.describe('Solicitações', () => {
  test.describe.configure({ mode: 'default' })

  let pageObj: SolicitacoesPage

  test.beforeEach(async ({ page }) => {
    pageObj = new SolicitacoesPage(page)
    await pageObj.clearState()
    await pageObj.goto()
  })

  test('should render page with header and table', async () => {
    await expect(pageObj.heading).toBeVisible()
    await expect(pageObj.subtitle).toBeVisible()
    await expect(pageObj.novaSolicitacaoButton).toBeVisible()
    await expect(pageObj.dataTable).toBeVisible()
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(SEED_ROW_COUNT)
  })

  test('should search solicitações by text', async () => {
    await pageObj.search('Férias')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(EXPECTED_FILTERED_COUNT)
    await expect(pageObj.dataTable.getByRole('row').nth(1)).toContainText('Férias')

    await pageObj.search('')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(SEED_ROW_COUNT)
    await expect(pageObj.dataTable.getByRole('row').nth(1)).toContainText(SEED_TITLE)

    await pageObj.search('Tech Solutions')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(EXPECTED_FILTERED_COUNT)
    await expect(pageObj.dataTable.getByRole('row').nth(1)).toContainText('Tech Solutions')
  })

  test('should filter by Status', async () => {
    await pageObj.filterByStatus('Pendente')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(EXPECTED_FILTERED_COUNT)

    await pageObj.filterByStatus('Em Análise')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(EXPECTED_FILTERED_COUNT)

    await pageObj.filterByStatus('Aprovada')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(EXPECTED_FILTERED_COUNT)
  })

  test('should filter by Prioridade', async () => {
    await pageObj.filterByPrioridade('Média')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(EXPECTED_FILTERED_COUNT)

    await pageObj.filterByPrioridade('Alta')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(EXPECTED_FILTERED_COUNT)

    await pageObj.filterByPrioridade('Urgente')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(EXPECTED_FILTERED_COUNT)
  })

  test('should clear filters', async () => {
    await pageObj.search('Férias')
    await pageObj.filterByStatus('Pendente')
    await pageObj.filterByPrioridade('Urgente')
    
    await expect(pageObj.searchInput).toHaveValue('Férias')
    await expect(pageObj.statusFilter).toContainText('Pendente')
    await expect(pageObj.prioridadeFilter).toContainText('Urgente')
    await expect(pageObj.clearFiltersButton).toBeVisible()

    await pageObj.clearFilters()
    await expect(pageObj.searchInput).toHaveValue('')
    await expect(pageObj.statusFilter).toContainText('Status')
    await expect(pageObj.prioridadeFilter).toContainText('Prioridade')
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(SEED_ROW_COUNT)
  })

  test('should view solicitation details in dialog', async () => {
    await pageObj.viewRowByText(SEED_TITLE)
    await expect(pageObj.viewDialog).toBeVisible()
    await expect(pageObj.viewDialog.getByRole('heading', { name: SEED_TITLE })).toBeVisible()
    await expect(pageObj.viewDialog.getByText(SEED_NAME)).toBeVisible()
  })

  test('should delete solicitação with confirmation', async () => {
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(SEED_ROW_COUNT)

    await pageObj.deleteRowByText(SEED_TITLE)
    await expect(pageObj.deleteDialog).toBeVisible()
    await pageObj.confirmDelete()

    await expect(pageObj.getToast('Solicitação excluída com sucesso!')).toBeVisible()
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(SEED_ROW_COUNT - 1)
  })

  test('should cancel delete operation', async () => {
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(SEED_ROW_COUNT)

    await pageObj.deleteRowByText(SEED_TITLE)
    await expect(pageObj.deleteDialog).toBeVisible()
    await pageObj.cancelDelete()

    await expect(pageObj.deleteDialog).not.toBeVisible()
    await expect(pageObj.dataTable.getByRole('row')).toHaveCount(SEED_ROW_COUNT)
  })
})
