import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { InventoryPage } from './pages/InventoryPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { USERS, PRODUCTS } from './data/constants'

test.describe('Product Detail', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goToPage()
    await loginPage.login(USERS.standard.username, USERS.standard.password)
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.clickProductName(PRODUCTS.backpack.name)
  })

  test('product detail page shows name, description, and price', async ({ page }) => {
    const detailPage = new ProductDetailPage(page)
    await detailPage.validateOnPage()

    const name = await detailPage.getProductName()
    const price = await detailPage.getProductPrice()

    expect(name).toBe(PRODUCTS.backpack.name)
    expect(price).toBe(PRODUCTS.backpack.price)
    await expect(detailPage.productDescription).toBeVisible()
  })

  test('product image is displayed', async ({ page }) => {
    const detailPage = new ProductDetailPage(page)
    await expect(detailPage.productImage).toBeVisible()
  })

  test('add to cart button is visible before adding', async ({ page }) => {
    const detailPage = new ProductDetailPage(page)
    expect(await detailPage.isAddToCartVisible()).toBe(true)
    expect(await detailPage.isRemoveVisible()).toBe(false)
  })

  test('add to cart from detail page updates cart badge', async ({ page }) => {
    const detailPage = new ProductDetailPage(page)
    await detailPage.addToCart()
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1')
  })

  test('after adding, remove button replaces add-to-cart', async ({ page }) => {
    const detailPage = new ProductDetailPage(page)
    await detailPage.addToCart()
    expect(await detailPage.isAddToCartVisible()).toBe(false)
    expect(await detailPage.isRemoveVisible()).toBe(true)
  })

  test('removing item from detail page hides cart badge', async ({ page }) => {
    const detailPage = new ProductDetailPage(page)
    await detailPage.addToCart()
    await detailPage.removeFromCart()
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible()
    expect(await detailPage.isAddToCartVisible()).toBe(true)
  })

  test('back to products navigates to inventory', async ({ page }) => {
    const detailPage = new ProductDetailPage(page)
    const inventoryPage = new InventoryPage(page)
    await detailPage.goBackToProducts()
    await inventoryPage.validateOnPage()
  })
})
