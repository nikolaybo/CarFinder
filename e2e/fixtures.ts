import { test as base, expect, Page } from '@playwright/test';

export { expect };

/**
 * Project-specific fixtures.
 *
 * `unauthenticatedPage` guarantees no Supabase session is present in
 * localStorage before the page navigates — keeps guard-redirect tests
 * deterministic across runs and across machines.
 */
export const test = base.extend<{ unauthenticatedPage: Page }>({
  unauthenticatedPage: async ({ page, baseURL }, use) => {
    await page.addInitScript(() => {
      try {
        for (const key of Object.keys(window.localStorage)) {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            window.localStorage.removeItem(key);
          }
        }
      } catch {
        /* storage unavailable in some contexts — ignore */
      }
    });
    await page.goto(baseURL ?? '/');
    await use(page);
  },
});
