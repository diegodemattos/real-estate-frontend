# TermSheet

Angular 17 frontend for real estate deal management — authentication,
private navigation, deal CRUD with filters and automatic cap rate calculation,
built with signals, NgRx Store, NgRx Signals, and an HTTP layer that can
point to a real backend or run against an embedded mock.

Hosted at: https://real-estate-frontend-ten-pink.vercel.app/

---

## Stack

* **Angular 17** — standalone components, signals, new control flow (`@if`, `@for`)
* **TypeScript 5.4**
* **RxJS 7.8** — asynchronous flows where appropriate
* **@ngrx/signals e @ngrx/store** — Store with actions/effects/facade pattern for centralized state and SignalStore for smaller features
* **Reactive Forms + ControlValueAccessor** — a single reusable input component across all forms
* **SCSS with CSS custom properties** — theme switching without recompiling components
* **Manrope** — custom font served from assets
* **Jest 29 + jest-preset-angular 14** — 48 test suites, ~227 tests

---

## Features

* **Login / logout** — JWT Bearer persisted in `localStorage`, guards on every navigation
* **Password recovery** — `POST /auth/forgot-password` with generic feedback
* **Protected `/main` area** — synchronous guard + automatic redirect to `/public/login` when session expires
* **Deals CRUD** — list, create, edit (with modal loader while fetching), delete (with confirmation + button loader)
* **Deals Analysis** — scatter chart visualization of deals (NOI vs Purchase Price)
* **Filters** — name search with debounced visual highlight, price range filtering (Min / Max)
* **Toast notifications** — auto-dismissing success/error toasts with manual dismiss
* **Cap rate badge** — automatic classification into good / high / low with distinct colors
* **Responsive layout** — sidebar becomes drawer, table becomes stacked cards on mobile, auth adapts to single-column layout

---

## Running the Project

### Prerequisites

* Node 18+
* npm

### Installation

```bash
npm install
```

### Dev with mock (offline)

```bash
npm run start
```

Runs the dev server with the `development` configuration, replacing
`environment.ts` with `environment.development.ts` at build time
(`production = false`). `app.config.ts` reads this flag and registers
the `mockInterceptor` — all requests to `API_BASE_URL/...` are intercepted
and served with data from `localStorage`. Ideal for UI development
without backend dependency.

Mock credentials:

```
email:    admin@termsheet.com
password: Ts@123456
```

### Dev with real backend

```bash
npm run start:prod
```

Uses the `production` configuration, so `environment.production === true`
and the `mockInterceptor` is **not** applied. Requests go directly to
`API_BASE_URL` configured in `src/app/core/config/api.config.ts`.

### Production build

```bash
npm run build
```

Optimized bundle in `dist/real-estate-frontend/` with hashing, minification,
and budgets. Uses `environment.ts` (production, no mock).

### Dev build

```bash
npm run build:dev
```

Same output, without optimization, with sourcemaps and mock enabled.

### Watch

```bash
npm run watch
```

Incremental build in dev configuration.

---

## Tests

```bash
npm test
```

Runs Jest against all `*.spec.ts` files in `src/`. The suite covers HTTP services,
NgRx stores (features, effects, facades), guards, interceptors, pipes, validators,
directives, shared components, layouts, and feature components —
48 suites, ~227 tests passing in ~9s.

Coverage report:

```bash
npx jest --coverage
```

HTML output available at `coverage/lcov-report/index.html`.

---

## Folder Structure

```
src/
├── app/
│   ├── app.component.{ts,html,scss}   minimal shell with <router-outlet />
│   ├── app.config.ts                  global providers (router + http + interceptors)
│   ├── app.routes.ts                  top-level routes (public / main)
│   │
│   ├── core/                          global infrastructure
│   │   ├── config/api.config.ts       API_BASE_URL
│   │   ├── guards/                    authGuard, publicGuard
│   │   ├── http/interceptors/         auth.interceptor + skip-auth token
│   │   ├── mock/                      mock interceptor, seed data, request models
│   │   ├── models/                    stored-session model
│   │   ├── services/session.service   JWT persistence + hydration
│   │   └── state/                     core feature (actions, effects, facade)
│   │
│   ├── domain/                        pure business logic (framework-agnostic)
│   │   ├── functions/cap-rate.functions.ts
│   │   └── models/deal.model.ts
│   │
│   ├── shared/                        reusable, domain-agnostic
│   │   ├── directives/autofocus       declarative autofocus
│   │   ├── icons/                     eye-icon, eye-off-icon (SVG components)
│   │   ├── pipes/highlight.pipe.ts
│   │   ├── services/notification      toast notification service
│   │   ├── validators/no-whitespace   custom form validator
│   │   └── ui/
│   │       ├── button/
│   │       ├── link/
│   │       ├── alert/
│   │       ├── modal/
│   │       ├── confirm-modal/
│   │       ├── form-input/            CVA with password toggle + coercion
│   │       ├── empty-state/
│   │       └── toast/                 auto-dismissing notifications
│   │
│   ├── layouts/                       page shells
│   │   ├── auth-layout/
│   │   └── main-layout/
│   │       ├── main-header/
│   │       ├── main-menu/
│   │       └── main-footer/
│   │
│   └── features/                      business domains
│       ├── auth/                      login, password recovery (actions/effects/facade)
│       ├── deals-intake/              CRUD with filters (actions/effects/facade)
│       └── deals-analysis/            scatter chart visualization (signalStore)
│
├── environments/
├── assets/
└── styles.scss
```

