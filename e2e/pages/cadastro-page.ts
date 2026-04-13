import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './base-page'

interface CadastroFormData {
  nome: string
  cpfCnpj: string
  email: string
  telefone: string
  cep: string
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  uf: string
}

export class CadastroPage extends BasePage {
  readonly heading: Locator
  readonly nomeInput: Locator
  readonly cpfCnpjInput: Locator
  readonly emailInput: Locator
  readonly telefoneInput: Locator
  readonly cepInput: Locator
  readonly logradouroInput: Locator
  readonly numeroInput: Locator
  readonly bairroInput: Locator
  readonly cidadeInput: Locator
  readonly ufCombobox: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    super(page)
    this.heading = this.getHeading('Cadastro')
    this.nomeInput = page.getByLabel('Nome Completo')
    this.cpfCnpjInput = page.getByLabel('CPF/CNPJ')
    this.emailInput = page.getByLabel('E-mail')
    this.telefoneInput = page.getByLabel('Telefone')
    this.cepInput = page.getByLabel('CEP')
    this.logradouroInput = page.getByLabel('Logradouro')
    this.numeroInput = page.getByLabel('Numero')
    this.bairroInput = page.getByLabel('Bairro')
    this.cidadeInput = page.getByLabel('Cidade')
    this.ufCombobox = page.getByRole('combobox', { name: 'UF' })
    this.submitButton = page.getByRole('button', { name: 'Salvar', exact: true })
  }

  async goto() {
    await super.goto('/cadastro')
  }

  async fillForm(data: Partial<CadastroFormData>) {
    if (data.nome !== undefined) await this.nomeInput.fill(data.nome)
    if (data.cpfCnpj !== undefined) await this.cpfCnpjInput.fill(data.cpfCnpj)
    if (data.email !== undefined) await this.emailInput.fill(data.email)
    if (data.telefone !== undefined) await this.telefoneInput.fill(data.telefone)
    if (data.cep !== undefined) await this.cepInput.fill(data.cep)
    if (data.logradouro !== undefined) await this.logradouroInput.fill(data.logradouro)
    if (data.numero !== undefined) await this.numeroInput.fill(data.numero)
    if (data.bairro !== undefined) await this.bairroInput.fill(data.bairro)
    if (data.cidade !== undefined) await this.cidadeInput.fill(data.cidade)
    if (data.uf !== undefined) {
      await this.ufCombobox.click()
      await this.page.getByRole('option', { name: data.uf }).click()
    }
  }

  async submit() {
    await this.submitButton.click()
  }

  async expectFormCleared() {
    await expect(this.nomeInput).toHaveValue('')
    await expect(this.cpfCnpjInput).toHaveValue('')
    await expect(this.emailInput).toHaveValue('')
    await expect(this.telefoneInput).toHaveValue('')
    await expect(this.cepInput).toHaveValue('')
    await expect(this.logradouroInput).toHaveValue('')
    await expect(this.numeroInput).toHaveValue('')
    await expect(this.bairroInput).toHaveValue('')
    await expect(this.cidadeInput).toHaveValue('')
  }
}
