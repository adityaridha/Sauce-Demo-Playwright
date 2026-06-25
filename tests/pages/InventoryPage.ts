import { type Locator, type Page, expect } from '@playwright/test'

export class InventoryPage {
  readonly page: Page
  readonly productList: Locator
  readonly productItems: Locator
  readonly cartLink: Locator
  readonly cartBadge: Locator
  readonly sortDropdown: Locator
  readonly burgerMenuBtn: Locator
  readonly burgerMenuClose: Locator
  readonly allItemsLink: Locator
  readonly aboutLink: Locator
  readonly logoutLink: Locator
  readonly resetLink: Locator

  constructor(page: Page) {
    this.page = page
    this.productList = page.locator('.inventory_list')
    this.productItems = page.locator('.inventory_item')
    this.cartLink = page.locator('[data-test="shopping-cart-link"]')
    this.cartBadge = page.locator('.shopping_cart_badge')
    this.sortDropdown = page.locator('[data-test="product-sort-container"]')
    this.burgerMenuBtn = page.locator('#react-burger-menu-btn')
    this.burgerMenuClose = page.locator('#react-burger-cross-btn')
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]')
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]')
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]')
    this.resetLink = page.locator('[data-test="reset-sidebar-link"]')
  }

  async validateOnPage(): Promise<void> {
    await this.page.waitForURL('https://www.saucedemo.com/inventory.html')
    await expect(this.productList).toBeVisible()
  }

  async getProductCount(): Promise<number> {
    return this.productItems.count()
  }

  async getProductNames(): Promise<string[]> {
    return this.productItems.locator('.inventory_item_name').allInnerTexts()
  }

  async addItemToCart(itemName: string): Promise<void> {
    const item = this.productItems.filter({ hasText: itemName })
    await item.locator('[data-test^="add-to-cart"]').click()
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    const item = this.productItems.filter({ hasText: itemName })
    await item.locator('[data-test^="remove"]').click()
  }

  async getCartBadgeCount(): Promise<number> {
    const text = await this.cartBadge.innerText()
    return parseInt(text, 10)
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return this.cartBadge.isVisible()
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option)
  }

  async clickProductName(itemName: string): Promise<void> {
    await this.productItems.filter({ hasText: itemName }).locator('.inventory_item_name').click()
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click()
  }

  async openBurgerMenu(): Promise<void> {
    await this.burgerMenuBtn.click()
    await this.allItemsLink.waitFor({ state: 'visible' })
  }

  async closeBurgerMenu(): Promise<void> {
    await this.burgerMenuClose.click()
  }

  async logout(): Promise<void> {
    await this.openBurgerMenu()
    await this.logoutLink.click()
  }

  async resetAppState(): Promise<void> {
    await this.openBurgerMenu()
    await this.resetLink.click()
    await this.closeBurgerMenu()
  }
}