---

## Strengths of the Project

### 1. Clear separation of concerns

* **`core/`** — app-wide infrastructure (config, guards, interceptors, session)
* **`shared/`** — reusable UI, domain-agnostic
* **`layouts/`** — visual shells only
* **`domain/`** — pure business logic, no framework dependency
* **`features/`** — isolated business domains with consistent structure (actions/effects/facade)

Predictable structure: file paths reflect responsibility.
No cross-layer leakage (e.g., shared doesn’t depend on features).

---

### 2. Dual state management: `@ngrx/store` + `@ngrx/signals`

**Global and complex state → NgRx Store** (actions / effects / facade):

* **CoreFeature** — app-wide session state with synchronous hydration (no UI flicker)
* **AuthFeature** — login / logout / password recovery flows
* **DealsFeature** — deals CRUD, filters, loading/mutation states with computed selectors

**Simpler features → NgRx Signals** (signalStore):

* **DealsAnalysisStore** — analysis-specific data for chart visualization

Each NgRx Store feature exposes a **facade** as the single public API for components.
Direct signal consumption in templates → **zero boilerplate**.

---

### 3. Scalable architecture with layouts + nested routes

Two layout roots with lazy-loaded feature routes:

```
/public              → AuthLayout (+publicGuard)
  /auth/login
  /auth/password-recovery
/main            → MainLayout (+authGuard)
  /deals         → deals-intake (CRUD + filters)
  /analysis      → deals-analysis (scatter chart)
```

Guards applied at layout level → automatic inheritance.

**Adding a new feature = 3 steps:**

1. Create feature page
2. Register route
3. Add menu item

Shell remains untouched → high scalability.

---

### 4. Environment-driven mock system

Interceptor chain is conditionally assembled:

* Dev → includes mock
* Prod → real API only

Services remain **pure and unaware of environment** → no branching logic.

---

### 5. Reusable form input with CVA

Single `<app-form-input>` used across all forms:

* Login
* Password recovery
* Deal form
* Filters

Features:

* Label + accessibility support
* Password toggle
* Automatic validation messages
* Value coercion
* Theming via CSS variables

---

### 6. Shared UI components

Reusable presentational components:

* `<app-button>`, `<app-modal>`, `<app-confirm-modal>`, `<app-alert>`, `<app-toast>`, `<app-empty-state>`, etc.

Example: button includes built-in loading state →
**no duplicated logic across features**.

---

### 7. Theming via CSS custom properties

All design tokens centralized:

* Colors (brand, semantic, surfaces)
* Typography
* Spacing, radius, shadows

No hardcoded values → **instant theme switching**.

---

### 8. Fully responsive (CSS-only)

Four breakpoints handled purely via CSS:

* Sidebar → drawer
* Table → cards
* Layout adaptations

No JS-based responsiveness → **clean, scalable UI logic**.

---

### 9. Domain layer

Pure, framework-agnostic business logic in `domain/`:

* `cap-rate.functions.ts` — cap rate computation shared by mock interceptor and store
* `deal.model.ts` — canonical Deal interface consumed across features

**No Angular imports** → easily testable and reusable.

---

### 10. Testing with Jest

* 48 suites, ~227 tests, ~9s execution
* High coverage across all layers

Patterns:

* `HttpTestingController` for services
* NgRx feature/effects/facade isolation
* CVA testing via host components
* `fakeAsync` + `tick` for timing-sensitive behavior

---

## Login Flow (End-to-End)

Clean, reactive flow:

* Login → token → fetch user → update store
* Error handling resets session safely
* Sync hydration prevents UI flicker on refresh

---

## Deal CRUD Flow

* Edit opens modal with loader
* Data fetched → form rendered
* Submit triggers mutation → store updated
* UI reacts automatically via signals

---

## API Contract

Standard REST endpoints for auth and deals using: https://real-estate-backend-production-4dfb.up.railway.app/api

`capRate` calculated server-side (`noi / purchasePrice`).

---

# 🏗️ Architecture Decisions & Development Timeline

## 📌 Overview

This project was designed and implemented with a strong emphasis on **engineering maturity and long-term scalability**, rather than short-term implementation speed.

It prioritizes:

