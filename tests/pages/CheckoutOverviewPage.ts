import { type Locator, type Page, expect } from '@playwright/test'

export class CheckoutOverviewPage {
  readonly page: Page
  readonly cartItems: Locator
  readonly subtotalLabel: Locator
  readonly taxLabel: Locator
  readonly totalLabel: Locator
  readonly finishBtn: Locator
  readonly cancelBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.cartItems = page.locator('.cart_item')
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]')
    this.taxLabel = page.locator('[data-test="tax-label"]')
    this.totalLabel = page.locator('[data-test="total-label"]')
    this.finishBtn = page.locator('[data-test="finish"]')
    this.cancelBtn = page.locator('[data-test="cancel"]')
  }

  async validateOnPage(): Promise<void> {
    await this.page.waitForURL('https://www.saucedemo.com/checkout-step-two.html')
    await expect(this.finishBtn).toBeVisible()
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count()
  }

  async getItemNames(): Promise<string[]> {
    return this.cartItems.locator('[data-test="inventory-item-name"]').allInnerTexts()
  }

  async getSubtotal(): Promise<string> {
    return this.subtotalLabel.innerText()
  }

  async getTax(): Promise<string> {
    return this.taxLabel.innerText()
  }

  async getTotal(): Promise<string> {
    return this.totalLabel.innerText()
  }

  async finish(): Promise<void> {
    await this.finishBtn.click()
  }

  async cancel(): Promise<void> {
    await this.cancelBtn.click()
  }
}
