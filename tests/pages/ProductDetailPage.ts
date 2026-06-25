import { type Locator, type Page, expect } from '@playwright/test'

export class ProductDetailPage {
  readonly page: Page
  readonly productName: Locator
  readonly productDescription: Locator
  readonly productPrice: Locator
  readonly productImage: Locator
  readonly addToCartBtn: Locator
  readonly removeBtn: Locator
  readonly backBtn: Locator
  readonly cartBadge: Locator

  constructor(page: Page) {
    this.page = page
    this.productName = page.locator('.inventory_details_name')
    this.productDescription = page.locator('.inventory_details_desc')
    this.productPrice = page.locator('.inventory_details_price')
    this.productImage = page.locator('.inventory_details_img')
    this.addToCartBtn = page.locator('[data-test="add-to-cart"]')
    this.removeBtn = page.locator('[data-test="remove"]')
    this.backBtn = page.locator('[data-test="back-to-products"]')
    this.cartBadge = page.locator('.shopping_cart_badge')
  }

  async validateOnPage(): Promise<void> {
    await this.page.waitForURL(/inventory-item\.html/)
    await expect(this.productName).toBeVisible()
    await expect(this.productPrice).toBeVisible()
  }

  async getProductName(): Promise<string> {
    return this.productName.innerText()
  }

  async getProductPrice(): Promise<string> {
    return this.productPrice.innerText()
  }

  async addToCart(): Promise<void> {
    await this.addToCartBtn.click()
  }

  async removeFromCart(): Promise<void> {
    await this.removeBtn.click()
  }

  async goBackToProducts(): Promise<void> {
    await this.backBtn.click()
  }

  async isAddToCartVisible(): Promise<boolean> {
    return this.addToCartBtn.isVisible()
  }

  async isRemoveVisible(): Promise<boolean> {
    return this.removeBtn.isVisible()
  }
}
