import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { InventoryPage } from './pages/InventoryPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CartPage } from './pages/CartPage'
import { USERS, PRODUCTS } from './data/constants'

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goToPage()
    await loginPage.login(USERS.standard.username, USERS.standard.password)
  })

  test('inventory page shows all 6 products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.validateOnPage()
    const count = await inventoryPage.getProductCount()
    expect(count).toBe(6)
  })

  test('products sorted A-Z by default', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.sortBy('az')
    const names = await inventoryPage.getProductNames()
    const sorted = [...names].sort()
    expect(names).toEqual(sorted)
  })

  test('products can be sorted Z-A', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.sortBy('za')
    const names = await inventoryPage.getProductNames()
    const sorted = [...names].sort().reverse()
    expect(names).toEqual(sorted)
  })

  test('products can be sorted price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.sortBy('lohi')
    const prices = await page.locator('.inventory_item_price').allInnerTexts()
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')))
    const sorted = [...numericPrices].sort((a, b) => a - b)
    expect(numericPrices).toEqual(sorted)
  })

  test('products can be sorted price high to low', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.sortBy('hilo')
    const prices = await page.locator('.inventory_item_price').allInnerTexts()
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')))
    const sorted = [...numericPrices].sort((a, b) => b - a)
    expect(numericPrices).toEqual(sorted)
  })

  test('cart badge increments when adding an item', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.addItemToCart(PRODUCTS.backpack.name)
    const count = await inventoryPage.getCartBadgeCount()
    expect(count).toBe(1)
  })

  test('cart badge reflects multiple added items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.addItemToCart(PRODUCTS.backpack.name)
    await inventoryPage.addItemToCart(PRODUCTS.bikeLight.name)
    await inventoryPage.addItemToCart(PRODUCTS.onesie.name)
    const count = await inventoryPage.getCartBadgeCount()
    expect(count).toBe(3)
  })

  test('cart badge decrements when removing item from inventory', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.addItemToCart(PRODUCTS.backpack.name)
    await inventoryPage.addItemToCart(PRODUCTS.bikeLight.name)
    await inventoryPage.removeItemFromCart(PRODUCTS.backpack.name)
    const count = await inventoryPage.getCartBadgeCount()
    expect(count).toBe(1)
  })

  test('cart badge disappears when all items are removed', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.addItemToCart(PRODUCTS.backpack.name)
    await inventoryPage.removeItemFromCart(PRODUCTS.backpack.name)
    const isVisible = await inventoryPage.isCartBadgeVisible()
    expect(isVisible).toBe(false)
  })

  test('clicking product name navigates to product detail page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const detailPage = new ProductDetailPage(page)
    await inventoryPage.clickProductName(PRODUCTS.backpack.name)
    await detailPage.validateOnPage()
    const name = await detailPage.getProductName()
    expect(name).toBe(PRODUCTS.backpack.name)
  })

  test('cart icon navigates to cart page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    await inventoryPage.goToCart()
    await cartPage.validateOnPage()
  })

  test('burger menu opens and closes', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.openBurgerMenu()
    await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible()
    await inventoryPage.closeBurgerMenu()
    await expect(page.locator('[data-test="logout-sidebar-link"]')).not.toBeVisible()
  })

  test('reset app state clears cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.addItemToCart(PRODUCTS.backpack.name)
    await inventoryPage.resetAppState()
    const isVisible = await inventoryPage.isCartBadgeVisible()
    expect(isVisible).toBe(false)
  })
})
