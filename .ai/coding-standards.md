# Coding Standards

## General Principles
- Prefer clarity over complexity
- Keep code consistent and maintainable
- Use Angular-native patterns whenever possible
- Avoid unnecessary abstractions
- Keep the solution focused and clean

## Angular Version and Development Style
- Use Angular 17
- Prefer standalone components, pipes, and directives
- Use `bootstrapApplication()` instead of `AppModule`
- Use modern Angular patterns aligned with v17+
- Avoid legacy structural syntax when modern alternatives are available

## Standalone First
Standalone is the default standard for this application.

Rules:
- components should be standalone
- pipes should be standalone
- directives should be standalone when applicable
- dependencies should be declared explicitly in `imports`
- do not introduce NgModules unless there is a strong and clear reason

## TypeScript
- Use strict typing
- Avoid `any`
- Create explicit interfaces/types for domain models, auth state, deal state, and form values
- Prefer typed reactive forms where practical
- Keep types close to the feature they belong to

## Project Organization
Organize code by feature and responsibility.

Recommended structure:

- core/
  - guards/
  - services/
  - interceptors/
  - models/
- shared/
  - ui/
  - pipes/
  - directives/
  - utils/
- features/
  - auth/
    - data-access/
    - feature/
    - ui/
    - models/
  - deals/
    - data-access/
    - feature/
    - ui/
    - models/

Guidelines:
- `data-access/` holds services, store-like state, and feature data logic
- `feature/` holds route-level or orchestration components
- `ui/` holds presentational/reusable feature components
- do not use flat folders with unrelated files mixed together

## Components
Components should:
- have a single clear responsibility
- avoid excessive business logic
- delegate state/data logic to services or feature state layers
- keep templates declarative and readable
- be `OnPush` by default
- import only what they need

Prefer splitting components when:
- a page becomes too large
- a form becomes too complex
- table/filter/form sections improve readability when separated

## Change Detection and Performance
Use `ChangeDetectionStrategy.OnPush` in all components.

Rules:
- treat OnPush as the default
- use signals/computed state to drive efficient updates
- avoid mutable patterns that make updates harder to reason about
- avoid heavy calculations directly in templates
- always use `track` in `@for` lists

## Signals
Signals are the default choice for local and feature state when synchronous reactive state is needed.

Use:
- `signal()` for mutable reactive state
- `computed()` for derived values
- `effect()` only for side effects that truly require it

Guidelines:
- prefer signals over RxJS for local UI state
- keep derived state out of templates when possible
- do not overuse `effect()` for logic that belongs in computed values or explicit methods
- keep signals readable and close to the feature that owns them

## RxJS
RxJS is still valid where observables are a natural fit.

Use RxJS for:
- simulated async flows
- API integration
- streams from Angular framework APIs where observables are already the native shape

Do not use RxJS just to recreate simple local state that signals handle more clearly.

## Dependency Injection
Prefer `inject()` over constructor injection when it improves readability and reduces boilerplate.

Examples:
- components
- services
- guards
- injection helper functions

Guidelines:
- use `inject()` consistently
- use constructor injection only when it is clearly more readable
- avoid mixing many DI styles randomly across the project

## Pages vs Reusable Components
- Pages handle route-level orchestration
- Reusable UI components handle focused display and interaction concerns
- Do not place all feature logic inside page components if it harms readability

## Services and State
Services or feature stores should:
- encapsulate authentication logic
- encapsulate deal state and in-memory data logic
- expose clear APIs for components
- centralize data mutation
- avoid leaking internal implementation details

Recommended approach:
- auth state owned by auth data-access service/store
- deals state and filter state owned by deals data-access service/store
- filtered data exposed via computed state when signals are used

Do not introduce NgRx unless there is a strong justification.
For this scope, service-based state with signals is preferred.

## Reactive Forms
Use Reactive Forms for:
- login form
- add deal form
- filter form if a form-based approach is chosen

Rules:
- forms must be explicit and typed where practical
- validators must be readable and centralized
- validation rules must not be duplicated unnecessarily
- derived values like capRate should react to form changes predictably

