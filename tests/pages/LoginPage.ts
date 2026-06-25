import { type Locator, type Page, expect } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly username: Locator
  readonly password: Locator
  readonly loginBtn: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.username = page.locator('#user-name')
    this.password = page.locator('#password')
    this.loginBtn = page.locator('#login-button')
    this.errorMessage = page.locator('[data-test="error"]')
  }

  async goToPage(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/')
  }

  async inputUsername(username: string): Promise<void> {
    await this.username.fill(username)
  }

  async inputPassword(password: string): Promise<void> {
    await this.password.fill(password)
  }

  async clickLoginButton(): Promise<void> {
    await this.loginBtn.click()
  }

  async login(username: string, password: string): Promise<void> {
    await this.inputUsername(username)
    await this.inputPassword(password)
    await this.clickLoginButton()
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' })
    return this.errorMessage.innerText()
  }

  async validateFailedLogin(): Promise<void> {
    await this.errorMessage.waitFor({ state: 'visible' })
  }

  async validateOnPage(): Promise<void> {
    await this.page.waitForURL('https://www.saucedemo.com/')
    await expect(this.username).toBeVisible()
    await expect(this.password).toBeVisible()
    await expect(this.loginBtn).toBeVisible()
  }
}
