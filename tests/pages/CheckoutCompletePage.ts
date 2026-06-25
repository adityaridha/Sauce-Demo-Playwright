import { type Locator, type Page, expect } from '@playwright/test'

export class CheckoutCompletePage {
  readonly page: Page
  readonly header: Locator
  readonly completionText: Locator
  readonly backHomeBtn: Locator
  readonly ponyExpressImage: Locator

  constructor(page: Page) {
    this.page = page
    this.header = page.locator('[data-test="complete-header"]')
    this.completionText = page.locator('[data-test="complete-text"]')
    this.backHomeBtn = page.locator('[data-test="back-to-products"]')
    this.ponyExpressImage = page.locator('[data-test="pony-express"]')
  }

  async validateOnPage(): Promise<void> {
    await this.page.waitForURL('https://www.saucedemo.com/checkout-complete.html')
    await expect(this.header).toBeVisible()
  }

  async getHeaderText(): Promise<string> {
    return this.header.innerText()
  }

  async getCompletionText(): Promise<string> {
    return this.completionText.innerText()
  }

  async backToProducts(): Promise<void> {
    await this.backHomeBtn.click()
  }
}
