# Car Finder

A full-stack car rental discovery platform built with modern Angular and a serverless backend. Users can browse, search, and save their favourite vehicles, with a fully responsive UI and real-time data from Supabase.

---

## Tech Stack

### Frontend Framework — Angular 19

Built on Angular's latest release using exclusively **standalone components** — no `NgModule` boilerplate. Every component leverages:

- **Signals** (`signal`, `computed`, `effect`) for fine-grained, synchronous reactive state — replacing `BehaviorSubject` and manual `markForCheck()` calls
- **`ChangeDetectionStrategy.OnPush`** across every component for maximum rendering performance
- **`input()` / `output()`** signal-based I/O instead of decorator-based `@Input` / `@Output`
- **`inject()`** function-style dependency injection over constructor injection
- **`takeUntilDestroyed()`** + `DestroyRef` for automatic subscription cleanup without `ngOnDestroy`
- **Lazy-loaded routes** via `loadComponent` — each page is a separate async chunk, reducing initial bundle size
- **Server-Side Rendering (SSR)** via `@angular/ssr` + Express — pages are pre-rendered on the server for fast first-paint and SEO

### UI — Angular Material 19 + Tailwind CSS 3

A dual-layer styling system:

- **Angular Material 19 (MDC-based)** provides accessible, production-grade UI primitives: form fields, buttons, icons, spinners, and snackbars — all with keyboard and screen-reader support out of the box
- **Tailwind CSS 3** handles layout utilities and responsive breakpoints (`container`, `mx-auto`, responsive grid variants)
- **Custom design tokens** via CSS custom properties (`--primary`, `--radius-card`, `--shadow-hover`, etc.) keep the visual language consistent across all components
- **BEM methodology** throughout all component templates and SCSS files — every element is self-documenting even without styling needs
- **Global SCSS** (`styles.scss`) houses shared keyframe animations (`fadeUp`, `float`, `shimmer`, `slotDrop`), scroll-driven reveal utilities, and Angular Material MDC overrides

### Backend & Database — Supabase

[Supabase](https://supabase.com) provides the entire backend as a managed service:

- **Authentication** — email/password sign-up and sign-in via Supabase Auth, with session state propagated through a `ReplaySubject`-backed `AuthService`. Auth state changes trigger immediate reactive updates across the app
- **PostgreSQL database** — cars and favourites are stored in a real Postgres instance. All queries go through the Supabase JS client and are wrapped in `Observable` streams via `from()` for seamless RxJS integration
- **Row-level security** on the `favourites` table ensures users can only read and write their own data
- **SSR compatibility** — `persistSession`, `autoRefreshToken`, and `detectSessionInUrl` are disabled on the server via `isPlatformBrowser` to prevent `NavigatorLockAcquireTimeoutError` in Node

### State Management

No third-party state library. State is managed at the appropriate layer:

- **`FavoritesService`** — a singleton reactive store for favourite car IDs. Holds a `signal<Set<string>>`, loads once on auth state change, and exposes an `isFavorite(id)` computed check. Components read from it via `computed()` — no DB calls per card
- **`CarService`** — holds a `signal<Car | null>` for the selected car, acting as a client-side cache between the list and detail views to avoid redundant network requests
- **`AuthService`** — `ReplaySubject<UserResponse | null>(1)` backed by `onAuthStateChange`, exposing both the raw response and a clean `currentUser$: Observable<User | null>` for components

### Runtime Internationalisation (i18n)

A lightweight, zero-dependency runtime translation system built in-house:

- **`TranslationService`** — signal-based service that loads flat-key JSON files from `assets/i18n/{locale}.json` via `HttpClient`. Locale preference is persisted to `localStorage`
- **`TranslatePipe`** — `pure: false` pipe backed by an `effect()` that calls `ChangeDetectorRef.markForCheck()` on locale change, ensuring every `OnPush` component re-renders instantly
- **`SlotTextDirective`** — accepts translated text as a signal input (`[appSlotText]="key | translate"`), uses `effect()` to re-render animated letter spans on every locale change. Browser-only DOM manipulation guarded by `isPlatformBrowser`
- Supports **English** and **Bulgarian** — switching is instant with no page reload or server round-trip

### Build Tooling

- **esbuild** via `@angular-devkit/build-angular:application` — Angular's modern builder. Significantly faster cold builds and rebuilds than the legacy Webpack-based builder
- **Development config** — `optimization: false`, `namedChunks: true`, `extractLicenses: false` for readable output during development
- **Production config** — full minification, tree-shaking, and bundle budgets (1 MB warning / 2 MB error on initial chunk)

---

## Project Structure

```
src/
├── app/
│   ├── common/
│   │   ├── directives/        # SlotTextDirective
│   │   ├── pipes/             # TranslatePipe, FormErrorPipe
│   │   └── global-constants.ts
│   ├── components/
│   │   ├── car-list/          # CarListComponent, CarItemComponent, CarViewComponent
│   │   ├── global/            # Header, Footer, Search, Menu, PageNotFound
│   │   ├── homepage/          # Hero section + car listing page
│   │   └── user/              # Login, Register, Profile
│   ├── guard/                 # authGuard, guestGuard (functional CanActivateFn)
│   ├── interfaces/            # Car, typed Supabase responses
│   └── services/
│       ├── auth/              # AuthService
│       ├── car/               # CarService (selected-car signal cache)
│       ├── database/          # DatabaseService (all Supabase queries → Observable)
│       ├── favorites/         # FavoritesService (reactive favorites store)
│       ├── supabase/          # SupabaseService (single client instance)
│       └── translation/       # TranslationService
├── assets/
│   ├── fonts/Lato/            # Self-hosted Lato (Thin → Black, all weights)
│   ├── i18n/                  # en.json, bg.json
│   └── images/
└── server.ts                  # Express SSR server
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (with SSR)
ng serve

# Production build
ng build
```

Open `http://localhost:4200` in your browser. The app reloads automatically on file changes.

> **Note:** The project requires Supabase credentials. Copy your project URL and anon key into `src/environments/environment.ts` and `src/environments/environment.development.ts`. These files are excluded from version control (`.gitignore`) to protect credentials.
