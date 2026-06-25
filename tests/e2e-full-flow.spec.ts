import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { InventoryPage } from './pages/InventoryPage'
import { CartPage } from './pages/CartPage'
import { CheckoutInfoPage } from './pages/CheckoutInfoPage'
import { CheckoutOverviewPage } from './pages/CheckoutOverviewPage'
import { CheckoutCompletePage } from './pages/CheckoutCompletePage'
import { USERS, PRODUCTS, CHECKOUT_INFO } from './data/constants'

test.describe('E2E Full Flow', () => {
  test('happy path: login → add item → checkout → complete', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    const checkoutInfoPage = new CheckoutInfoPage(page)
    const overviewPage = new CheckoutOverviewPage(page)
    const completePage = new CheckoutCompletePage(page)

    // Login
    await loginPage.goToPage()
    await loginPage.login(USERS.standard.username, USERS.standard.password)
    await inventoryPage.validateOnPage()

    // Add item to cart
    await inventoryPage.addItemToCart(PRODUCTS.backpack.name)
    expect(await inventoryPage.getCartBadgeCount()).toBe(1)

    // Go to cart and verify
    await inventoryPage.goToCart()
    await cartPage.validateOnPage()
    expect(await cartPage.getItemCount()).toBe(1)

    // Checkout step 1
    await cartPage.proceedToCheckout()
    await checkoutInfoPage.validateOnPage()
    await checkoutInfoPage.submitInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.postalCode
    )

    // Checkout step 2 - verify and finish
    await overviewPage.validateOnPage()
    const itemNames = await overviewPage.getItemNames()
    expect(itemNames).toContain(PRODUCTS.backpack.name)
    await overviewPage.finish()

    // Order complete
    await completePage.validateOnPage()
    const header = await completePage.getHeaderText()
    expect(header).toContain('Thank you')
  })

  test('purchase multiple items through full checkout flow', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    const checkoutInfoPage = new CheckoutInfoPage(page)
    const overviewPage = new CheckoutOverviewPage(page)
    const completePage = new CheckoutCompletePage(page)

    const itemsToBuy = [PRODUCTS.backpack, PRODUCTS.bikeLight, PRODUCTS.onesie]

    // Login
    await loginPage.goToPage()
    await loginPage.login(USERS.standard.username, USERS.standard.password)
    await inventoryPage.validateOnPage()

    // Add multiple items
    for (const item of itemsToBuy) {
      await inventoryPage.addItemToCart(item.name)
    }
    expect(await inventoryPage.getCartBadgeCount()).toBe(itemsToBuy.length)

    // Cart verification
    await inventoryPage.goToCart()
    expect(await cartPage.getItemCount()).toBe(itemsToBuy.length)
    const cartItemNames = await cartPage.getItemNames()
    for (const item of itemsToBuy) {
      expect(cartItemNames).toContain(item.name)
    }

    // Complete checkout
    await cartPage.proceedToCheckout()
    await checkoutInfoPage.submitInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.postalCode
    )

    expect(await overviewPage.getItemCount()).toBe(itemsToBuy.length)
    await overviewPage.finish()
    await completePage.validateOnPage()
  })

  test('add item, remove from cart, then complete purchase of different item', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    const checkoutInfoPage = new CheckoutInfoPage(page)
    const overviewPage = new CheckoutOverviewPage(page)
    const completePage = new CheckoutCompletePage(page)

    await loginPage.goToPage()
    await loginPage.login(USERS.standard.username, USERS.standard.password)

    // Add two items then remove one
    await inventoryPage.addItemToCart(PRODUCTS.backpack.name)
    await inventoryPage.addItemToCart(PRODUCTS.fleeceJacket.name)
    await inventoryPage.goToCart()
    await cartPage.removeItem(PRODUCTS.fleeceJacket.name)
    expect(await cartPage.getItemCount()).toBe(1)

    // Complete with remaining item
    await cartPage.proceedToCheckout()
    await checkoutInfoPage.submitInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.postalCode
    )
    await overviewPage.finish()
    await completePage.validateOnPage()
  })

  test('back home after purchase returns to clean inventory', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    const checkoutInfoPage = new CheckoutInfoPage(page)
    const overviewPage = new CheckoutOverviewPage(page)
    const completePage = new CheckoutCompletePage(page)

    await loginPage.goToPage()
    await loginPage.login(USERS.standard.username, USERS.standard.password)
    await inventoryPage.addItemToCart(PRODUCTS.backpack.name)
    await inventoryPage.goToCart()
    await cartPage.proceedToCheckout()
    await checkoutInfoPage.submitInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.postalCode
    )
    await overviewPage.finish()
    await completePage.backToProducts()

    // Inventory should be clean (no badge)
    await inventoryPage.validateOnPage()
    expect(await inventoryPage.isCartBadgeVisible()).toBe(false)
  })
})
