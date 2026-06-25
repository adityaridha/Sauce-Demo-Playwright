import { type Locator, type Page, expect } from '@playwright/test'

export class CartPage {
  readonly page: Page
  readonly cartItems: Locator
  readonly continueShoppingBtn: Locator
  readonly checkoutBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.cartItems = page.locator('.cart_item')
    this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]')
    this.checkoutBtn = page.locator('[data-test="checkout"]')
  }

  async validateOnPage(): Promise<void> {
    await this.page.waitForURL('https://www.saucedemo.com/cart.html')
    await expect(this.checkoutBtn).toBeVisible()
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count()
  }

  async getItemNames(): Promise<string[]> {
    return this.cartItems.locator('[data-test="inventory-item-name"]').allInnerTexts()
  }

  async removeItem(itemName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: itemName })
    await item.locator('[data-test^="remove"]').click()
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingBtn.click()
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutBtn.click()
  }

  async isItemInCart(itemName: string): Promise<boolean> {
    const item = this.cartItems.filter({ hasText: itemName })
    return item.isVisible()
  }
}
