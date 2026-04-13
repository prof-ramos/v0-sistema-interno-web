import type { Page, Locator } from '@playwright/test'

/**
 * Base Page Object Model for E2E tests.
 * Provides common utilities and navigation methods inherited by specific page objects.
 */
export class BasePage {
  readonly page: Page

  /**
   * @param {Page} page - The Playwright Page instance.
   */
  constructor(page: Page) {
    this.page = page
  }

  /**
   * Navigates to a specific route.
   * @param {string} route - The relative URL route to navigate to.
   * @throws {Error} If the route is empty or navigation fails.
   * @returns {Promise<void>}
   */
  async goto(route: string) {
    if (!route || route.trim() === '') {
      throw new Error(`Invalid route: "${route}" must be a non-empty string.`)
    }
    try {
      await this.page.goto(route, { waitUntil: 'domcontentloaded' })
    } catch (error) {
      throw new Error(`Failed to navigate to "${route}": ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Navigates via clicking a link by its accessible name.
   * @param {string} label - The accessible name (text) of the link.
   * @throws {Error} If the link is not found, ambiguous, or click fails.
   * @returns {Promise<void>}
   */
  async navigateTo(label: string) {
    const trimmed = label?.trim()
    if (!trimmed) {
      throw new Error(`Invalid label: "${label}" must be a non-empty string.`)
    }
    const links = this.page.getByRole('link', { name: trimmed })
    const count = await links.count()
    if (count === 0) {
      throw new Error(`No link found with name "${label}".`)
    }
    if (count > 1) {
      throw new Error(`Ambiguous link "${label}": ${count} matches found. Use a more specific selector.`)
    }
    try {
      await links.first().click()
      await this.page.waitForLoadState('domcontentloaded')
    } catch (error) {
      throw new Error(`Failed to navigate via link "${label}": ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Returns a Locator for a heading by its text.
   * @param {string} text - The heading text.
   * @returns {Locator} The Playwright locator for the heading.
   */
  getHeading(text: string): Locator {
    return this.page.getByRole('heading', { name: text })
  }

  /**
   * Returns a Locator for a visible toast notification.
   * @param {string} text - The text inside the toast.
   * @returns {Locator} The Playwright locator for the toast.
   */
  getToast(text: string): Locator {
    const t = text.trim()
    return this.page.locator('[data-sonner-toast][data-visible="true"]').filter({ hasText: t }).first()
  }

  /**
   * Clears the application state (storage and cookies) to ensure test isolation.
   * @throws {Error} If clearing state fails.
   * @returns {Promise<void>}
   */
  async clearState() {
    try {
      await this.page.goto('/', { waitUntil: 'domcontentloaded' })
      await this.page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
      await this.page.context().clearCookies()
    } catch (error) {
      const url = this.page.url()
      throw new Error(
        `clearState failed at "${url}": ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }
}
