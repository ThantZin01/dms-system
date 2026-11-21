# Dormitory Management System (DMS)

A modern, full-stack web application and installable Progressive Web App (PWA) designed to streamline day-to-day dormitory operations—including resident management, automated garbage duty rotations, drinking water inventory & restock splits, shared living expenses, and dormitory fee tracking.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Prisma**, **Neon PostgreSQL**, and **Better Auth**, DMS provides a fast, bilingual (**English** & **Myanmar**), dark-mode-ready experience across desktop and mobile devices.

---

## Table of Contents

1. [What Is This System?](#1-what-is-this-system)
2. [How We Built This System](#2-how-we-built-this-system)
3. [Tech Stack & Architecture](#3-tech-stack--architecture)
4. [Project Structure](#4-project-structure)
5. [Errors & Challenges Encountered](#5-errors--challenges-encountered)
6. [Testing & Verification](#6-testing--verification)
7. [Launching the Web App](#7-launching-the-web-app)
8. [Available Scripts](#8-available-scripts)
9. [Contributing & License](#9-contributing--license)

---

## 1. What Is This System?

Managing a shared dormitory manually with spreadsheets or chat groups often leads to forgotten rent deadlines, unfair chore rotations, and messy bill splitting. The **Dormitory Management System (DMS)** centralizes all dormitory administration into a single, transparent ledger with role-based access control.

### Core Modules & Features

| Module | What It Does |
| :--- | :--- |
| **Executive Dashboard** | Real-time KPI summary showing active residents, monthly fee collections, overdue/expiring-soon rent alerts, monthly shared expenses, recent activity feeds, quick actions, and interactive Recharts expense breakdowns. |
| **Resident Registry (`People`)** | Full resident directory tracking room numbers, phone & emergency contacts, move-in dates, active/inactive status, and optional links to login accounts. |
| **Garbage Duty Rotation** | Automated, fair rotation queue sorted by who threw garbage longest ago (using join order as a tie-breaker for new residents). Logging a completed turn automatically notifies the next person in line. |
| **Water Bottle Stock & Purchases** | Visual bottle inventory (`FULL` / `EMPTY`) paired with purchase logs. Recording a restock purchase splits the cost equally among participating residents and automatically marks empty bottles as `FULL` (or creates new bottles if needed). |
| **Shared Expenses** | Tracks utility, supply, and shared household bills, automatically calculating `costPerPerson` across selected residents. |
| **Dormitory Fees** | Manages periodic rent payments with coverage start/end dates and receipt numbers, feeding live overdue and expiring-soon (14-day window) indicators on the dashboard. |
| **Account Management & RBAC** | Admin-only user provisioning (`ADMIN` and `STUDENT` roles). Public self-signup is intentionally disabled to keep dormitory data private. |
| **In-App Notifications** | Notification bell alerting residents of assigned duties (such as upcoming garbage turns) with read/unread state tracking. |
| **Bilingual UI, Theme & PWA** | Instant **English (`en`)** and **Myanmar (`my`)** switching, Light/Dark/System theme support, network connectivity banner, install prompt, and offline fallback page. |

### User Roles

- **Admin (`ADMIN`)**: Full access to create, edit, and delete residents, fees, expenses, water inventory, garbage logs, and user accounts.
- **Student (`STUDENT`)**: Authenticated read-only visibility into schedules, balances, water stock, shared expenses, personal notifications, and profile/password settings.

---

## 2. How We Built This System

The system was developed iteratively across five structured phases:

1. **Phase 1 — Domain & Database Modeling**
   - Modeled all dormitory entities (`User`, `Session`, `Account`, `Verification`, `Person`, `GarbageRecord`, `DormitoryFee`, `Expense`, `WaterBottle`, `WaterPurchase`, `Notification`) in `prisma/schema.prisma`.
   - Configured cascading deletes and many-to-many relations (`ExpenseToPerson`, `WaterPurchaseToPerson`) to ensure referential integrity.
2. **Phase 2 — Authentication, RBAC & Request Proxy**
   - Integrated **Better Auth** with the Prisma PostgreSQL adapter and credential-based email/password login.
   - Built `src/proxy.ts` to enforce session cookie checks on protected routes while chaining `next-intl` locale routing seamlessly.
   - Implemented a reusable `checkAdmin()` server-side guard (`src/lib/auth.ts`) to protect every mutating Server Action.
3. **Phase 3 — Server Actions & Validation Pipeline**
   - Built modular Next.js Server Actions under `src/actions/` (`dashboard`, `people`, `garbage`, `water`, `expenses`, `fees`, `accounts`, `notifications`, `settings`).
   - Unified input validation with **Zod** schemas (`src/lib/validations.ts`) shared between client forms (**React Hook Form**) and server actions, followed by `revalidatePath()` for immediate UI freshness.
4. **Phase 4 — Responsive Design, Charts & Localization**
   - Styled with **Tailwind CSS v4** and custom reusable UI primitives (`src/components/ui/`).
   - Built adaptive navigation: a persistent desktop sidebar (`sidebar.tsx`) paired with a mobile bottom tab bar and portal-based drawer (`mobile-nav.tsx`).
   - Added complete English and Myanmar translation dictionaries (`messages/en.json`, `messages/my.json`) and Recharts analytics.
5. **Phase 5 — PWA Capabilities & Production Hardening**
   - Configured **Serwist** (`src/app/sw.ts`, `next.config.ts`) for service worker caching and offline document fallback (`public/offline.html`).
   - Added full PWA manifest metadata, standard & maskable icons, an offline status banner, and a custom install prompt, then migrated the database to **Neon Serverless PostgreSQL** for **Vercel** deployment.

---

## 3. Tech Stack & Architecture

### Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3 (App Router) & React 19 | Full-stack SSR, Server Components, Server Actions, and routing |
| **Language** | TypeScript 5 | End-to-end static type safety |
| **Database & ORM** | Neon Serverless PostgreSQL & Prisma | Serverless relational storage and type-safe database access |
| **Authentication** | Better Auth & bcryptjs | Session management, password hashing, and RBAC (`ADMIN` / `STUDENT`) |
| **Forms & Validation** | React Hook Form 7 & Zod 4 | Performant form handling and schema validation |
| **Styling & UI** | Tailwind CSS 4, Lucide React, next-themes | Responsive utility styling, iconography, and dark/light theming |
| **Data Visualization** | Recharts 3 | Interactive dashboard expense charts |
| **Internationalization** | next-intl 4 | Locale-prefixed routing (`/en`, `/my`) and translated UI copy |
| **PWA & Offline** | Serwist 9 (`@serwist/next`) | Service worker precaching, runtime caching, and offline fallback |
| **Notifications & Dates** | react-hot-toast & date-fns 4 | Toast feedback and date formatting |

### System Architecture

```mermaid
flowchart LR
    Client["Browser / Installed PWA\n(React 19 + Serwist SW)"]
    Proxy["Request Proxy\n(src/proxy.ts)\nSession Guard + next-intl"]
    Pages["App Router Pages\n(src/app/[locale]/*)"]
    Actions["Server Actions\n(src/actions/*)"]
    API["API Route Handlers\n(/api/auth, /api/setup)"]
    Auth["Auth & Validation\n(Better Auth + checkAdmin + Zod)"]
    DB[("Neon PostgreSQL\nvia Prisma ORM")]

    Client --> Proxy
    Proxy --> Pages
    Proxy --> API
    Pages --> Actions
    Actions --> Auth
    API --> Auth
    Auth --> DB
```

### Data Model Overview

```mermaid
erDiagram
    User ||--o| Person : "links to"
    User ||--o{ Session : "has"
    User ||--o{ Account : "authenticates via"
    User ||--o{ Notification : "receives"
    Person ||--o{ GarbageRecord : "logs"
    Person ||--o{ DormitoryFee : "pays"
    Person }o--o{ Expense : "shares"
    Person }o--o{ WaterPurchase : "shares"
    WaterBottle {
        string id
        string label
        string status
    }
```

---

## 4. Project Structure

```text
dms-system/
├── messages/                    # i18n translation files (en.json, my.json)
├── prisma/
│   └── schema.prisma            # PostgreSQL schema & Prisma client generator
├── public/
│   ├── icons/                   # Standard, Apple touch, and maskable PWA icons
│   ├── images/                  # Brand logos and water bottle visuals
│   ├── manifest.json            # Web App Manifest with shortcuts
│   └── offline.html             # Offline fallback page served by Serwist
├── scripts/
│   ├── seed.mjs                 # Seeds the initial System Admin account
│   └── seed-people.mjs          # Seeds sample dormitory residents
├── src/
│   ├── actions/                 # Server Actions (accounts, dashboard, expenses, fees, garbage, notifications, people, settings, water)
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (dashboard)/     # Protected routes: /, /people, /garbage, /water, /expenses, /fees, /accounts, /settings
│   │   │   ├── login/           # Authentication page
│   │   │   ├── error.tsx        # Global error boundary
│   │   │   └── not-found.tsx    # Custom 404 page
│   │   ├── api/                 # Better Auth handler (/api/auth/[...all]) & setup utilities
│   │   └── sw.ts                # Serwist service worker configuration
│   ├── components/
│   │   ├── brand/               # Logo and login hero visual components
│   │   ├── dashboard/           # Dashboard charts & quick actions
│   │   ├── forms/               # Feature forms and modals (person, fee, expense, garbage, water, account, profile, password)
│   │   ├── layout/              # Sidebar, mobile nav, top header, notification bell, theme provider
│   │   └── ui/                  # Reusable UI primitives (table, modal, badge, card, skeleton, PWA prompt, network banner)
│   ├── i18n/                    # next-intl routing & request configuration
│   ├── lib/                     # Prisma singleton (db.ts), Better Auth setup (auth.ts, auth-client.ts), Zod schemas (validations.ts)
│   └── proxy.ts                 # Combined auth session check & locale routing proxy
├── .npmrc                       # Sets legacy-peer-deps=true for clean dependency installs
├── next.config.ts               # Integrates next-intl and Serwist
└── package.json                 # Dependencies and scripts
```

---

## 5. Errors & Challenges Encountered

During development and production deployment, we encountered several real-world technical challenges and resolved them systematically:

| Challenge / Error | Root Cause | How We Solved It |
| :--- | :--- | :--- |
| **Vercel Auth Origin & Trailing Slash Errors** | Better Auth rejected requests on Vercel preview/branch deployments or when environment URLs included trailing slashes, causing failed logins. | Added dynamic `trustedOrigins` (`VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_BRANCH_URL`), stripped trailing slashes via `cleanUrl()`, and made the auth client resolve `window.location.origin` dynamically. |
| **Stale Cookie Infinite Redirect Loop** | Redirecting logged-in users away from `/login` purely based on cookie presence caused an infinite loop when a cookie was stale in the database. | Updated `src/proxy.ts` to protect dashboard routes without auto-redirecting `/login` when a cookie exists, and explicitly bypassed `/api/auth` and `/api/setup`. |
| **SQLite to Production Serverless Migration** | Local SQLite (`prisma/dev.db`) is incompatible with ephemeral serverless deployments on Vercel. | Migrated the Prisma datasource to **Neon Serverless PostgreSQL** with `driverAdapters` enabled for production reliability. |
| **Prisma Adapter & Peer Dependency Conflicts** | Version mismatches between `@prisma/client`, `@prisma/adapter-neon`, and React 19 triggered installation and build errors. | Aligned Prisma packages to compatible versions and added `.npmrc` with `legacy-peer-deps=true`. |
| **Foreign Key `RESTRICT` Errors When Deleting Residents** | Deleting a `Person` with linked fees, garbage records, or linked users failed due to default database foreign key constraints. | Added `onDelete: Cascade` across dependent relations in `prisma/schema.prisma`. |
| **Mobile Browser Numeric Input Bugs & TS Errors** | Using `valueAsNumber` and `z.coerce.number()` caused awkward cursor/empty-string behavior on mobile keyboards and TypeScript resolver mismatches. | Switched numeric form fields to React Hook Form's `setValueAs` parser paired with strict `z.number()` Zod schemas. |
| **Mobile Drawer Clipped Behind Dashboard Cards** | CSS transforms and stacking contexts inside dashboard containers trapped the mobile navigation drawer and compressed its height. | Rendered the mobile drawer/modals through **React Portals** so they mount outside parent CSS containing blocks with clean z-index layering, and adjusted flex headers on narrow screens. |
| **Unfair Garbage Rotation for New Residents** | Residents who had never thrown garbage before had equal `null` timestamps, resulting in unpredictable ordering. | Added a deterministic tie-breaker in `getGarbageRotation()` sorting never-thrown residents by `createdAt` (insertion order). |
| **PWA Icon Failures & Service Worker Bundling** | Initial placeholder icons failed PWA installability checks, and Serwist requires Webpack bundling during builds. | Generated proper PNG and maskable icon sets (`192x192`, `512x512`, `apple-touch-icon`), added `public/offline.html`, and configured `--webpack` in `dev` and `build` scripts. |

---

## 6. Testing & Verification

Because DMS combines Server Actions, relational database rules, authentication, and PWA behavior, we verify changes across four levels before releasing:

### 1. Static Analysis, Type Checking & Production Build
Run these checks before committing or deploying:
```bash
# Lint codebase with ESLint (Next.js core-web-vitals + TypeScript rules)
npm run lint

# Verify strict TypeScript types across the entire project
npx tsc --noEmit

# Verify production build & Serwist service worker bundling
npm run build
```

### 2. Database Seeding for Testing
Populate a fresh database with an admin account and sample residents:
```bash
# Create default System Admin account (admin@dorm.com / adminpassword123)
node scripts/seed.mjs

# Add sample dormitory residents (John Doe, Jane Smith, Michael Johnson)
node scripts/seed-people.mjs
```
> Alternatively, during initial setup you can visit `/api/setup` to bootstrap the `admin@dorm.com` account via Better Auth.

### 3. Auth & Account Action Diagnostic Scripts
The repository includes lightweight scripts for troubleshooting auth flows during development:
- `test-login.js` & `GET /api/test-login`: Verifies credential sign-in against Better Auth.
- `test-create.ts`: Tests the `createAccountAction` Server Action directly.

### 4. End-to-End Functional Checklist
Before deploying to production, verify the following flows in a browser (desktop + mobile viewport):
- **Authentication & RBAC**: Log in as `ADMIN` (verify full CRUD) and as `STUDENT` (verify write actions are blocked by UI and `checkAdmin()`).
- **Dashboard Metrics**: Confirm overdue fees, 14-day expiring alerts, monthly expense totals, and Recharts visualizations update immediately after creating/editing records.
- **Garbage Rotation & Notifications**: Log a garbage turn and confirm the next resident in the queue moves to "Up Next" and receives an unread notification in their notification bell.
- **Water Stock Auto-Refill**: Mark bottles `EMPTY`, log a water purchase, and confirm empty bottles automatically flip to `FULL` and `costPerPerson` divides accurately.
- **Shared Expenses & Fees**: Test multi-resident expense splitting and verify cascading deletion when removing a test resident.
- **Localization & Theme**: Toggle between English (`/en`) and Myanmar (`/my`) and switch Light/Dark/System themes without layout shift.
- **PWA & Offline Mode**: Build and run in production mode (`npm run build && npm run start`), open **Chrome DevTools → Application → Service Workers**, check **Offline**, and verify `public/offline.html` and the network status banner appear cleanly.

---

## 7. Launching the Web App

### Prerequisites

- **Node.js** `v20+` (LTS recommended)
- **npm** (included with Node.js)
- A **PostgreSQL** database (recommended: [Neon Serverless Postgres](https://neon.tech/))

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ThantZin01/dms-system.git
   cd dms-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   *(Note: `.npmrc` automatically applies `legacy-peer-deps=true`.)*

3. **Configure environment variables**
   Create a `.env` file in the project root:
   ```env
   # Neon / PostgreSQL connection string
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

   # Better Auth secret (generate a strong random 32+ character string)
   BETTER_AUTH_SECRET="your-super-secret-random-string"

   # Application base URLs (no trailing slash)
   BETTER_AUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Generate Prisma Client & Push Schema**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the initial Admin user (and optional sample residents)**
   ```bash
   node scripts/seed.mjs
   node scripts/seed-people.mjs   # Optional sample data
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
   > `npm run dev` runs with `-H 0.0.0.0 --webpack`, making the app accessible from phones on the same Wi-Fi network for mobile UI testing.

### Running Production Build Locally

To test the production bundle and Serwist PWA service worker locally (service workers are disabled in `development` mode):

```bash
npm run build
npm run start
```

### Deploying to Production (Vercel)

1. Push the repository to GitHub and import it into **[Vercel](https://vercel.com/)**.
2. In **Project Settings → Environment Variables**, configure:
   - `DATABASE_URL` (your Neon PostgreSQL pooled/direct connection URL)
   - `BETTER_AUTH_SECRET` (a cryptographically strong secret)
   - `BETTER_AUTH_URL` (optional; falls back automatically to `VERCEL_URL` / production domain)
   - `NEXT_PUBLIC_APP_URL` (optional; defaults to `window.location.origin` in the browser)
3. Deploy the project—Vercel runs `npm run build` automatically.
4. Push the Prisma schema to your production Neon database and seed the admin account:
   ```bash
   npx prisma db push
   node scripts/seed.mjs
   ```
5. **Post-Deployment Security Checklist**:
   - Change the default seeded admin password immediately after your first login via **Settings**.
   - Remove or restrict development helper routes (`src/app/api/setup/route.ts` and `src/app/api/test-login/route.ts`) before opening the app to live users.

---

## 8. Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server on `0.0.0.0:3000` using Webpack |
| `npm run build` | Creates an optimized production build and compiles the Serwist service worker |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint across the codebase |
| `npx prisma generate` | Generates the TypeScript Prisma Client from `prisma/schema.prisma` |
| `npx prisma db push` | Syncs the Prisma schema directly to the configured PostgreSQL database |
| `npx prisma studio` | Opens Prisma's visual database browser |
| `node scripts/seed.mjs` | Creates the default System Admin account |
| `node scripts/seed-people.mjs` | Inserts sample dormitory residents for testing |

---

## 9. Contributing & License

Contributions, bug reports, and feature requests are welcome! Feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/ThantZin01/dms-system/issues).

This project is licensed under the **MIT License**.
