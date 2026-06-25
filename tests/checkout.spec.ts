import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { InventoryPage } from './pages/InventoryPage'
import { CartPage } from './pages/CartPage'
import { CheckoutInfoPage } from './pages/CheckoutInfoPage'
import { CheckoutOverviewPage } from './pages/CheckoutOverviewPage'
import { CheckoutCompletePage } from './pages/CheckoutCompletePage'
import { USERS, PRODUCTS, CHECKOUT_INFO } from './data/constants'

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goToPage()
    await loginPage.login(USERS.standard.username, USERS.standard.password)
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.addItemToCart(PRODUCTS.backpack.name)
    await inventoryPage.goToCart()
    const cartPage = new CartPage(page)
    await cartPage.proceedToCheckout()
  })

  test.describe('Step 1 - Customer Info', () => {
    test('checkout info page loads', async ({ page }) => {
      const checkoutInfoPage = new CheckoutInfoPage(page)
      await checkoutInfoPage.validateOnPage()
    })

    test('error when submitting with all fields empty', async ({ page }) => {
      const checkoutInfoPage = new CheckoutInfoPage(page)
      await checkoutInfoPage.clickContinue()
      const error = await checkoutInfoPage.getErrorMessage()
      expect(error).toContain('First Name is required')
    })

    test('error when first name is missing', async ({ page }) => {
      const checkoutInfoPage = new CheckoutInfoPage(page)
      await checkoutInfoPage.submitInfo('', CHECKOUT_INFO.valid.lastName, CHECKOUT_INFO.valid.postalCode)
      const error = await checkoutInfoPage.getErrorMessage()
      expect(error).toContain('First Name is required')
    })

    test('error when last name is missing', async ({ page }) => {
      const checkoutInfoPage = new CheckoutInfoPage(page)
      await checkoutInfoPage.submitInfo(CHECKOUT_INFO.valid.firstName, '', CHECKOUT_INFO.valid.postalCode)
      const error = await checkoutInfoPage.getErrorMessage()
      expect(error).toContain('Last Name is required')
    })

    test('error when postal code is missing', async ({ page }) => {
      const checkoutInfoPage = new CheckoutInfoPage(page)
      await checkoutInfoPage.submitInfo(CHECKOUT_INFO.valid.firstName, CHECKOUT_INFO.valid.lastName, '')
      const error = await checkoutInfoPage.getErrorMessage()
      expect(error).toContain('Postal Code is required')
    })

    test('valid info continues to checkout overview', async ({ page }) => {
      const checkoutInfoPage = new CheckoutInfoPage(page)
      const overviewPage = new CheckoutOverviewPage(page)
      await checkoutInfoPage.submitInfo(
        CHECKOUT_INFO.valid.firstName,
        CHECKOUT_INFO.valid.lastName,
        CHECKOUT_INFO.valid.postalCode
      )
      await overviewPage.validateOnPage()
    })

    test('cancel returns to cart', async ({ page }) => {
      const checkoutInfoPage = new CheckoutInfoPage(page)
      const cartPage = new CartPage(page)
      await checkoutInfoPage.clickCancel()
      await cartPage.validateOnPage()
    })
  })

  test.describe('Step 2 - Overview', () => {
    test.beforeEach(async ({ page }) => {
      const checkoutInfoPage = new CheckoutInfoPage(page)
      await checkoutInfoPage.submitInfo(
        CHECKOUT_INFO.valid.firstName,
        CHECKOUT_INFO.valid.lastName,
        CHECKOUT_INFO.valid.postalCode
      )
    })

    test('overview shows ordered items', async ({ page }) => {
      const overviewPage = new CheckoutOverviewPage(page)
      const names = await overviewPage.getItemNames()
      expect(names).toContain(PRODUCTS.backpack.name)
    })

    test('overview shows subtotal, tax, and total', async ({ page }) => {
      const overviewPage = new CheckoutOverviewPage(page)
      await expect(overviewPage.subtotalLabel).toBeVisible()
      await expect(overviewPage.taxLabel).toBeVisible()
      await expect(overviewPage.totalLabel).toBeVisible()
    })

    test('cancel from overview returns to inventory', async ({ page }) => {
      const overviewPage = new CheckoutOverviewPage(page)
      const inventoryPage = new InventoryPage(page)
      await overviewPage.cancel()
      await inventoryPage.validateOnPage()
    })

    test('finish button completes the order', async ({ page }) => {
      const overviewPage = new CheckoutOverviewPage(page)
      const completePage = new CheckoutCompletePage(page)
      await overviewPage.finish()
      await completePage.validateOnPage()
    })
  })

  test.describe('Step 3 - Complete', () => {
    test.beforeEach(async ({ page }) => {
      const checkoutInfoPage = new CheckoutInfoPage(page)
      const overviewPage = new CheckoutOverviewPage(page)
      await checkoutInfoPage.submitInfo(
        CHECKOUT_INFO.valid.firstName,
        CHECKOUT_INFO.valid.lastName,
        CHECKOUT_INFO.valid.postalCode
      )
      await overviewPage.finish()
    })

    test('complete page shows thank you message', async ({ page }) => {
      const completePage = new CheckoutCompletePage(page)
      await completePage.validateOnPage()
      const header = await completePage.getHeaderText()
      expect(header).toContain('Thank you')
    })

    test('back home button returns to inventory', async ({ page }) => {
      const completePage = new CheckoutCompletePage(page)
      const inventoryPage = new InventoryPage(page)
      await completePage.backToProducts()
      await inventoryPage.validateOnPage()
    })
  })
})
