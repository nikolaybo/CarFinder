# E2E Tests

End-to-end tests powered by [Playwright](https://playwright.dev).

## Run locally

```bash
# one-time browser install
npm run e2e:install

# headless run (auto-starts ng serve on :4200)
npm run e2e

# interactive UI mode
npm run e2e:ui
```

Override the target with `E2E_BASE_URL=https://staging.example.com npm run e2e`.

## Layout

- `fixtures.ts` — shared Playwright fixtures (e.g. `unauthenticatedPage` clears Supabase session).
- `pages/` — Page Object Models. One file per screen, all selectors centralised.
- `*.spec.ts` — test suites grouped by user-facing feature.

## Conventions

- Use Page Objects for any non-trivial screen — never assert on raw selectors inside specs.
- Prefer role/label-based locators (`getByRole`, `getByLabel`) over CSS where possible.
- Tests must be **independent** — no shared mutable state between specs.
- Avoid hitting real Supabase from CI; the current suite covers guard/redirect and form-validation flows that work without a backend round-trip.
