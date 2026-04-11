# Project Context

## Project Overview
This project is a simple Angular 17 frontend application for managing real estate deals.

The application must simulate a realistic user experience while keeping the implementation intentionally simple.
Its purpose is to demonstrate clean frontend architecture, Angular best practices, modern Angular patterns, component structure, state handling, form handling, route protection, filtering, and maintainability.

The application should include authentication, private navigation, deal listing, deal creation, and client-side filtering.

## Core Functional Scope
The frontend must support:

1. User login
2. Route protection for private pages
3. Deal listing screen with pre-filled deals
4. Ability to add one or more deals
5. Filtering deals by:
   - deal name
   - purchase price greater than
   - purchase price less than
6. Automatic cap rate calculation:
   - capRate = noi / purchasePrice
7. Optional visual enhancements such as:
   - highlighting matched text in filters
   - cap rate formatting
   - visual feedback for realistic cap rate ranges

## Angular Technical Direction
This project should follow modern Angular 17+ practices.

Preferred standards:
- standalone components by default
- `bootstrapApplication()` instead of `AppModule`
- route-based lazy loading with `loadComponent()` where appropriate
- signals for local and feature state
- `computed()` for derived state
- `effect()` only when truly needed for side effects
- `inject()` as the preferred dependency injection style when appropriate
- modern control flow syntax:
  - `@if`
  - `@for`
  - `@switch`
- `ChangeDetectionStrategy.OnPush` in all components
- explicit tracking in rendered lists

## Authentication Rules
The application must require username and password before allowing access to private pages.

Use the following mock credentials:

- username: admin
- password: 123456

Authentication may be implemented entirely on the frontend or integrated with a simple backend/mock API, depending on project scope.

Expected behavior:
- unauthenticated users can only access login page
- authenticated users can navigate to private pages
- invalid login should show proper feedback
- user session does not need to survive browser refresh unless intentionally implemented

## Deal Definition
A deal consists of:

- id
- dealName
- purchasePrice
- address
- noi
- capRate

Where:
- purchasePrice is a monetary value
- noi is a monetary value
- capRate is derived from noi / purchasePrice

## Persistence Rules
Persistence is not required.

Implications:
- pre-filled data can be hardcoded or loaded from a mock service
- newly added deals may disappear after browser refresh
- application state may be maintained in memory only

## Expected Technical Behavior
The frontend should:
- use Angular 17 best practices
- use a feature-based folder structure
- use standalone components, pipes, and directives by default
- separate UI, state, and business behavior appropriately
- use reactive forms
- use signals for local and feature state where practical
- keep route protection explicit
- implement filtering fully on the frontend
- keep components small and focused
- avoid unnecessary complexity
- be easy to maintain and extend

## Preferred Stack
- Angular 17
- TypeScript
- Angular Router
- Reactive Forms
- Signals
- RxJS where async flows naturally benefit from observables
- built-in Angular features over unnecessary third-party libraries

## Architectural Direction
Use a modular, feature-oriented frontend structure with clear separation of concerns.

Recommended areas:
- core
- shared
- features/auth
- features/deals

Recommended responsibilities:
- `data-access/` for state and service logic
- `pages/` for route-level or orchestration components (one folder per page)
- `ui/` for reusable/presentational feature components

## State Direction
State management should remain simple and explicit.

Preferred approach:
- use signals for local and feature state
- use computed values for derived state such as filtered deals or cap rate display
- keep filter state centralized
- use RxJS only where asynchronous behavior naturally fits
- avoid introducing heavyweight state libraries unless absolutely justified

## UX Direction
The application should feel polished but simple.

Suggestions:
- clear login flow
- clean table/list display
- intuitive add-deal form
- responsive layout when reasonable
- formatted currency and percentages
- immediate feedback when filtering
- automatic cap rate update while user types

## UI and Styling Guidelines

The application should use a simple design system based on CSS variables.

- all colors must come from design tokens
- avoid hardcoded values in components
- ensure visual consistency
- keep UI clean and minimal

Focus on:
- readability
- spacing
- consistent colors
- simple but polished UI

## How to Respond
When assisting in this project, always:

- explain decisions before or alongside implementation
- follow modern Angular best practices
- prefer simple and explicit solutions
- preserve separation of concerns
- keep the implementation clean and consistent
- use Angular-native patterns where possible
- avoid overengineering
- suggest improvements only if they fit the project scope

## What Not To Do
- do not introduce unnecessary state libraries unless clearly justified
- do not overengineer architecture for a small application
- do not mix too much business logic into components
- do not skip form validation
- do not skip route protection
- do not use `any` unless absolutely unavoidable
- do not add unnecessary external UI libraries unless specifically requested
- do not use legacy Angular patterns when modern Angular patterns are clearer

## Implementation Philosophy
This frontend should feel like a small but well-structured real application:
simple scope, polished behavior, modern Angular design, and production-minded organization.