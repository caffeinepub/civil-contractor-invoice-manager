# Civil Contractor Invoice Manager

## Current State
- User accounts are hardcoded in `src/frontend/src/utils/auth.ts` as a static `USERS` array
- Three users exist: Mikeee (admin), User2 (user), User3 (user)
- Roles are enforced via localStorage; admin sees all data, regular users see only their own
- Settings page only handles company profile (logo, name, address)
- No way to add, delete, or edit users from the UI

## Requested Changes (Diff)

### Add
- "User Management" section in Settings page, visible only to admin
- Admin can add new regular users (username + password)
- Admin can edit any regular user's username and password
- Admin can delete any regular user
- Users list persisted in localStorage so changes survive page reloads

### Modify
- `auth.ts`: Change USERS from a hardcoded constant to a localStorage-backed mutable store; seed defaults on first load; expose CRUD helpers (getUsers, addUser, updateUser, deleteUser)
- `SettingsPage.tsx`: Add a "User Management" section below company profile, shown only when `isAdmin()` is true

### Remove
- Nothing removed

## Implementation Plan
1. Extend `auth.ts` with localStorage-persisted user store and CRUD functions (getUsers, addUser, updateUser, deleteUser); keep login() reading from live store
2. Add User Management UI to SettingsPage:
   - List all regular users (not admin) with edit and delete buttons per row
   - Inline edit form: username + password fields, save/cancel
   - "Add User" form at the bottom: username + password, add button
   - Prevent deleting or editing the admin account (Mikeee)
   - Validate: no empty username/password, no duplicate usernames
3. Apply deterministic data-ocid markers to all interactive elements
