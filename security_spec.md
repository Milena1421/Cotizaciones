# Security Specification - CotizaPro CRM

## Data Invariants
1. A Quote must have all required fields including `ownerId`.
2. An Opportunity must be linked to a valid Quote via `quoteId` (verified during creation).
3. Only the `ownerId` of a Quote or Opportunity can read or write to it.
4. `createdAt` and `ownerId` are immutable.
5. `clientEmail` must be a valid email format.

## The "Dirty Dozen" Payloads (Denial Tests)
1. Creating a Quote without `ownerId`.
2. Creating a Quote where `ownerId` does not match the authenticated user.
3. Updating the `ownerId` of an existing Quote.
4. Updating the `createdAt` of an existing Quote.
5. Creating an Opportunity with a non-existent `quoteId`.
6. Reading a Quote as a different authenticated user.
7. Listing all Quotes without a filter on `ownerId`.
8. Injecting a massive string into `clientName`.
9. Updating `status` to an invalid value.
10. Deleting a Quote if you are not the owner.
11. Bypassing `isValidId` for document IDs.
12. Updating `updatedAt` with a client-side timestamp (not server timestamp).

## Test Runner (Logic)
The `firestore.rules.test.ts` will verify these scenarios.
