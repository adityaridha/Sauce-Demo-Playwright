import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { InventoryPage } from './pages/InventoryPage'
import { CartPage } from './pages/CartPage'
import { CheckoutInfoPage } from './pages/CheckoutInfoPage'
import { USERS, PRODUCTS } from './data/constants'

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goToPage()
    await loginPage.login(USERS.standard.username, USERS.standard.password)
  })

  test('empty cart has no items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    await inventoryPage.goToCart()
    await cartPage.validateOnPage()
    const count = await cartPage.getItemCount()
    expect(count).toBe(0)
  })

  test('added items appear in cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)

    await inventoryPage.addItemToCart(PRODUCTS.backpack.name)
    await inventoryPage.addItemToCart(PRODUCTS.bikeLight.name)
    await inventoryPage.goToCart()
    await cartPage.validateOnPage()

    const names = await cartPage.getItemNames()
    expect(names).toContain(PRODUCTS.backpack.name)
    expect(names).toContain(PRODUCTS.bikeLight.name)
  })

  test('cart item count matches items added', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)

    await inventoryPage.addItemToCart(PRODUCTS.backpack.name)
    await inventoryPage.addItemToCart(PRODUCTS.bikeLight.name)
    await inventoryPage.goToCart()

    const count = await cartPage.getItemCount()
    expect(count).toBe(2)
  })

  test('item can be removed from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)

    await inventoryPage.addItemToCart(PRODUCTS.backpack.name)
    await inventoryPage.addItemToCart(PRODUCTS.bikeLight.name)
    await inventoryPage.goToCart()
    await cartPage.removeItem(PRODUCTS.backpack.name)

    const count = await cartPage.getItemCount()
    expect(count).toBe(1)
    expect(await cartPage.isItemInCart(PRODUCTS.bikeLight.name)).toBe(true)
  })

  test('continue shopping navigates back to inventory', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)

    await inventoryPage.goToCart()
    await cartPage.continueShopping()
    await inventoryPage.validateOnPage()
  })

  test('checkout button navigates to checkout step 1', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    const checkoutInfoPage = new CheckoutInfoPage(page)

    await inventoryPage.addItemToCart(PRODUCTS.backpack.name)
    await inventoryPage.goToCart()
    await cartPage.proceedToCheckout()
    await checkoutInfoPage.validateOnPage()
  })
})
