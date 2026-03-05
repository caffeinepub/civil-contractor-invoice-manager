# Civil Contractor Invoice Manager

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Hardcoded login screen (username: "Mikeee", password: "kuchbhi@123") with session stored in localStorage
- Auth guard protecting all routes
- Client management: create, read, edit, delete clients (name, mobile, address, billing number)
- Room & area management: predefined room types (Bathroom, Kitchen, Living Room, Master Bedroom, Kids Bedroom, Terrace, Balcony) plus custom room name; multiple rooms of same type per invoice
- Item entry per room: item name, quantity, unit (sq ft, sq mt, feet, meters, units, running ft, running mt), rate (₹), auto-calculated amount; full CRUD
- Invoice creation flow: select client → add rooms → add items per room → review & save
- Auto-generated billing number (format: INV-YYYY-XXXX)
- Invoice list/history with client name, billing number, date, grand total
- Invoice detail view: itemized breakdown by room, room subtotals, grand total
- Print-friendly invoice layout (CSS print media query, shows client info, items by room, totals)
- Dashboard: total clients count, total invoices count, total billing amount (₹)
- Bottom navigation bar: Dashboard, Clients, New Invoice, Invoice History

### Modify
Nothing (new project).

### Remove
Nothing (new project).

## Implementation Plan
1. Backend (Motoko):
   - Client record: id, name, mobile, address, billingNumber
   - Room record: id, invoiceId, name (room type or custom)
   - Item record: id, roomId, description, quantity, unit, rate, amount
   - Invoice record: id, clientId, billingNumber, createdAt, status
   - CRUD operations for clients, invoices, rooms, items
   - Query: getInvoicesByClient, getAllInvoices, getInvoiceDetail (rooms + items)
   - getDashboardStats returning client count, invoice count, total amount

2. Frontend (React + TypeScript):
   - Login page with hardcoded auth, session in localStorage
   - AuthGuard wrapper for all protected routes
   - Dashboard page with 3 stat cards
   - Clients page: list, add/edit modal, delete confirm
   - New Invoice page: multi-step flow (select client → add rooms → add items per room → preview)
   - Invoice History page: list with search/filter
   - Invoice Detail page: room-grouped breakdown + print button
   - Print CSS: hide navigation, show clean invoice layout
   - Bottom tab navigation (mobile-first)
   - Units dropdown: sq ft, sq mt, feet, meters, units, running ft, running mt
