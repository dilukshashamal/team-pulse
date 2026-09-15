# TeamPulse — Implementation Plan

> **Architectural & Implementation Blueprint**  
> This plan details the phased execution strategy for constructing **TeamPulse**, an authenticated internal team announcements portal built with Next.js App Router, Auth.js, Prisma ORM, PostgreSQL, Zod, and SWR.

---

## Phase 1 — Project Foundation

- **Objective**: Establish the core runtime, toolchain, and styling configuration with strict engineering constraints.
- **Tasks**:
  1. Initialize Next.js project with App Router, TypeScript (strict mode enabled), Tailwind CSS, and ESLint.
  2. Configure `tsconfig.json` to enforce strict type checking (`"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`).
  3. Configure ESLint and Prettier for code consistency and standard hygiene.
  4. Ensure package manager is `npm` and existing Git repository (`.git`) is preserved without re-initialization.
  5. Establish `docker-compose.yml` for local containerized PostgreSQL persistence.
  6. Establish `.env.example` with non-secret defaults.

---

## Phase 2 — Project Structure & Boundary Definition

- **Objective**: Lay out the clean architectural hierarchy enforcing separation of concerns across UI, API, domain logic, and persistence.
- **Target File Layout**:
  ```text
  team-pulse/
  ├── app/
  │   ├── api/
  │   │   ├── auth/[...nextauth]/route.ts
  │   │   └── announcements/route.ts
  │   ├── login/page.tsx
  │   ├── announcements/
  │   │   ├── layout.tsx
  │   │   ├── loading.tsx
  │   │   └── page.tsx
  │   ├── layout.tsx
  │   ├── page.tsx
  │   └── globals.css
  ├── components/
  │   ├── announcements/
  │   │   ├── announcement-card.tsx
  │   │   ├── announcement-form.tsx
  │   │   └── announcement-list.tsx
  │   ├── auth/
  │   │   └── login-form.tsx
  │   ├── layout/
  │   │   ├── app-header.tsx
  │   │   └── user-menu.tsx
  │   └── ui/
  │       ├── button.tsx
  │       ├── input.tsx
  │       ├── textarea.tsx
  │       ├── form-error.tsx
  │       └── empty-state.tsx
  ├── lib/
  │   ├── auth/
  │   │   ├── auth.ts
  │   │   └── require-user.ts
  │   ├── announcements/
  │   │   └── service.ts
  │   ├── db/
  │   │   └── prisma.ts
  │   └── validation/
  │       ├── announcement.ts
  │       └── auth.ts
  ├── prisma/
  │   ├── schema.prisma
  │   └── seed.ts
  ├── tests/
  │   ├── unit/
  │   ├── integration/
  │   └── e2e/
  ├── docs/
  │   └── IMPLEMENTATION_PLAN.md
  ├── .agents/
  │   └── skills/
  ├── AGENTS.md
  ├── docker-compose.yml
  ├── .env.example
  ├── README.md
  ├── package.json
  └── tsconfig.json
  ```

---

## Phase 3 — Database & Persistence (PostgreSQL + Prisma)

- **Objective**: Implement durable persistence, schema constraints, migrations, and idempotent demo data seeding.
- **Tasks**:
  1. Define `docker-compose.yml` with PostgreSQL 16 image and persistent named volume.
  2. Model `User` and `Announcement` in `prisma/schema.prisma`:
     - `User`: `id` (cuid), `name`, `email` (unique index), `passwordHash`, `createdAt`.
     - `Announcement`: `id` (cuid), `title`, `body`, `authorId` (foreign key to `User.id`), `createdAt` (indexed descending), `updatedAt`.
  3. Configure Prisma client singleton in `lib/db/prisma.ts` with development connection pooling protection.
  4. Generate and run the initial migration (`prisma migrate dev --name init`).
  5. Create `prisma/seed.ts` using `bcryptjs` to hash demo user password (`demo@teampulse.internal` / `Password123!`), seeding demo announcements idempotently.
  6. Execute `npx prisma db seed` and verify database records.

---

## Phase 4 — Authentication & Security (Auth.js)

