# Business Rules

## Authentication

### Valid User
The application supports a single mock user only:

- username: admin
- password: 123456

### Login Behavior
- username is required
- password is required
- credentials must match exactly
- valid login grants access to private pages
- invalid login shows an error message or feedback
- unauthenticated users cannot access private routes

### Session Behavior
- session persistence after refresh is not required
- authentication state may exist only in memory
- losing state after refresh is acceptable for this project

## Navigation Rules
- login page is public
- deals page is private
- unauthenticated users attempting to access private pages must be redirected to login
- authenticated users may be redirected away from login if already signed in

## Deal Rules

### Deal Fields
A deal must contain:
- dealName
- purchasePrice
- address
- noi
- capRate

The application may also include:
- id

### Required Fields
The user must provide:
- dealName
- purchasePrice
- address
- noi

The application calculates:
- capRate

### Cap Rate
capRate is derived from:
- capRate = noi / purchasePrice

Rules:
- capRate should be calculated automatically
- capRate should update whenever purchasePrice or noi changes
- capRate should not require manual user input
- if purchasePrice is invalid or empty, capRate should not produce misleading output

### Monetary Rules
- purchasePrice must be greater than 0
- noi must be greater than or equal to 0

### Deal Name
- dealName is required
- dealName should support partial-match filtering
- case-insensitive filtering is preferred

### Address
- address is required
- no advanced formatting or normalization is required

## Listing Rules
- user sees a list/table of pre-filled deals after authentication
- pre-filled deals may come from in-memory service or mock source
- list does not need to persist after refresh

## Add Deal Rules
- authenticated user can add one or more deals
- added deals must appear in the listing immediately
- added deals do not need to survive browser refresh

## Filtering Rules
Filtering is handled entirely on the frontend.

### Deal Name Filter
- should support partial text matching
- case-insensitive match is preferred

### Purchase Price Filters
The user should be able to filter by:
- purchase price greater than
- purchase price less than

Rules:
- filters may be used independently
- filters may be combined
- clearing filters should restore the full list

## Highlighting Rule
Optional enhancement:
- the UI may highlight the matching deal name fragment in the table when a name filter is applied

## Display Rules
Recommended formatting:
- purchasePrice displayed as currency
- noi displayed as currency
- capRate displayed as percentage

Optional visual rule:
- cap rate values in a realistic range such as 5% to 12% may be visually indicated in a subtle way

## Error and Validation Rules

### Login Errors
Show user-friendly feedback when:
- username is missing
- password is missing
- credentials are invalid

### Deal Form Errors
Show validation feedback when:
- dealName is missing
- address is missing
- purchasePrice is missing or invalid
- purchasePrice is less than or equal to zero
- noi is missing or invalid
- noi is negative

## Persistence Rules
- all data may be stored in memory only
- refresh may reset application state
- this behavior is acceptable and expected