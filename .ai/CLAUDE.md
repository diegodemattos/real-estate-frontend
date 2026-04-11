# Project Context

## Project Overview
This project is a simple Angular 17 frontend application for managing real estate deals.

The application must simulate a realistic user experience while keeping the implementation intentionally simple.
Its should use clean frontend architecture, Angular best practices, component structure, state handling, form handling, route protection, filtering, and maintainability.

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
- use a clean feature-based folder structure
- separate UI, state, and business behavior appropriately
- use reactive forms
- keep route protection explicit
- implement filtering in the frontend
- avoid unnecessary complexity
- be easy to maintain and extend

## Preferred Stack
- Angular 17
- TypeScript
- Angular Router
- Reactive Forms
- RxJS
- standalone components preferred
- built-in Angular features over unnecessary third-party libraries

## Architectural Direction
Use a modular, feature-oriented frontend structure with clear separation of concerns.

Recommended features/modules:
- auth
- deals
- shared
- core

Recommended responsibilities:
- pages for route-level screens
- components for reusable UI parts
- services for state/data/auth
- pipes for display or highlighting behavior
- guards for route access

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
- use these base tokens: 
:root {
  --color-primary: #0B1F3A;
  --color-primary-hover: #12305A;
  --color-secondary: #5B3FD6;
  --color-secondary-hover: #4A32B2;
  --color-bg: #F7F9FC;
  --color-surface: #FFFFFF;
  --color-text: #0F172A;
  --color-text-secondary: #475569;
  --color-border: #E2E8F0;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
}

## How to Respond
When assisting in this project, always:

- explain decisions before or alongside implementation
- follow Angular best practices
- prefer simple and explicit solutions
- preserve separation of concerns
- keep the implementation clean and consistent
- use Angular-native patterns where possible
- avoid overengineering
- suggest improvements only if they fit the challenge scope

## What Not To Do
- do not introduce unnecessary state libraries unless clearly justified
- do not overengineer architecture for a small application
- do not mix too much business logic into components
- do not skip form validation
- do not skip route protection
- do not use `any` unless absolutely unavoidable
- do not add unnecessary external UI libraries unless specifically requested

## Implementation Philosophy
This frontend should feel like a small but well-structured real application:
simple scope, polished behavior, and production-minded organization.