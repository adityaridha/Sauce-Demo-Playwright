import { type Locator, type Page, expect } from '@playwright/test'

export class CheckoutInfoPage {
  readonly page: Page
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly postalCodeInput: Locator
  readonly continueBtn: Locator
  readonly cancelBtn: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.firstNameInput = page.locator('[data-test="firstName"]')
    this.lastNameInput = page.locator('[data-test="lastName"]')
    this.postalCodeInput = page.locator('[data-test="postalCode"]')
    this.continueBtn = page.locator('[data-test="continue"]')
    this.cancelBtn = page.locator('[data-test="cancel"]')
    this.errorMessage = page.locator('[data-test="error"]')
  }

  async validateOnPage(): Promise<void> {
    await this.page.waitForURL('https://www.saucedemo.com/checkout-step-one.html')
    await expect(this.continueBtn).toBeVisible()
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName)
    await this.lastNameInput.fill(lastName)
    await this.postalCodeInput.fill(postalCode)
  }

  async clickContinue(): Promise<void> {
    await this.continueBtn.click()
  }

  async clickCancel(): Promise<void> {
    await this.cancelBtn.click()
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' })
    return this.errorMessage.innerText()
  }

  async submitInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillInfo(firstName, lastName, postalCode)
    await this.clickContinue()
  }
}