- **Objective**: Implement secure credentials-based authentication, session management, and route protection.
- **Tasks**:
  1. Install and configure Auth.js (`next-auth@beta` or stable App Router compatible version) with Credentials Provider.
  2. Implement password comparison using `bcryptjs.compare`.
  3. Expose Auth.js handlers via `app/api/auth/[...nextauth]/route.ts`.
  4. Implement reusable server-side security helper `requireUser()` in `lib/auth/require-user.ts`.
  5. Implement route-level protection:
     - Middleware or layout redirect protecting `/announcements` and redirecting unauthenticated visitors to `/login`.
     - Unauthenticated root (`/`) redirects authenticated users to `/announcements` and unauthenticated users to `/login`.
  6. Build accessible `/login` page with `LoginForm` component showing field-level errors and generic failure notices.
  7. Implement accessible logout trigger in `UserMenu`.

---

## Phase 5 — API & Validation (Zod + Route Handlers)

- **Objective**: Build robust, validated, and thin API endpoints for announcement operations.
- **Tasks**:
  1. Create Zod validation schema in `lib/validation/announcement.ts`:
     - `title`: string, trimmed, min 3, max 120.
     - `body`: string, trimmed, min 3, max 2000.
  2. Implement domain service in `lib/announcements/service.ts`:
     - `getAnnouncements()`: retrieves announcements sorted newest first, projecting only `id`, `title`, `body`, `createdAt`, and `author.name`.
     - `createAnnouncement(data, authorId)`: creates record binding the author securely.
  3. Implement `GET /api/announcements`:
     - Requires active session via `requireUser()`.
     - Returns `{ data: announcements }` with status `200`.
  4. Implement `POST /api/announcements`:
     - Requires active session via `requireUser()`.
     - Parses JSON safely and validates payload with Zod.
     - Author ID taken strictly from session; ignores any client-supplied `authorId`.
     - Returns `{ data: announcement }` with status `201`.
     - Catches validation errors returning `{ error: { message, details } }` with status `400`.

---

## Phase 6 — Frontend & State Management (React + SWR)

- **Objective**: Construct a responsive, accessible, professional SaaS UI with clear local vs. server state separation.
- **Tasks**:
  1. Build atomic UI components in `components/ui/` (`Button`, `Input`, `Textarea`, `FormError`, `EmptyState`).
  2. Build `AppHeader` and `UserMenu` showing current user profile details and logout button.
  3. Build `AnnouncementForm`:
     - Controlled inputs with local React state (`title`, `body`).
     - Real-time length indicators and client-side validation hints.
     - Disabled submit button while pending (`isSubmitting`).
     - Error banner on submission failure.
  4. Integrate SWR for server state in `AnnouncementList`:
     - Handles initial loading skeleton (`loading.tsx` and SWR `isLoading`).
     - Handles network error state with retry capability.
     - Handles empty state when no announcements exist.
     - Performs cache mutation (`mutate()`) immediately upon successful POST to update feed.
  5. Build `AnnouncementCard` displaying title, body, author name, and formatted timestamp.

---

## Phase 7 — Automated Testing (Vitest & Playwright)

- **Objective**: Verify security boundaries, validation logic, and full user flows with automated test suites.
- **Tasks**:
  1. Configure Vitest for unit and integration testing.
  2. Write unit tests for Zod schemas (`announcement.ts`, `auth.ts`).
  3. Write integration tests for API endpoints (`GET /api/announcements`, `POST /api/announcements`) verifying:
     - 401 on unauthenticated access.
     - 400 on invalid payload bounds.
     - 201 on valid submission with correct author binding.
  4. Configure Playwright for end-to-end user journeys:
     - Unauthenticated access redirects to `/login`.
     - Invalid login displays error.
     - Valid login redirects to `/announcements`.
     - Creating announcement adds it immediately to the feed.
     - Logout invalidates access and redirects to `/login`.

---

## Phase 8 — Documentation & Final Quality Gate

- **Objective**: Deliver comprehensive documentation and pass all quality gates.
- **Tasks**:
  1. Author production-grade `README.md` containing all 18 specified sections and explaining the 6 core architectural decisions ("WHY").
  2. Verify `.env.example` contains complete configuration instructions.
  3. Verify `.gitignore` excludes all sensitive and build files (`node_modules`, `.next`, `.env`, `.env.local`, test reports).
  4. Execute full quality gate:
     ```bash
     npm run lint
     npm run typecheck
     npm run test
     npm run build
     ```
  5. Execute manual 20-step verification journey.
  6. Perform senior engineering code review and resolve any findings.
