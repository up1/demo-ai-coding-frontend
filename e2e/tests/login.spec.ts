import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Login Flow', () => {
  test('user can login successfully with valid credentials', async ({ page }) => {
    // Arrange: Navigate to login page
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Verify login page loaded
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // Act: Fill in valid credentials from dummyjson.com
    // Using emilys/emilyspass as specified in the login-figma.md requirements
    await loginPage.fillUsername('emilys');
    await loginPage.fillPassword('emilyspass');

    // Take screenshot before login
    await page.screenshot({ path: 'artifacts/login-before-submit.png' });

    // Submit the form
    await loginPage.clickLogin();

    // Wait for API response
    await loginPage.waitForApiResponse();

    // Assert: User should see welcome message with name
    await loginPage.waitForLoginSuccess();
    await expect(loginPage.welcomeHeading).toBeVisible();
    await expect(loginPage.welcomeHeading).toHaveText('Welcome!');

    // Verify user's full name is displayed (Emily Johnson from API)
    await expect(loginPage.userFullName).toBeVisible();
    await expect(loginPage.userFullName).toContainText('Emily');
    await expect(loginPage.userFullName).toContainText('Johnson');

    // Take screenshot of success state
    await page.screenshot({ path: 'artifacts/login-success.png' });
  });
});
