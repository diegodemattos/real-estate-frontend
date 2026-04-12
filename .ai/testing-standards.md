# Testing Standards

## Testing Philosophy
Tests should validate behavior, not implementation details.

The goal of testing in this project is to provide confidence, prevent regressions, and document expected behavior.
Tests must remain readable, maintainable, and focused on real application value.

Preferred mindset:
- test what the user or consumer observes
- test business rules and state transitions
- avoid testing framework internals
- avoid brittle tests tightly coupled to markup or private implementation

## Testing Stack
This project uses:

- Jest
- Angular TestBed
- Angular testing utilities
- mocking only where necessary

Recommended complementary tools when useful:
- Testing Library patterns and mindset
- Jest spies and mocks in moderation

## What Should Be Tested
Prioritize tests for:

- services with business logic
- stateful services or feature stores
- guards
- pipes with meaningful transformation
- components with relevant UI behavior
- forms with validation and derived values
- authentication behavior
- filtering behavior
- cap rate calculation behavior

## What Not To Prioritize
Do not over-invest in tests for:

- trivial getters/setters
- framework wiring with no custom behavior
- pure markup with no meaningful logic
- implementation details that may change during refactor
- Angular internals already covered by the framework

## Testing Pyramid Direction
Prefer a balanced approach:

1. Unit tests for business logic and services
2. Component tests for meaningful UI behavior
3. Small integration-style tests where valuable

Do not create excessive end-to-end-like complexity inside unit tests.

## General Rules
- keep tests deterministic
- keep tests isolated
- avoid hidden dependencies between tests
- each test should verify one clear behavior
- use descriptive test names
- avoid unnecessary mocking
- reset mocks between tests when needed
- avoid shared mutable test state across test cases

## Naming Conventions
Test descriptions should clearly communicate expected behavior.

Preferred style:
- `should return the authenticated user when credentials are valid`
- `should block navigation when the user is not authenticated`
- `should calculate cap rate when purchase price and noi are provided`
- `should filter deals by deal name`

Avoid vague descriptions such as:
- `works correctly`
- `tests service`
- `should work`

## Arrange / Act / Assert
Structure tests clearly using Arrange / Act / Assert.

Recommended format:
- arrange test data and mocks
- act by invoking the behavior
- assert expected outcome

Keep setup readable and minimal.

## Test File Organization
Keep tests close to the unit being tested whenever possible.

Examples:
- `auth.service.spec.ts`
- `auth.guard.spec.ts`
- `deals.service.spec.ts`
- `deal-form.component.spec.ts`
- `highlight.pipe.spec.ts`

Prefer one spec file per unit.

## Services
Services should be tested thoroughly when they contain business logic.

Focus on:
- returned values
- state transitions
- derived values
- edge cases
- invalid scenarios
- interactions with collaborators when relevant

Examples:
- login success and failure
- adding a deal
- recalculating cap rate
- applying filters
- resetting filtered state

## Components
Component tests should validate meaningful UI behavior.

Focus on:
- rendered state
- conditional rendering
- emitted events
- form validation messages
- button enabled/disabled state
- user-triggered interactions
- displayed derived values

Avoid:
- testing private methods directly
- asserting internal implementation details unless absolutely necessary
- over-coupling to CSS classes that may change often unless they are meaningful to behavior

## Forms
Forms deserve direct behavioral tests.

Test:
- required validation
- invalid and valid states
- field interaction behavior
- error message display
- submit enablement/disablement
- derived values such as capRate

Examples:
- should mark login form invalid when username is empty
- should not allow submit when purchase price is zero
- should update cap rate when noi changes

## Guards
Guards should be tested based on navigation outcomes and auth rules.

Test:
- navigation allowed when authenticated
- navigation blocked when not authenticated
- redirect behavior when applicable

Do not test Angular router internals.
Test only the guard's own decision logic.

## Pipes
Pipes should be tested when they contain meaningful logic.

Examples:
- highlight pipe wrapping matched text
- formatting pipe with fallback behavior

Test:
- normal input
- empty input
- edge cases
- case-insensitive behavior if applicable

## State and Signals
When testing signal-based state:
- verify the observable behavior of the state
- assert the resulting values from signals or computed values
- focus on public API and state outcomes
- avoid testing internal implementation structure unnecessarily

