import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.describe.configure({ mode: 'default' })

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
  })

  test('should render the dashboard and summary cards', async ({ page }) => {
    await expect.soft(page.getByRole('heading', { name: 'Dashboard' }), "Dashboard heading not visible").toBeVisible()

    await expect.soft(page.getByLabel(/^Ver Cadastros: \d+$/), "Ver Cadastros card not visible").toBeVisible()
    await expect.soft(page.getByLabel(/^Ver Solicitações: \d+$/), "Ver Solicitações card not visible").toBeVisible()
    await expect.soft(page.getByLabel(/^Ver Documentos: \d+$/), "Ver Documentos card not visible").toBeVisible()
    await expect.soft(page.getByLabel(/^Ver Pendentes: \d+$/), "Ver Pendentes card not visible").toBeVisible()
  })

  test('should navigate to quick actions', async ({ page }) => {
    await page.getByLabel('Realizar Novo Cadastro').click()
    await expect(page).toHaveURL(/.*\/cadastro/)
    await expect(page.getByRole('heading', { name: 'Cadastro' })).toBeVisible()
    
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.getByLabel('Realizar Nova Solicitação').click()
    await expect(page).toHaveURL(/.*\/solicitacoes/)
    
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.getByLabel('Realizar Novo Documento').click()
    await expect(page).toHaveURL(/.*\/documentos/)
  })
})
