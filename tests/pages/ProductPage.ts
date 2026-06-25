
import { Page, Locator, expect } from '@playwright/test'

export class ProductPage {
    
    readonly page: Page

    // Element locators
    readonly productTitle: Locator
    readonly addToCartButton: Locator
    readonly cartLink: Locator

    constructor(page: Page) {
        this.page = page

        this.productTitle = page.locator('[data-test="item-4-title-link"]')
        this.addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')
        this.cartLink = page.locator('[data-test="shopping-cart-link"]')
    }

    // Methods

    async validateOnPage(): Promise<void> {
        await this.page.waitForURL('https://www.saucedemo.com/inventory.html')
        await expect(this.productTitle).toBeVisible()
        await expect(this.addToCartButton).toBeVisible()
        await expect(this.cartLink).toBeVisible()
    }

    async clickProductTitle(): Promise<void> {
        await this.productTitle.click()
    }

    async clickAddToCartButton(): Promise<void> {
        await this.addToCartButton.click()
    }
    
    async clickCartLink(): Promise<void> {
        await this.cartLink.click()
    }

    async logout(): Promise<void> {
        await this.page.locator('//*[@id="react-burger-menu-btn"]').click()
        await this.page.locator('[data-test="logout-sidebar-link"]').click()
    }

    async goToCart(): Promise<void> {
        await this.cartLink.click()
    }

    async addToCart(itemName: string): Promise<void> {
        const item = this.page.locator('.inventory_item').filter({ hasText: itemName })
        await item.locator('[data-test^="add-to-cart"]').click()
    }
}