import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { InventoryPage } from './pages/InventoryPage'
import { USERS } from './data/constants'

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goToPage()
  })

  test('standard_user logs in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)

    await loginPage.login(USERS.standard.username, USERS.standard.password)
    await inventoryPage.validateOnPage()
  })

  test('locked_out_user cannot log in', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.login(USERS.locked.username, USERS.locked.password)
    const error = await loginPage.getErrorMessage()
    expect(error).toContain('locked out')
  })

  test('problem_user logs in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)

    await loginPage.login(USERS.problem.username, USERS.problem.password)
    await inventoryPage.validateOnPage()
  })

  test('performance_glitch_user logs in (may be slow)', async ({ page }) => {
    test.setTimeout(30000)
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)

    await loginPage.login(USERS.glitch.username, USERS.glitch.password)
    await inventoryPage.validateOnPage()
  })

  test('login fails with empty username', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.inputPassword(USERS.standard.password)
    await loginPage.clickLoginButton()
    const error = await loginPage.getErrorMessage()
    expect(error).toContain('Username is required')
  })

  test('login fails with empty password', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.inputUsername(USERS.standard.username)
    await loginPage.clickLoginButton()
    const error = await loginPage.getErrorMessage()
    expect(error).toContain('Password is required')
  })

  test('login fails with empty username and password', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.clickLoginButton()
    const error = await loginPage.getErrorMessage()
    expect(error).toContain('Username is required')
  })

  test('login fails with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.login('not_a_user', 'wrong_password')
    const error = await loginPage.getErrorMessage()
    expect(error).toContain('do not match')
  })

  test('user can log out after login', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)

    await loginPage.login(USERS.standard.username, USERS.standard.password)
    await inventoryPage.validateOnPage()
    await inventoryPage.logout()
    await loginPage.validateOnPage()
  })
})
