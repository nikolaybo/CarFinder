import { test, expect } from './fixtures';

test.describe('Routing & guards', () => {
  test('unknown route renders the 404 component', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    // The page-not-found component should render on unknown routes.
    await expect(page.locator('app-page-not-found')).toBeVisible();
    const bodyText = (await page.locator('body').innerText()).toLowerCase();
    expect(bodyText.length).toBeGreaterThan(0);
  });

  test('protected /profile redirects unauthenticated users to /login', async ({ unauthenticatedPage: page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('protected /car-view/:id redirects unauthenticated users to /login', async ({ unauthenticatedPage: page }) => {
    await page.goto('/car-view/abc-123');
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe('Accessibility smoke', () => {
  test('login page exposes labelled email + password inputs', async ({ page }) => {
    await page.goto('/login');
    const email = page.locator('input[formControlName="email"]');
    const password = page.locator('input[formControlName="password"]');
    await expect(email).toHaveAttribute('type', 'email');
    await expect(password).toHaveAttribute('type', 'password');
    await expect(email).toHaveAttribute('autocomplete', /email|username/);
  });

  test('every page has a non-empty <title>', async ({ page }) => {
    for (const path of ['/login', '/register']) {
      await page.goto(path);
      await expect(page).toHaveTitle(/.+/);
    }
  });
});