## FormBuilder
Using `FormBuilder` is recommended when it improves readability and consistency.

Guidelines:
- keep form setup concise
- prefer explicit control naming
- avoid deeply nested form complexity unless the feature truly requires it

## Validation
All user inputs must be validated in the UI.

Use Angular validators for:
- required fields
- numeric constraints
- positive purchasePrice
- non-negative noi

Validation messages should:
- be clear
- be user-friendly
- appear consistently
- not require the user to guess what is wrong

## Derived Values
- capRate is a derived value
- it must be calculated from `noi / purchasePrice`
- do not duplicate capRate logic across multiple components
- keep the formula centralized in a utility, service, or computed structure when reused
- avoid manual user entry for capRate

## Filtering
- filtering is a frontend responsibility
- filtering logic should be centralized and predictable
- combine filters consistently
- do not scatter filtering logic across unrelated components
- expose filtered results clearly from the owning feature state

Preferred approach:
- raw deals state
- filter state
- computed filtered deals state

## Templates
Use modern control flow syntax.

Preferred syntax:
- `@if`
- `@for`
- `@switch`

Rules:
- always use `track` in `@for`
- avoid complex expressions in HTML
- keep templates focused on rendering
- move transformation and orchestration logic to component code or computed state

## Input and Output APIs
Modern Angular input/output APIs may be used when appropriate.

Examples:
- `input()`
- `output()`
- `model()`

Guidelines:
- use them when they improve component API clarity
- keep component communication explicit
- do not introduce two-way binding complexity unnecessarily

## Pipes
Use pipes when they improve readability and separation of concerns.

Possible examples:
- highlight pipe for deal name match
- formatting helpers where built-in pipes are insufficient

Rules:
- pipes should not contain heavy business logic
- keep pure pipes pure whenever possible
- prefer standalone pipes

## Routing
- protect private routes with auth guard
- keep route configuration clear
- prefer lazy loading with `loadComponent()` for standalone pages
- redirect intentionally and predictably
- avoid hidden navigation side effects

## Deferred Rendering
`@defer` may be used only if there is a clear benefit.

Guidelines:
- do not use `@defer` just because it exists
- reserve it for heavier or lower-priority UI sections
- keep the app simple unless deferred rendering adds real value

## Styling
- keep styling clean and consistent
- prioritize readability, spacing, and hierarchy
- avoid overcomplicated visual design
- keep the UI polished but simple

## Error Handling
- present clear feedback for invalid login
- handle empty states gracefully
- avoid silent failures
- keep error behavior consistent across the app

## Naming
Use explicit and descriptive names, with angular older naming convention, using suffix to identify the file type, ex: user.service.ts, list.component.ts, date.pipe.ts.

Prefer:
- `login`
- `logout`
- `isAuthenticated`
- `addDeal`
- `calculateCapRate`
- `applyFilters`
- `filteredDeals`

Avoid vague names like:
- `handleStuff`
- `processData`
- `doAction`

## Functions and Methods
- keep methods short and focused
- extract helper methods when it improves readability
- avoid large methods mixing validation, state updates, and UI concerns

## Testing and Tooling
Recommended standards:
- ESLint with `@angular-eslint`
- Jest
- Testing Library

Even if tests are not fully implemented, code should remain testable:
- predictable state
- isolated logic
- minimal hidden side effects

## What To Avoid
- fat components
- duplicated form logic
- duplicated filtering logic
- excessive RxJS for simple local state
- unnecessary shared abstractions
- excessive third-party dependencies
- overengineering for a small application
- legacy patterns when modern Angular patterns are clearer

## Styling and Design Tokens

The application must use CSS variables (design tokens) for all core styling values.

Rules:
- do not hardcode colors inside components
- always use `var(--color-...)`
- keep styling consistent across features
- use semantic tokens instead of direct colors

Examples:
- use `var(--color-primary)` instead of hex values
- use `var(--color-error)` for error states

Guidelines:
- tokens must be defined in the global stylesheet (`:root`)
- components should consume tokens, not redefine them
- styling should remain simple and readable
- avoid introducing external design systems or UI libraries