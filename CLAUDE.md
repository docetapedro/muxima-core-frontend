# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server on http://localhost:5173 (proxies /api -> http://localhost:8000)
npm run build     # Production build into dist/
npm run preview   # Preview the built bundle
```

There is no test runner, linter, or formatter configured.

`.env` sets `VITE_API_URL` (the Laravel API base). The dev-server proxy is a fallback for `/api/*` calls — most `service` modules call `http.get('/api/...')` against the absolute `VITE_API_URL`.

Path alias: `@` → `./src` (Vite + use it in imports, e.g. `@/api/http`).

## Architecture

Vue 3 (Composition API, `<script setup>`) SPA backed by a Laravel API. UI strings, identifiers, and most code comments are in **Portuguese** — match that language when adding new modules. The app is a CRUD admin built from a single repeating pattern; understand the pattern once and most modules become mechanical.

### Auth + HTTP (`src/api/`, `src/stores/auth.js`)

- Sanctum Bearer + refresh token, persisted in `localStorage` (`access_token`, `refresh_token`, `user`).
- `src/api/http.js` is the single axios instance every service imports. It:
  - Injects `Authorization: Bearer <access_token>` on every request.
  - On a `401`, transparently calls `POST /api/refresh-token`, **queues** concurrent in-flight requests via `failedQueue`, retries them once the new token lands, and on refresh failure clears storage and hard-redirects to `/login`.
- `useAuthStore` (Pinia) owns login/logout and exposes `isAuthenticated`, `isAdmin`, `hasPermission(perm)` (where `permissions: ['*']` is a wildcard).
- Router guards in `src/router/index.js` enforce `meta: { requiresAuth }` and `meta: { guest }`.

### The CRUD module pattern

Every domain module (entidades, imoveis, moedas, …) is composed of five files in fixed locations:

| Layer | Location | Role |
|---|---|---|
| Service | `src/services/{module}Service.js` | Thin axios wrapper exposing `listar / criar / atualizar / eliminar` (Portuguese verbs — do not rename). |
| Form helpers | `src/utils/{module}Form.js` | `empty{Module}()` defaults and `{module}FromRecord(r)` to map API → form state. |
| Components | `src/components/{module}/` | `{Module}FormModal.vue`, `{Module}FormFields.vue`, `{Module}ViewModal.vue`. |
| Pages | `src/pages/{module}/Index.vue` (and `Show.vue` if detail page exists). |
| Route | Entry in `src/router/index.js` **and** an entry in `src/config/implementedRoutes.js`. |

The Index page is wired with `useCrud(service)` (`src/composables/useCrud.js`), which expects the API response to be shaped:

```js
{ dados: { items: [...], paginacao: {...} } }
```

— that wrapper is non-standard and lives only in `useCrud`; do not flatten it. Errors should go through `useApiErrorHandler` (`src/composables/useApiErrorHandler.js`), which treats `422` specially by writing `data.errors` into the supplied `validationErrorsRef`.

### Navigation, routes, and "under construction" placeholders

`src/config/navigation.js` is the single source of truth for the sidebar (titles, groups, nested groups, icons from `lucide-vue-next`). The router builds two kinds of routes:

1. Hand-written routes in `src/router/index.js` for modules that are actually implemented.
2. `buildPlaceholderRoutes()` (`src/router/placeholderRoutes.js`) walks every link in `navigation.js`, filters out anything in `implementedRoutes.js`, and auto-mounts `ModuleUnderConstruction.vue` for the rest.

**Therefore: when you ship a new module, you must add its path to both `src/router/index.js` and `src/config/implementedRoutes.js`** (both exact `EXACT_PATHS` and any `:id` variant in `PATH_PATTERNS`) — otherwise the placeholder route will shadow your real page or the nav link will still show as "under construction".

### Money / number formatting (`src/utils/formatacao.js`)

Replicates PHP's `number_format($v, $casas, ',', ' ')` — comma decimal separator, space thousands separator. Use these helpers (`converteParaMonetario`, `formataEntradaNumerica`, `parseValorMonetarioEntrada`, …) rather than `toLocaleString` so values match the Laravel backend exactly.

### UI conventions

- shadcn-vue tokens (`bg-card`, `text-muted-foreground`, `border-border`, `text-primary-foreground`, …) drive theming via CSS variables in `src/assets/index.css`; dark mode is class-based (`darkMode: ['class']`).
- Toasts: `vue-sonner`, mounted globally in `App.vue`.
- Icons: `lucide-vue-next`.
- Modals follow `components/common/ModalWrapper.vue` + `ConfirmDeleteModal.vue`.
