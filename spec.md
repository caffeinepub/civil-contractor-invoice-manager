# Civil Contractor Invoice Manager

## Current State
The app uses a local password login (localStorage flag) rather than Internet Identity. The backend actor is created as an anonymous actor. All backend CRUD operations (`createClient`, `updateClient`, `deleteClient`, etc.) are `public shared` with no role checks, so they should accept anonymous callers.

The `useActor` hook creates an anonymous actor immediately (since there is no II identity), but the actor query may fail silently or not be ready when mutation functions run. The `useCreateClient` mutation throws "Actor not ready" if `actor` is null, causing the "Failed to add client" error toast.

Additionally, the `useActor` hook calls `_initializeAccessControlWithSecret` for authenticated (II) users but this app never uses II -- it uses a local password. So the access control initialization never runs and the backend's authorization module may reject calls if it traps on unknown principals.

Looking at `access-control.mo`: `getUserRole` calls `Runtime.trap("User is not registered")` for principals not in the userRoles map (non-anonymous, non-registered). But for anonymous callers, it returns `#guest`. Since all `public shared` functions don't call `getUserRole`, anonymous calls should work.

The actual issue: `createActorWithConfig()` may be throwing or the actor may be null/undefined at mutation time due to async initialization timing. The mutation has no retry and immediately surfaces the error to the user.

## Requested Changes (Diff)

### Add
- Actor readiness state exposed from `useActor` hook
- Loading indicator on submit button when actor is not yet ready
- Retry logic in mutations when actor is not ready (wait and retry once)

### Modify
- `useActor.ts`: Export `isReady` boolean that is true only when actor query has successfully resolved
- `useQueries.ts` (`useCreateClient`, `useUpdateClient`, `useDeleteClient`): Add actor null-guard with a clear error that retries or waits
- `NewClientPage.tsx`: Disable submit button with loading state if actor is not ready
- `useActor.ts`: Fix potential issue where actor query could get stuck — add `retry: 3` to the query config

### Remove
- Nothing removed

## Implementation Plan
1. Update `useActor.ts` to add `isReady` export and add `retry: 3` to actor query
2. Update `NewClientPage.tsx` to disable form submit when actor is not ready
3. Update `EditClientPage.tsx` similarly
4. Ensure all client mutations properly handle actor-not-ready state
