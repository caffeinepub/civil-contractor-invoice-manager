# Civil Contractor Invoice Manager

## Current State
- Single hardcoded user login (username: Mikeee, password: kuchbhi@123)
- All data stored in backend shared globally (no user isolation)
- localStorage key `cim_auth` = "true" on login
- Document types stored in localStorage under `cim_document_types`
- Company settings stored in localStorage under `cim_company_*`
- Dashboard hardcodes "Welcome, Mikeee"
- Backend uses anonymous Principal for all callers (no Internet Identity)

## Requested Changes (Diff)

### Add
- Multi-user account system with hardcoded user list:
  - Mikeee / kuchbhi@123 (role: admin)
  - At least one more regular user account (e.g. User2 / user2@123, role: user)
- Store logged-in username in localStorage as `cim_user`
- Store logged-in user role in localStorage as `cim_role`
- Per-user data namespacing: all localStorage keys that store per-user data (cim_document_types, cim_company_*) must be prefixed with the username, e.g. `cim_document_types_Mikeee`
- Admin user (Mikeee) sees all clients and invoices from the backend (getAllClients, getAllInvoices)
- Regular users see only data they created -- tracked by storing a per-user owned-IDs list in localStorage: `cim_owned_clients_<username>` and `cim_owned_invoices_<username>` (arrays of ID strings)
- When a regular user creates a client or invoice, add the returned ID to their owned list
- When fetching clients/invoices for a regular user, filter the full list to only IDs in their owned list
- Dashboard "Welcome, <username>" shows the logged-in username dynamically
- User badge/label in AppLayout header showing logged-in username and role
- Logout clears `cim_auth`, `cim_user`, `cim_role` from localStorage

### Modify
- LoginPage: support the multi-user account list; on successful login store cim_user and cim_role; show username in the form/header
- DashboardPage: replace hardcoded "Welcome, Mikeee" with dynamic username from localStorage
- AppLayout: show current username + role badge in header; add logout option
- useCreateClient mutation: on success, if user is not admin, add new client ID to `cim_owned_clients_<username>`
- useGetAllClients query: if user is admin return all; else filter by owned IDs
- useCreateInvoice mutation: on success, if user is not admin, add new invoice ID to `cim_owned_invoices_<username>`
- useGetAllInvoices query: if user is admin return all; else filter by owned IDs
- documentType utils: namespace localStorage key by username
- companyProfile utils: namespace localStorage keys by username

### Remove
- Nothing removed

## Implementation Plan
1. Create a `src/utils/auth.ts` helper: USERS list, login(), logout(), getCurrentUser(), getCurrentRole(), isAdmin(), getOwnedClientIds(), addOwnedClientId(), getOwnedInvoiceIds(), addOwnedInvoiceId()
2. Update LoginPage to use the USERS list and store cim_user + cim_role
3. Update DashboardPage to read username from localStorage dynamically
4. Update AppLayout to show username/role badge and logout button
5. Update useGetAllClients and useCreateClient to apply per-user filtering/tracking
6. Update useGetAllInvoices and useCreateInvoice to apply per-user filtering/tracking
7. Update documentType.ts to namespace by username
8. Update companyProfile.ts to namespace by username
