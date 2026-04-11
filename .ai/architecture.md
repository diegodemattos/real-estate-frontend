# Architecture

## Objective
Build a simple but realistic Angular 17 frontend for managing real estate deals.

The application must provide:
- login screen
- protected private routes
- deal listing screen
- ability to add deals
- client-side filtering
- cap rate auto-calculation
- maintainable and structured Angular code

## Architectural Style
Use a feature-based frontend architecture aligned with modern Angular 17+ patterns.

This is the best fit because:
- the application has distinct functional areas
- it keeps domain concerns grouped together
- it scales better than organizing only by file type
- it aligns well with standalone components, lazy loading, and local feature state

## Angular Modern Standards Adopted
This application should follow modern Angular development practices:

- standalone components as the default approach
- `bootstrapApplication()` instead of `AppModule`
- route configuration with modern lazy loading
- signals for local and feature state where appropriate
- computed values for derived state
- effect only when side effects are truly needed
- `inject()` instead of constructor injection where it improves readability
- new control flow syntax (`@if`, `@for`, `@switch`)
- `ChangeDetectionStrategy.OnPush` in all components
- explicit `track` usage in list rendering

## Suggested High-Level Structure

src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   ├── services/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── utils/
│   ├── shared/
│   │   ├── ui/
│   │   ├── pipes/
│   │   ├── directives/
│   │   └── utils/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data-access/
│   │   │   ├── feature/
│   │   │   └── ui/
│   │   └── deals/
│   │       ├── data-access/
│   │       ├── feature/
│   │       └── ui/
│   ├── app.component.ts
│   └── app.routes.ts

## Responsibilities by Area

### Core
Contains application-wide singleton and infrastructure concerns.

Suggested contents:
- auth/session service
- route guards
- interceptors if needed
- app-wide constants
- global models only when truly shared
- helper functions related to app bootstrapping or session handling

Core should contain things used globally and instantiated once.

### Shared
Contains reusable pieces not tied to a single feature.

Suggested contents:
- reusable UI components
- pipes
- directives
- utility functions
- presentational primitives

Examples:
- page shell or card component
- highlight pipe
- empty state component
- loading indicator
- formatting helpers when built-in pipes are not enough

### Features/Auth
Responsible for authentication flow.

Suggested contents:
- login page
- login form UI
- auth service/store in data-access
- auth models
- auth-specific helpers

Responsibilities:
- render login page
- validate user credentials
- store authenticated state
- redirect after login
- protect access to private routes indirectly through shared auth state

### Features/Deals
Responsible for deal-related behavior.

Suggested contents:
- deals page
- deals table
- deal form
- filter panel
- deals data-access service/store
- deal models

Responsibilities:
- expose pre-filled deals
- display list of deals
- add new deals
- apply client-side filtering
- compute and display cap rate
- optionally highlight matches in deal name filtering

## Standalone Strategy
Use standalone components, standalone pipes, and standalone directives by default.

Implications:
- avoid NgModules unless there is a very strong reason
- compose screens through component imports
- use `bootstrapApplication()` for app startup
- keep dependencies explicit in each component

## Routing Strategy
Use modern Angular routing with lazy loading where it improves structure.

Suggested routes:
- /login
- /deals

Rules:
- /login is public
- /deals is private
- default route may redirect based on auth state
- unauthorized users must be redirected to login

Recommended modern routing style:
- use `loadComponent()` for page-level standalone routes
- use lazy route files if the feature grows enough to justify it

## State Strategy
Keep state simple, explicit, and feature-oriented.

Recommended approach:
- use signals for local UI state and derived values
- use a service or store-like class in `data-access/`
- use `computed()` for filtered lists and cap rate derivations when appropriate
- use `effect()` only for real side effects
- avoid introducing heavyweight global state for a small application

Suggested split:
- auth state managed in auth data-access layer
- deal list and filters managed in deals data-access layer

Signals are preferred for local and feature state.
RxJS can still be used where observables are a natural fit, such as async flows or API simulation.

