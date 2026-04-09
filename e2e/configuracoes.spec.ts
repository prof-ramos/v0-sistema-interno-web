import { test, expect } from '@playwright/test'

test.describe('Configurações', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/configuracoes')
  })

  test('should toggle theme selection', async ({ page }) => {
    await expect(page.getByText('Aparência')).toBeVisible()

    const html = page.locator('html')
    await expect(html).not.toHaveClass(/dark/)

    await page.getByRole('button', { name: 'Escuro' }).click()
    await expect(page.getByText('Tema alterado com sucesso!')).toBeVisible()
    await expect(html).toHaveClass(/dark/)

    await page.getByRole('button', { name: 'Claro' }).click()
    await expect(page.getByText('Tema alterado com sucesso!')).toBeVisible()
    await expect(html).not.toHaveClass(/dark/)
  })

  test('should save new notifications settings', async ({ page }) => {
    const pushSwitch = page.locator('button[id="push-notifications"]')
    // Ensure we see the control
    await expect(pushSwitch).toBeVisible()
    
    // Toggle the switch
    await pushSwitch.click()
    
    // Validate value changed - check aria-checked toggles
    await expect(pushSwitch).toHaveAttribute('aria-checked', 'true') // Assuming it was false

    await page.getByRole('button', { name: 'Salvar Tudo' }).click()
    await expect(page.locator('[data-sonner-toast]').getByText('Configurações salvas com sucesso!')).toBeVisible()

    // reload to check persistence
    await page.reload()
    await expect(page.locator('button[id="push-notifications"]')).toHaveAttribute('aria-checked', 'true')
  })
})
