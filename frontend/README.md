# Centralized Hospital Financial System — Frontend

A role-based React single-page application for hospital financial operations in Ethiopia. The frontend provides dedicated portals for **Managers**, **Reception staff**, **Pharmacy reception**, and **System administrators** to record payments, track sales, analyze revenue, and configure the system.

> **Note:** This frontend currently runs on **in-memory mock data** with no backend API. All transactions, bills, sales, and admin settings persist only for the browser session.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Application Architecture](#application-architecture)
5. [Roles & Portals](#roles--portals)
6. [Feature Reference by Role](#feature-reference-by-role)
7. [Core Workflows](#core-workflows)
8. [State Management](#state-management)
9. [Data Layer](#data-layer)
10. [Payment Methods](#payment-methods)
11. [Components](#components)
12. [Hooks & Utilities](#hooks--utilities)
13. [Styling & Design System](#styling--design-system)
14. [Scripts & Build](#scripts--build)
15. [Configuration](#configuration)
16. [Extending the Application](#extending-the-application)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Charts | Recharts 3 |
| Language | JavaScript (JSX) |
| Linting | ESLint 10 |

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

### Install & Run

```bash
cd frontend
npm install
npm run dev
```

The dev server starts at **http://localhost:5173** with hot module replacement (HMR).

### Production Build

```bash
npm run build    # Output → dist/
npm run preview  # Serve production build locally
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
frontend/
├── public/                  # Static assets (favicon, icons.svg)
├── src/
│   ├── assets/              # Images (e.g. central_logo.png)
│   ├── components/          # UI components by domain
│   │   ├── admin/           # System admin screens
│   │   ├── landing/         # Public landing page & login modal
│   │   ├── manager/         # Manager dashboard, analytics, reports
│   │   │   └── analytics/   # Chart sub-components
│   │   ├── pharmacy/        # Pharmacy sale flow & records
│   │   └── reception/       # Reception payment flow & records
│   ├── config/
│   │   └── roles.js         # Role definitions, nav items, page titles
│   ├── context/             # React context providers
│   ├── data/                # Mock data stores & pure business logic
│   ├── hooks/               # Custom React hooks
│   ├── portals/             # Top-level portal shells per role
│   ├── utils/               # Report generation helpers
│   ├── App.jsx              # Root router (landing ↔ portals)
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles & design tokens
├── eslint.config.js
├── vite.config.js
└── package.json
```

---

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App.jsx                              │
│  activeRole === null  →  LandingPage (role selection)       │
│  activeRole set       →  *Portal component                  │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
  ManagerPortal        ReceptionPortal      PharmacyReceptionPortal
        │                     │                     │
        ▼                     ▼                     ▼
  PortalLayout           PortalLayout           PortalLayout
  (sidebar + header)     + Context providers    + Context providers
        │                     │                     │
        ▼                     ▼                     ▼
  Page components        Page components        Page components
```

### Entry Flow

1. User lands on the **public marketing page** (`LandingPage`).
2. User opens **Login Modal** and selects a role (Manager, Reception, Pharmacy Reception, System Admin).
3. `App.jsx` sets `activeRole` and mounts the corresponding portal.
4. User can **switch role** from the sidebar, returning to the landing page.

There is no authentication backend — role selection is simulated for demo purposes.

---

## Roles & Portals

Role configuration lives in `src/config/roles.js`.

| Role ID | Portal | User (demo) | Primary Functions |
|---------|--------|-------------|-------------------|
| `manager` | Manager Portal | Manager | Financial dashboard, analytics, reports, transaction history, patient payment details |
| `reception` | Reception Portal | Tigist | Record patient payments, view today's payments, patient history |
| `pharmacy` | Pharmacy Reception Portal | Hanna | Create medicine sales, view sales records |
| `admin` | System Admin Portal | System Admin | Payment settings, user management, logs, backups, notifications, system settings |

Each role defines:

- `navItems` — sidebar navigation entries
- `pageTitles` — header subtitles per page
- `headerMode` — `"welcome"` (reception/pharmacy) or greeting-based (manager/admin)
- Visual identity: `userName`, `userInitial`, `badge`, `portalTitle`, `portalSubtitle`

---

## Feature Reference by Role

### Manager Portal (`portals/ManagerPortal.jsx`)

| Page ID | Component | Description |
|---------|-----------|-------------|
| `dashboard` | `Dashboard` | KPI stat cards, revenue chart, quick alerts, reception collections chart, recent transactions |
| `analytics` | `ManagerReports` | Revenue trend, payment method donut, month comparison, top services |
| `reports` | `ReportsPage` | Filterable report builder with preview and export simulation |
| `transactions` | `TransactionHistory` | Full transaction table with status filters (navigable from dashboard alerts) |
| `patients` | `PatientPaymentDetails` | Searchable patient profiles with payment timelines |

**Dashboard alerts:** `QUICK_ALERTS` from mock data can be dismissed; dismissed alerts remove the dashboard notification badge.

---

### Reception Portal (`portals/ReceptionPortal.jsx`)

Wrapped in `ReceptionBillsProvider` and `ReceptionToastProvider`.

| Page ID | Component | Description |
|---------|-----------|-------------|
| `home` | `ReceptionHome` | Today's desk summary — unpaid bill count, payments recorded today, quick actions |
| `payment` | `ReceptionPayment` | Multi-step payment recording flow |
| `today` | `TodaysPaymentsScreen` | Table of payments recorded today with detail modal |
| `history` | `PatientHistory` | Search patient payment history across all transactions |

---

### Pharmacy Reception Portal (`portals/PharmacyReceptionPortal.jsx`)

Wrapped in `PharmacySalesProvider` and `ReceptionToastProvider`.

| Page ID | Component | Description |
|---------|-----------|-------------|
| `home` | `PharmacyHome` | Today's desk — sales count, total collected, recent sales |
| `sale` | `PharmacySale` | Multi-step medicine sale recording flow |
| `sales` | `TodaysSalesScreen` | Table of today's sales with detail modal |

---

### System Admin Portal (`portals/AdminPortal.jsx`)

| Page ID | Component | Description |
|---------|-----------|-------------|
| `overview` | `AdminOverview` | System health cards, activity feed, service status |
| `settings` | `PaymentSettings` | Enable/disable payment channels, verification flags |
| `users` | `UserManagement` | CRUD for staff users (in-memory) |
| `logs` | `SystemLogs` | Filterable audit log with export modal |
| `reports` | `ReportsBackup` | Scheduled report types and backup frequency |
| `notifications` | `NotificationsAlerts` | Alert rules and notification history |
| `system` | `GeneralSystemSettings` | Date format, language, session timeout, system info |

---

## Core Workflows

### Reception Payment Flow

Orchestrated by `ReceptionPayment.jsx` with three steps:

```
payment → confirm → success
```

| Step | Screen | Actions |
|------|--------|---------|
| `payment` | `PaymentMainScreen` | Search/select unpaid bill, choose payment method, enter amount, click **Confirm Payment** |
| `confirm` | `PaymentConfirmScreen` | Review patient, bill, method, amount; **Confirm & Record** or **Go Back** |
| `success` | `PaymentSuccessScreen` | Show transaction ID; **New Payment** or **View Today's Payments** |

**Validation (payment step):** Bill selected, payment method chosen, amount > 0.

**On complete:** `recordPayment()` updates bill status to `Paid` and appends an audit log entry via `receptionBillStore.recordBillPayment()`.

**Void / restore:** From today's payments, paid bills can be voided (`voidBillPayment`) or restored to unpaid (`restoreBillToUnpaid`). All actions are audit-logged.

---

### Pharmacy Sale Flow

Orchestrated by `PharmacySale.jsx` with three steps:

```
sale → confirm → success
```

| Step | Screen | Actions |
|------|--------|---------|
| `sale` | `SaleMainScreen` | Enter medicine name, quantity, payment method, amount; click **Confirm Payment** |
| `confirm` | `SaleConfirmScreen` | Review sale details; **Confirm & Record** or **Go Back** |
| `success` | `SaleSuccessScreen` | Show sale ID; **New Sale** or **View Sales** |

**Validation (sale step):** All four fields required — medicine name, positive quantity, valid payment method ID, positive amount. An amber hint lists missing fields when incomplete.

**On complete:** `saveSale()` appends the sale via `pharmacySaleStore.recordSale()`.

**Sale ID format:** `PHM-YYYYMMDD-HHMM` (e.g. `PHM-20260607-1430`).

---

## State Management

### `ReceptionBillsContext`

**Provider:** `ReceptionBillsProvider` (Reception portal only)

**Hook:** `useReceptionBills()`

| Property / Method | Type | Description |
|-------------------|------|-------------|
| `bills` | `Bill[]` | All bills with current status |
| `auditLog` | `AuditEntry[]` | Payment, void, and restore events |
| `unpaidBills` | `Bill[]` | Bills with status `Unpaid` |
| `settledBills` | `Bill[]` | Bills with status `Paid` or `Void` |
| `todaysPayments` | `PaymentRecord[]` | Today's payment audit entries |
| `recordPayment(payment)` | function | Records payment; returns `paymentRecord` |
| `voidPayment(billId)` | function | Voids a paid bill |
| `restoreToUnpaid(billId)` | function | Restores a voided bill to unpaid |
| `filterByQuery(bills, query)` | function | Filters bills by patient name or bill ID |

---

### `PharmacySalesContext`

**Provider:** `PharmacySalesProvider` (Pharmacy portal only)

**Hook:** `usePharmacySales()`

| Property / Method | Type | Description |
|-------------------|------|-------------|
| `sales` | `Sale[]` | All recorded sales (newest first) |
| `todaysSales` | `Sale[]` | Sales recorded today |
| `saveSale(saleInput)` | function | Records sale; returns `saleRecord` |
| `filterByQuery(sales, query)` | function | Filters by medicine name, sale ID, or payment type |

---

### `ReceptionToastContext`

**Provider:** `ReceptionToastProvider` (Reception + Pharmacy portals)

**Hook:** `useReceptionToast()`

| Method | Description |
|--------|-------------|
| `showToast(message, variant?)` | Shows a toast (`variant`: `"success"` default). Auto-dismisses after 4 seconds. |

---

## Data Layer

All data modules live in `src/data/`. Pure functions handle business logic; React contexts hold session state.

### `receptionBillStore.js`

Bill lifecycle and payment audit trail for reception.

| Export | Description |
|--------|-------------|
| `BILL_STATUS` | `UNPAID`, `PAID`, `VOID` |
| `PAYMENT_DISPLAY_STATUS` | `PAID`, `PENDING` |
| `RECEPTIONIST_NAME` | Demo receptionist name (`"Tigist"`) |
| `createInitialBills()` | Seeds 12 unpaid bills |
| `recordBillPayment(bills, auditLog, payment)` | Marks bill paid, creates audit entry |
| `voidBillPayment(bills, auditLog, billId)` | Voids payment, keeps audit history |
| `restoreBillToUnpaid(bills, auditLog, billId)` | Restores voided bill to unpaid |
| `getTodaysPayments(auditLog, recordedBy?)` | Filters today's payment records |
| `filterBillsByQuery(bills, query)` | Search by patient name or bill ID |
| `generateTransactionId(date)` | Format: `TXN-YYYYMMDD-HHMM` |
| `formatTimestamp(date)` | Human-readable datetime string |

---

### `pharmacySaleStore.js`

Pharmacy sale records.

| Export | Description |
|--------|-------------|
| `PHARMACY_RECEPTIONIST_NAME` | Demo pharmacist name (`"Hanna"`) |
| `createInitialSales()` | Seeds 3 sample sales from earlier today |
| `recordSale(sales, saleInput)` | Appends new sale; returns `{ sales, saleRecord }` |
| `getTodaysSales(sales)` | Filters sales recorded today |
| `filterSalesByQuery(sales, query)` | Search by medicine, sale ID, or payment type |
| `generateSaleId(date)` | Format: `PHM-YYYYMMDD-HHMM` |
| `formatSaleTimestamp(date)` | Human-readable datetime string |
| `formatEtb(amount)` | Re-exported from `receptionBills.js` |

---

### `paymentMethods.js`

Canonical list of Ethiopian hospital payment channels.

| Export | Description |
|--------|-------------|
| `PAYMENT_CATEGORIES` | `cash`, `mobile`, `bank` |
| `PAYMENT_METHODS` | Full method list with `id`, `label`, `category`, optional `bank`/`product` |
| `PAYMENT_METHOD_BY_ID` | Lookup map by method ID |
| `PAYMENT_METHOD_BY_LABEL` | Lookup map by display label |
| `getMethodsByCategory(categoryId)` | Filter methods (e.g. all bank wallets) |
| `getMethodLabel(idOrLabel)` | Resolve display label |
| `pickRandomPaymentMethod()` | Weighted random pick for demo data |
| `METHOD_CHART_COLORS` / `colorForMethodIndex(i)` | Chart color palette |

**Primary methods (quick-select UI):** Cash, Telebirr, eBirr  
**Other banks (expandable panel):** CBE Birr, Amole, Apollo, Coopay-Ebirr, Awash Wallet, Wegagen Ebirr, NIB Mobile, Zemen Mobile, Lion Mobile, Enat Pay, Bunna Mobile

---

### `managerMockData.js`

Manager dashboard and transaction history demo data.

| Export | Description |
|--------|-------------|
| `STAT_VALUES` | Dashboard KPI numbers (revenue, patients, verified/pending amounts) |
| `CHART_DATA` | Revenue by method — `daily`, `weekly`, `monthly` |
| `RECEPTION_COLLECTIONS` | Per-receptionist collection totals by period |
| `TRANSACTION_HISTORY` | ~100 generated transactions |
| `QUICK_ALERTS` | Dashboard alert cards with navigation targets |
| `createTransaction(overrides)` | Factory for a single transaction row |
| `refreshTransactions(current)` | Simulates live transaction refresh |

---

### `analyticsMockData.js`

Manager analytics page data.

| Export | Description |
|--------|-------------|
| `TREND_30_DAYS` | 30-day revenue trend series |
| `PAYMENT_METHOD_SPLIT` | Donut chart segments |
| `MONTH_COMPARISON` | Current vs previous month |
| `TOP_SERVICES` | Highest-revenue services |
| `formatEtb(amount)` | Currency formatter |
| `paymentSplitTotal()` | Sum of payment split amounts |

---

### `patientProfiles.js`

Derived patient profiles from transaction history.

| Export | Description |
|--------|-------------|
| `PATIENT_PROFILES` | Built from `TRANSACTION_HISTORY` |
| `buildPatientProfiles(transactions)` | Aggregates payments per patient |
| `searchPatients(query, profiles?)` | Name search |
| `getPatientById(patientId, profiles?)` | Single patient lookup |

---

### Admin data modules

| File | Purpose |
|------|---------|
| `adminMockData.js` | Health stats, activity events, service status list |
| `adminUsers.js` | User CRUD seed data, role/status filters, role colors |
| `adminPaymentSettings.js` | Payment channel toggles, verification flag thresholds |
| `adminGeneralSettings.js` | Date format, language, session timeout options, system info |
| `adminSystemLogs.js` | Log entries, type filters, status styles |
| `adminNotifications.js` | Alert rules, notification history, settings factory |
| `adminReportsBackup.js` | Report type definitions, backup frequency options |

---

### `receptionBills.js`

Legacy static bill list and helpers (superseded by `receptionBillStore` for live state, still used for `formatEtb`).

| Export | Description |
|--------|-------------|
| `RECEPTION_BILLS` | Static unpaid bill array |
| `searchReceptionBills(query)` | Search static bills |
| `listUnpaidBills(query)` | List/filter unpaid bills |
| `formatEtb(amount)` | `ETB 1,234` formatting |

---

### `patientData.js`

Large historical transaction dataset used by some legacy analytics paths.

| Export | Description |
|--------|-------------|
| `transactions` | Full transaction array |
| `getByDate(date)` | Transactions on a date |
| `getByPatient(name)` | Transactions for a patient |
| `getDailyRevenue(date)` | Total revenue for a day |
| `getRevenueByMethod(date)` | Revenue grouped by payment method |
| `getMonthlyRevenue(year, month)` | Monthly total |
| `getStatusCounts(date)` | Status breakdown for a day |
| `getRecentTransactions(n)` | Latest N transactions |
| `getLast30DaysRevenue()` | 30-day revenue series |

---

## Payment Methods

Payment method selection is shared between Reception and Pharmacy via `paymentMethods.js`.

**UI pattern (both portals):**

1. Three primary buttons: **Cash**, **Telebirr**, **eBirr**
2. **Other banks** toggle expands a scrollable grid of bank mobile wallets
3. A bank is only considered selected after clicking a specific bank tile — opening the panel alone does not count

Amount is entered in ETB. The medicine/pharmacy **Total** field in the left card reflects the entered amount as a formatted read-only display.

---

## Components

### Shared Layout

| Component | File | Description |
|-----------|------|-------------|
| `PortalLayout` | `PortalLayout.jsx` | Sidebar + sticky header + main content area |
| `PortalSidebar` | `PortalSidebar.jsx` | Icon rail navigation, role badge, switch-role button |
| `PageTransition` | `PageTransition.jsx` | Fade transition between portal pages |
| `LiveClock` | `LiveClock.jsx` | Live time display for reception/pharmacy headers |

### Landing

| Component | Description |
|-----------|-------------|
| `LandingPage` | Public marketing page with features, trust items, CTA |
| `LandingBackground` | Animated gradient background |
| `LoginModal` | Role selection modal (no real credentials) |

### Manager

| Component | Description |
|-----------|-------------|
| `Dashboard` | Composes stat cards, charts, alerts, transactions |
| `StatCards` | Animated KPI cards with navigation |
| `RevenueChart` | Period-switchable bar chart |
| `ReceptionCollectionsChart` | Per-receptionist collections |
| `QuickAlerts` | Dismissible alert cards |
| `ManagerTransactionsTable` | Sortable/filterable transaction table |
| `TransactionHistory` | Full history with status filter |
| `TransactionDrawer` | Side drawer for transaction detail |
| `ManagerReports` | Analytics dashboard |
| `ReportsPage` | Report builder UI |
| `ReportPreview` | Rendered report output |
| `PatientPaymentDetails` | Patient search + payment timeline |
| `PatientSummaryCard` | Patient overview card |
| `PaymentTimeline` | Chronological payment events |
| `StatusBadge` | Transaction status chip |

### Reception

| Component | Description |
|-----------|-------------|
| `ReceptionHome` | Today's desk dashboard |
| `ReceptionPayment` | Payment flow orchestrator |
| `PaymentMainScreen` | Bill search, method picker, amount entry |
| `PaymentConfirmScreen` | Review before recording |
| `PaymentSuccessScreen` | Confirmation with transaction ID |
| `TodaysPaymentsScreen` | Today's payments table |
| `PaymentDetailModal` | Payment record detail |
| `PatientHistory` | Cross-patient payment search |
| `SettledBillsPanel` | Settled bills sidebar panel |
| `BillStatusBadge` | Bill status chip |
| `PaymentStatusBadge` | Payment verification status chip |
| `ReceptionToast` | Toast notification UI |

### Pharmacy

| Component | Description |
|-----------|-------------|
| `PharmacyHome` | Today's desk dashboard |
| `PharmacySale` | Sale flow orchestrator |
| `SaleMainScreen` | Medicine, quantity, method, amount form |
| `SaleConfirmScreen` | Review before recording |
| `SaleSuccessScreen` | Confirmation with sale ID |
| `TodaysSalesScreen` | Today's sales table |
| `SaleDetailModal` | Sale record detail |
| `paymentTypeIcon.jsx` | Payment method icon resolver |

### Admin

| Component | Description |
|-----------|-------------|
| `AdminOverview` | Dashboard with health cards and activity |
| `AdminHealthCards` | System metric cards |
| `AdminActivityFeed` | Recent system events |
| `AdminSystemStatus` | Service status indicators |
| `PaymentSettings` | Channel configuration |
| `UserManagement` | User list with add/edit/deactivate |
| `UserFormModal` | User create/edit form |
| `SystemLogs` | Filterable log table |
| `ExportLogsModal` | Log export simulation |
| `ReportsBackup` | Report schedule settings |
| `ReportDateRangeModal` | Date range picker for reports |
| `NotificationsAlerts` | Alert rules management |
| `GeneralSystemSettings` | Global system preferences |
| `ConfirmActionModal` | Destructive action confirmation |
| `StatusToggle` | On/off toggle control |
| `AdminToast` | Admin-specific toast |

### Icons

`icons.jsx` exports SVG icon components used across the app.  
`sidebarNavIcons.js` maps navigation item IDs to icons via `getNavIcon(id)`.

---

## Hooks & Utilities

### Hooks (`src/hooks/`)

| Hook | File | Description |
|------|------|-------------|
| `useCountUp(target, active?, duration?)` | `useCountUp.js` | Animates a number from 0 to `target` with easing (used in stat cards) |
| `useInView(options?)` | `useInView.js` | Intersection Observer hook; returns `[ref, inView]`. Options: `once`, `threshold`, `rootMargin` |

### Utilities (`src/utils/`)

| Function | File | Description |
|----------|------|-------------|
| `buildReport(filters)` | `generateReport.js` | Builds filtered report object from transaction history |
| `buildTodayReport()` | | Report for current date |
| `buildMonthReport()` | | Report from month start to today |
| `delay(ms)` | | Promise-based timeout |
| `randomLoadingMs()` | | Random 1000–2000 ms delay for loading simulations |

**Report object shape:**

```js
{
  periodLabel, dateFrom, dateTo,
  totalRevenue, totalRevenueLabel,
  transactionCount,
  byMethod: [{ name, amount, label }],
  byService: [{ name, amount, label }],
  flagged: [{ id, patient, service, amount, status, date }],
  generatedAt
}
```

---

## Styling & Design System

Global styles are in `src/index.css`. Tailwind CSS 4 is loaded via the Vite plugin.

### Color Palette

| Token | Usage |
|-------|-------|
| `#050D1A` / `#0A1628` | Page backgrounds |
| `#22D3EE` (cyan) | Primary accent, active states, links |
| `#10B981` (emerald) | Success, verification |
| `#F59E0B` (amber) | Warnings, hints |
| `#94A3B8` | Muted text |
| `#64748B` | Placeholder / disabled text |

### Reusable CSS Classes

| Class | Purpose |
|-------|---------|
| `.glass-card` | Frosted glass panel |
| `.bill-card-glow` | Glowing card for bill/medicine summary |
| `.btn-confirm-active` | Primary cyan gradient confirm button |
| `.btn-landing-cyan` / `-emerald` / `-amber` / `-purple` | Landing page CTA buttons |
| `.badge-failed` / `.badge-void` | Status badge variants |

### Layout

- Fixed sidebar width defined by `SIDEBAR_WIDTH` in `PortalSidebar.jsx`
- Main content offset with `marginLeft: SIDEBAR_WIDTH`
- Responsive breakpoints via Tailwind (`sm:`, `lg:`, `xl:`)

---

## Scripts & Build

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Development server with HMR |
| `build` | `vite build` | Production bundle → `dist/` |
| `preview` | `vite preview` | Preview production build |
| `lint` | `eslint .` | Run ESLint |

---

## Configuration

### Vite (`vite.config.js`)

```js
plugins: [tailwindcss(), react()]
```

No custom proxy, aliases, or environment variables are configured yet.

### ESLint (`eslint.config.js`)

Flat config with React Hooks and React Refresh plugins.

### Roles (`src/config/roles.js`)

Central place to add nav items, rename pages, or introduce new roles. Update `App.jsx` to mount a new portal when adding roles.

---

## Extending the Application

### Connecting a Backend

1. Replace mock data initialization in context providers with API fetch on mount.
2. Swap pure store functions (`recordBillPayment`, `recordSale`, etc.) for API calls.
3. Add environment variables (e.g. `VITE_API_URL`) via Vite's `import.meta.env`.
4. Implement real authentication in `LoginModal` and protect routes.

### Adding a New Role

1. Add role definition to `src/config/roles.js`.
2. Create `src/portals/NewRolePortal.jsx`.
3. Register in `App.jsx` and `LoginModal` role list.
4. Add sidebar icons in `sidebarNavIcons.js`.

### Adding a Payment Method

1. Append entry to `PAYMENT_METHODS` in `paymentMethods.js`.
2. If it should appear in the primary row, add to `PRIMARY_METHODS` in `PaymentMainScreen.jsx` / `SaleMainScreen.jsx`.
3. Otherwise it automatically appears under **Other banks** when `category: "bank"`.

### Persistence

Currently no `localStorage` or backend persistence. Refreshing the browser resets all bills, sales, and admin settings to seed data.

---

## License

Private — Centralized Hospital Financial System.