If a store/service exposes signals or computed state:
- validate initial state
- validate updates after actions
- validate derived state consistency

## RxJS Usage
If RxJS is used:
- test emitted values and side effects clearly
- prefer simple synchronous observable tests when possible
- use async utilities only when truly needed
- avoid overcomplicated marble testing unless the observable logic is truly complex

For simple frontend application flows, prefer readable tests over advanced RxJS testing techniques.

## Mocking Guidelines
Mock only what you need.

Prefer:
- lightweight stubs
- simple spies
- realistic test data

Avoid:
- deeply nested mock objects with unnecessary fields
- mocking everything by default
- mocking the unit under test

Rules:
- mock external dependencies
- do not mock pure logic unnecessarily
- do not overuse spies when direct behavior assertion is enough

## DOM Assertions
When testing components:
- assert what is visible or interactive
- check rendered text, form states, and user-triggered effects
- prefer stable selectors when needed
- avoid brittle selectors based on incidental structure

If using `data-testid`, use it intentionally and sparingly.

## Async Testing
Use async testing only when behavior is truly asynchronous.

Guidelines:
- prefer synchronous tests for synchronous code
- use `fakeAsync` and `tick()` carefully
- use `waitFor`-style approaches only where appropriate
- keep async tests explicit and understandable

## Error Scenarios
Always include meaningful negative-path tests.

Examples:
- invalid credentials
- invalid form submission
- empty filter result
- zero or invalid purchase price
- unauthorized route access

A good test suite should not only validate happy paths.

## Test Data
Use realistic but minimal test data.

Recommendations:
- create small factories/helpers for repeated structures when useful
- keep fixtures readable
- avoid giant mock payloads unless necessary

Example deal fixture fields:
- id
- dealName
- purchasePrice
- address
- noi
- capRate

## Reusability
Extract test helpers only when they improve readability and reduce duplication.

Examples:
- component setup helper
- form creation helper
- deal fixture factory
- auth state helper

Do not over-abstract test code.
If the helper hides too much intent, prefer inline setup.

## Maintainability Rules
Tests should be easy to update after intentional refactors.

To improve maintainability:
- avoid asserting too many details in one test
- avoid snapshot overuse
- keep setup close to the test
- prefer explicit assertions over broad snapshots
- only test behavior that matters

## Snapshot Testing
Snapshot testing should be used sparingly.

Do not rely on snapshots for:
- large Angular component trees
- dynamic markup
- behavior-heavy components

Prefer direct assertions on meaningful outputs.

## Coverage Mindset
Coverage is useful, but high percentage alone is not the goal.

Prioritize:
- critical paths
- business logic
- auth behavior
- state transitions
- validation rules
- filters and derived calculations

A smaller set of high-value tests is better than many shallow tests.

## Angular-Specific Guidelines
- configure TestBed only with what is necessary
- keep test module setup minimal
- import standalone components directly when possible
- avoid unnecessary declarations/providers
- prefer testing standalone components in their modern Angular style
- do not recreate large app-wide environments unless the test truly needs it

## Jest Best Practices
- use `jest.fn()` and `jest.spyOn()` intentionally
- reset mocks when needed
- avoid leaking mocked state across tests
- keep mock expectations focused on meaningful collaborator interactions
- do not assert every internal call unless that interaction is the actual behavior being tested

## Suggested Test Targets for This Project
Recommended priorities for this application:

### Auth
- auth service login success
- auth service login failure
- auth guard route protection
- login component form validation
- login component error feedback

### Deals
- deals service initial list
- add deal behavior
- cap rate calculation
- filtering by deal name
- filtering by purchase price greater than
- filtering by purchase price less than
- combined filters
- filter reset behavior

### UI
- deals page empty state
- derived cap rate rendering
- highlight behavior if implemented
- add form validation
- successful deal creation flow

## What To Avoid
- brittle tests tied to internal implementation
- excessive mocking
- asserting Angular internals
- huge test setup for simple cases
- unclear test names
- overuse of snapshots
- duplicated test data with poor readability
- testing private methods directly
- writing tests that are harder to understand than the production code

## Final Principle
A good test should answer:
- what behavior is expected?
- under which conditions?
- what outcome proves it?

If a test does not make that clear, it should be simplified.