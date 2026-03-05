# Civil Contractor Invoice Manager

## Current State
- 4-step invoice creator: Select Client → Add Rooms → Add Items → Review & Save
- Add Item dialog has manual fields: description (text input), quantity, unit (dropdown), rate (text input)
- Room step lets user tap predefined room buttons one at a time to add rooms; custom room input also available
- InvoiceDetailPage shows invoice with rooms/items in screen view and a print-only layout
- Print header is a generic "CIVIL CONTRACTOR INVOICE" title with no company branding
- No company profile/settings page

## Requested Changes (Diff)

### Add
- **Predefined Description-Unit-Rate table** in the Add Item dialog: a searchable/scrollable table of preset items (description + unit + default rate) that the user can tap to auto-fill the fields. Items come from the civil work domain. User can still manually edit the fields after selecting from the table.
- **Company Profile Settings page** (new route `/settings`): lets user set company name, company address, and upload a company logo image (stored in localStorage). Accessible from the app layout (settings icon in nav or header).
- **Company header on invoices**: both the screen invoice detail view and the print-only view show the company logo, company name, and company address at the top if they are set in settings.
- **Multi-room add**: on the Room step, clicking a predefined room button adds ONE instance of that room (existing behaviour) but ALSO shows a count badge. A "Add another [room]" affordance lets users add multiple instances of the same room easily. The user can keep clicking the same button multiple times to add multiple rooms of the same type.

### Modify
- **ItemFormDialog**: add a "Select from list" tab (or expandable section) above the manual fields showing a table with Description, Unit, Rate columns. Tapping a row pre-fills the description, unit, and rate fields. Manual editing still works after selection.
- **Room step (Step 2)**: predefined room buttons should already work for multi-add (each click adds one room). Improve UI to show the count badge more clearly and make it obvious that multiple rooms of the same type can be added by clicking again.
- **InvoiceDetailPage print section**: add company logo (img tag), company name (bold heading), and company address below the header title. Only shown if set in localStorage.
- **AppLayout / navigation**: add a Settings link (gear icon) in the bottom nav or header area.

### Remove
- Nothing removed.

## Implementation Plan

1. **Company profile utilities**: Create `src/frontend/src/utils/companyProfile.ts` with helpers to get/set company name, address, and logo (base64) in localStorage.

2. **Settings page** (`src/frontend/src/pages/SettingsPage.tsx`):
   - Fields: company name (text input), company address (textarea), logo upload (file input → base64).
   - Save to localStorage on submit.
   - Show logo preview if set.
   - Route: `/settings`.

3. **Predefined items data**: Create `src/frontend/src/data/presetItems.ts` exporting an array of `{ description: string, unit: string, rate: number }` covering common civil work items (tiling, plastering, painting, plumbing, electrical, false ceiling, carpentry, etc.).

4. **ItemFormDialog enhancement** (in `NewInvoicePage.tsx`):
   - Add tabs: "Select Preset" tab shows a scrollable table of preset items with Description / Unit / Rate columns. Tapping a row fills the form fields.
   - "Manual Entry" tab (or the fields remain visible below) — user can always edit fields.
   - Filter/search input above the preset table.

5. **Room step multi-add** (in `NewInvoicePage.tsx`):
   - Existing click behaviour already adds rooms. Improve badge visibility to show count of already-added rooms of that type.
   - No logic change needed, just visual clarity.

6. **InvoiceDetailPage** — company header:
   - In the screen view, render a company card at the top if company name or logo is set.
   - In the print-only section, render company logo + name + address before the invoice number block.

7. **AppLayout / routing**:
   - Add Settings route in `App.tsx`.
   - Add gear/settings icon link in the bottom navigation bar in `AppLayout.tsx`.