* Scalability
* Maintainability
* Clear separation of concerns
* Predictable data flow
* Developer experience

> **The goal was not just to deliver features, but to design a system that can evolve safely over time.**

---

## 🎯 Development Philosophy

> **This project intentionally focuses on macro-level engineering decisions rather than micro-level implementation details.**

Instead of optimizing isolated pieces of code, the effort was directed toward:

* Defining a scalable project structure
* Establishing clear architectural boundaries
* Designing for future extensibility
* Reducing coupling between layers
* Ensuring consistency across the codebase

> **In production systems, architecture decisions outlive individual implementations — this project reflects that mindset.**

---

## 🧠 Key Engineering Principles Applied

* Prefer **clarity over cleverness**
* Favor **explicit architecture over implicit behavior**
* Design for **change, not just for current requirements**
* Avoid **premature optimization**
* Optimize for **developer experience and maintainability**

> **Every decision was evaluated based on its long-term impact, not just immediate output.**

---

# 🕒 Development Timeline

## 🚀 1. Project Initialization

* Created a new project using Angular 17 CLI
* Initialized version control on GitHub
* Configured CI/CD with Vercel for automatic deployment

> **CI/CD was introduced from day one to mirror production-grade workflows and enable fast feedback cycles.**

---

## 🤖 2. AI-Assisted Development Setup

* Introduced a structured `.ai` context layer:

  * Architecture definition
  * Coding standards
  * Business rules

> **AI was used as a productivity multiplier, not as a source of truth — all outputs were guided and constrained by predefined architecture.**

---

## 🎨 3. Design System Foundation

* Extracted visual tokens from reference UI
* Created CSS-based design tokens
* Enforced consistency via AI instructions

> **Even without full design access, the system was built to ensure visual consistency and reusability.**

---

## 🔐 4. Initial Feature Delivery

* Implemented authentication flow
* Built Deals CRUD

> **Initial delivery focused on validating the core flow before introducing complexity.**

---

## 🧩 5. Iterative UI Evolution

* Refactored CRUD into modal-based interactions

> **UI complexity was reduced by separating concerns between listing and actions.**

---

## 💾 6. Persistence Strategy

* Migrated from in-memory to `localStorage`

> **This allowed simulation of real-world persistence without introducing backend dependency too early.**

---

## 🧱 7. Layout Architecture

* Introduced Public vs Private layouts

> **Clear separation of application contexts improves scalability and reduces coupling.**

---

## 🔌 8. API Abstraction (Interceptor)

* Centralized mock logic in interceptor

> **Decoupling API simulation from business logic allows seamless transition to real backend integration.**

---

## 🧠 9. State Management

* Implemented **NgRx Store** with **actions / effects / facade** for global and complex state (core, auth, deals)
* Implemented **NgRx Signals** (signalStore) for simpler features (deals analysis)
* Introduced a **domain layer** (`domain/`) for pure business logic shared across stores and mock

> **Chose the right tool for each level of complexity — full Store for features that need actions, effects and predictable flow; lightweight signalStore where simpler state suffices.**

---

## 🧱 10. Reusable Component Strategy

* Built reusable UI components
* Implemented ControlValueAccessor for form inputs

> **Reusability and consistency were prioritized to reduce duplication and enforce standards.**

---

## 🌍 11. Environment Strategy

* Configured dev vs production environments
* Integrated real API via Railway

> **Environment separation ensures flexibility and mirrors real-world deployment scenarios.**

---

## 🧹 12. Code Review & Refinement

* Refactored for readability and consistency

> **Code was treated as a long-term asset, not a disposable implementation.**

---

## 🧪 13. Testing Strategy

* Implemented unit tests using Jest — **48 suites, ~227 tests**

Focused on:

* Domain functions (cap rate)
* State management (features, effects, facades)
* Guards, interceptors, services
* Shared components (CVA, toast, modals)
* Feature pages and UI components

> **Tests were written to validate behavior and enable safe refactoring — not just to increase coverage metrics.**

---

# ⚖️ Trade-offs & Design Decisions

## ❌ Focus on macro architecture over micro optimizations

* Avoided deep micro-optimizations inside components

> **Engineering effort was intentionally directed toward system design rather than isolated code improvements.**

---

## ❌ Avoided over-engineering

* No unnecessary abstractions
* No premature complexity

> **Complexity was introduced only when justified by real needs.**

---

## ❌ Right-sized state management

* NgRx Store for features that need predictable action/effect flows
* NgRx Signals for features where a simple signalStore is enough

> **Chose the right level of complexity for each feature instead of forcing a single pattern everywhere.**

---

# 🏁 Final Outcome

The objective of this project is to demonstrate:

* Architectural thinking
* Ability to balance simplicity and scalability
* Pragmatic decision-making
* Real-world engineering mindset

---

# 🧠 Final Statement

> **This project is less about what was built, and more about how and why it was built this way.**

---

## License

Demo project.