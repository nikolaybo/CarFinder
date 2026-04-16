import { test, expect } from './fixtures';
import { LoginPage } from './pages/login.page';

test.describe('Authentication flow', () => {
  test('redirects unauthenticated visitors from "/" to /login', async ({ unauthenticatedPage: page }) => {
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('input[formControlName="email"]')).toBeVisible();
  });

  test('login form submit stays disabled until both fields are valid', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await expect(login.submitButton).toBeDisabled();

    await login.emailInput.fill('not-an-email');
    await login.passwordInput.fill('short');
    await login.emailInput.blur();
    await login.passwordInput.blur();

    await expect(login.submitButton).toBeDisabled();

    await login.fill('valid@example.com', 'longenoughpassword');
    await expect(login.submitButton).toBeEnabled();
  });

  test('clicking the register link navigates to /register', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.registerLink.first().click();
    await expect(page).toHaveURL(/\/register$/);
    await expect(page.locator('input[formControlName="username"]')).toBeVisible();
    await expect(page.locator('input[formControlName="email"]')).toBeVisible();
    await expect(page.locator('input[formControlName="password"]')).toBeVisible();
  });

  test('register form rejects invalid email and weak password', async ({ page }) => {
    await page.goto('/register');
    const submit = page.locator('button[type="submit"]');

    await expect(submit).toBeDisabled();

    await page.locator('input[formControlName="username"]').fill('user');
    await page.locator('input[formControlName="email"]').fill('bad');
    await page.locator('input[formControlName="password"]').fill('123');

    await expect(submit).toBeDisabled();
  });
});
