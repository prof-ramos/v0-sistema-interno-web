import { test, expect } from '@playwright/test'

test.describe('Configurações', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/configuracoes')
  })

  test('should toggle theme selection', async ({ page }) => {
    await expect(page.getByText('Aparência')).toBeVisible()

    const darkButton = page.getByRole('button', { name: 'Escuro' })
    await expect(darkButton).toBeVisible()

    const html = page.locator('html')

    await darkButton.click()
    await expect(page.locator('[data-sonner-toast]').getByText('Tema alterado com sucesso!')).toBeVisible()
    await expect(html).toHaveClass(/\bdark\b/)

    const lightButton = page.getByRole('button', { name: 'Claro' })
    await lightButton.click()
    await expect(page.locator('[data-sonner-toast]').getByText('Tema alterado com sucesso!')).toBeVisible()
    await expect(html).not.toHaveClass(/dark/)
  })

  test('should save new notifications settings', async ({ page }) => {
    const pushSwitch = page.locator('button#push-notifications')
    await expect(pushSwitch).toBeVisible()
    
    const isInitiallyChecked = await pushSwitch.getAttribute('aria-checked') === 'true'
    
    // Toggle the switch
    await pushSwitch.click()
    
    // Validate value changed
    await expect(pushSwitch).toHaveAttribute('aria-checked', isInitiallyChecked ? 'false' : 'true')

    await page.getByRole('button', { name: 'Salvar Tudo' }).click()
    await expect(page.locator('[data-sonner-toast]').getByText('Configurações salvas com sucesso!')).toBeVisible()

    // reload to check persistence
    await page.reload()
    await expect(page.locator('button#push-notifications')).toHaveAttribute('aria-checked', isInitiallyChecked ? 'false' : 'true')
  })
})
