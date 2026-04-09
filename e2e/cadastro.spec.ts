import { test, expect } from '@playwright/test'
import { CadastroPage } from './pages/cadastro-page'

function generateValidCadastro() {
  const uniq = Date.now().toString().slice(-4)
  return {
    nome: 'Usuário Teste Playwright',
    cpfCnpj: `00.000.000/000${uniq[0]}-${uniq.slice(1, 4)}`.slice(0, 18),
    email: `test_${uniq}@playwright.dev`,
    telefone: '(11) 98765-4321',
    cep: '01001-000',
    logradouro: 'Praça da Sé',
    numero: '1',
    bairro: 'Sé',
    cidade: 'São Paulo',
    uf: 'SP',
  }
}

test.describe('Cadastro', () => {
  test.describe.configure({ mode: 'default' })

  let pageObj: CadastroPage

  test.beforeEach(async ({ page }) => {
    pageObj = new CadastroPage(page)
    await pageObj.clearState()
    await pageObj.goto()
  })

  test.afterEach(async () => {
    await pageObj.clearState()
  })

  test('should create a complete user', async () => {
    const valid = generateValidCadastro()
    await pageObj.fillForm(valid)

    await pageObj.submit()

    await pageObj.expectFormCleared()
  })

  test('should show validation errors when required fields are missing', async () => {
    const valid = generateValidCadastro()
    await pageObj.fillForm({
      nome: valid.nome,
    })

    await pageObj.submit()

    await expect(pageObj.page.getByText('Este campo e obrigatorio').first()).toBeVisible()
    await expect(pageObj.getToast('Cadastro criado com sucesso!')).toHaveCount(0)
  })

  test('should reject invalid CPF/CNPJ', async () => {
    const valid = generateValidCadastro()
    await pageObj.fillForm({
      ...valid,
      cpfCnpj: '123.456.789-00',
    })

    await pageObj.submit()

    await expect(pageObj.page.getByText('CPF ou CNPJ invalido')).toBeVisible()
    await expect(pageObj.getToast('Cadastro criado com sucesso!')).toHaveCount(0)
    await expect(pageObj.cpfCnpjInput).toHaveValue('123.456.789-00')
  })

  test('should reject invalid email', async () => {
    const valid = generateValidCadastro()
    await pageObj.fillForm({
      ...valid,
      email: 'email-invalido',
    })

    await pageObj.submit()

    await expect(pageObj.page.getByText('E-mail invalido')).toBeVisible()
    await expect(pageObj.getToast('Cadastro criado com sucesso!')).toHaveCount(0)
    await expect(pageObj.emailInput).toHaveValue('email-invalido')
  })

  test('should reject malformed CEP values', async () => {
    const valid = generateValidCadastro()
    await pageObj.fillForm({
      ...valid,
      cep: '1234',
    })

    await pageObj.submit()

    await expect(pageObj.page.getByText('CEP invalido')).toBeVisible()
    await expect(pageObj.getToast('Cadastro criado com sucesso!')).toHaveCount(0)
    await expect(pageObj.cepInput).toHaveValue('1234')
  })
})