## Data Source Strategy
Persistence is not required.

Recommended options:
1. In-memory data inside a feature service/store
2. Local mock data file
3. Mock API abstraction returning observables

Best direction:
- use a service/store in `data-access/`
- keep mock data in memory
- optionally simulate API shape using observables
- keep the implementation simple but realistic

## Component Strategy
Separate route-level orchestration from focused UI components.

Recommended split:
- `feature/` for smart or route-level components
- `ui/` for presentational/reusable components
- `data-access/` for state, services, and feature logic

Possible examples:
- `features/auth/feature/login-page.component.ts`
- `features/deals/feature/deals-page.component.ts`
- `features/deals/ui/deals-table.component.ts`
- `features/deals/ui/deal-form.component.ts`
- `features/deals/ui/deal-filters.component.ts`

## Dependency Injection Strategy
Prefer modern dependency injection with `inject()` when it improves clarity and reduces boilerplate.

Use cases:
- components
- services
- guards
- helper injection functions

Guidelines:
- use constructor injection only when it is clearly more readable
- keep dependency access explicit and localized

## Template Strategy
Use modern Angular control flow syntax.

Preferred syntax:
- `@if` instead of `*ngIf`
- `@for` instead of `*ngFor`
- `@switch` instead of `*ngSwitch`

Rules:
- always use `track` in `@for`
- keep templates declarative and readable
- move complex logic out of templates into computed state or helper methods

## Form Strategy
Use Reactive Forms.

Reasons:
- better control for validation
- easier derived value handling
- stronger structure for login, creation, and filtering flows
- aligns well with Angular best practices

Expected forms:
- login form
- add deal form
- optional filter form

## Cap Rate Rule
capRate must be calculated automatically from:
- noi / purchasePrice

Guidelines:
- update reactively while user types
- avoid manual capRate input
- display formatted value clearly
- do not show misleading values when form input is incomplete or invalid

## Filtering Strategy
Filtering must happen entirely on the frontend.

Required filters:
- deal name
- purchase price greater than
- purchase price less than

Recommended behavior:
- partial match for deal name
- case-insensitive comparison preferred
- multiple filters must combine cleanly
- clearing filters should restore full list

Recommended implementation:
- keep raw deals state in one place
- keep filter state in one place
- expose filtered results as a computed value

Optional enhancement:
- highlight matching fragments in deal name results

## Performance Strategy
Performance decisions should follow modern Angular defaults:

- all components should use `ChangeDetectionStrategy.OnPush`
- signals should drive fine-grained reactive updates
- lists must use `track` in `@for`
- avoid unnecessary recomputation in templates
- use `@defer` only if a heavy section genuinely benefits from lazy template rendering

For this application, `@defer` is optional and should only be used if there is a meaningful UI section worth deferring.

## Validation Strategy
Validate all user input clearly in the UI.

Login validation:
- required username
- required password

Deal validation:
- required deal name
- required purchase price
- required address
- required noi
- purchasePrice must be > 0
- noi must be >= 0

## UX Principles
- keep interface clean and readable
- give immediate feedback for invalid input
- keep filtering intuitive
- show clear empty states
- show formatted money and percentage values
- keep interactions fast and predictable

## Design System and Styling Strategy

The application should use a simple design system based on CSS variables (design tokens).

All core colors must be defined globally using `:root` variables.

Example tokens:

- primary colors
- background and surface colors
- text colors
- border colors
- semantic colors (success, warning, error)

Guidelines:
- components must consume tokens via `var(--color-...)`
- avoid hardcoded colors inside components
- ensure visual consistency across the application
- keep styling simple, clean, and maintainable

## Testing and Tooling Direction
Recommended project standards:
- ESLint with `@angular-eslint`
- unit testing with Jest and Testing Library where applicable

Testing is not the main scope, but the architecture should support easy testing.

## Non-Goals
- advanced global state architecture
- SSR or hydration for this scope
- unnecessary third-party UI frameworks
- backend persistence
- complex API orchestration