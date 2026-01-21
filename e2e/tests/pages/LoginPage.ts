import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object Model for Login Page
 * Following Playwright best practices with data-testid selectors
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly submitError: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly welcomeHeading: Locator;
  readonly userFullName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: /login/i });
    this.forgotPasswordLink = page.getByRole('button', { name: /forgot password/i });
    this.submitError = page.getByRole('alert');
    this.usernameError = page.locator('#username-error');
    this.passwordError = page.locator('#password-error');
    this.welcomeHeading = page.getByRole('heading', { name: /welcome/i });
    this.userFullName = page.getByTestId('user-fullname');
  }

  async goto() {
    await this.page.goto('http://localhost:5173/login');
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async waitForLoginSuccess() {
    await this.welcomeHeading.waitFor({ state: 'visible' });
  }

  async waitForApiResponse() {
    await this.page.waitForResponse(
      (resp) =>
        resp.url().includes('dummyjson.com/auth/login') &&
        resp.status() === 200
    );
  }
}
