# AGENTS.md — TeamPulse AI & Engineering Rules of Engagement

> **Primary Engineering Contract**  
> This document defines the engineering standards, architecture rules, dependency constraints, and quality gates for the **TeamPulse** codebase. All human engineers and AI coding agents working on this repository must strictly adhere to these directives.

---

## 1. Project Overview & Boundaries

- **Project Name**: TeamPulse
- **Purpose**: Authenticated internal team Announcements Portal built with Next.js (App Router) for both frontend and backend.
- **Scope Restriction**: Only implement the single vertical slice requested: authentication + announcement creation/viewing + logout.
- **Strictly Out of Scope**:
  - Public self-registration (accounts are strictly provisioned by organization / seeded).
  - Password reset, email verification, OAuth/social login.
  - Comments, reactions, likes, rich text formatting, file uploads.
  - Profiles, directory, dashboards, role-management UI, notifications.
  - Announcement editing, deletion, search, or pagination beyond the clean list view.
  - Over-engineered state management (no Redux, Zustand, MobX).

---

## 2. General Engineering Standards

### TypeScript & Typing
- **TypeScript Strict Mode**: TypeScript strict mode must remain enabled (`strict: true` in `tsconfig.json`).
- **No `any`**: The `any` type is strictly forbidden. Use proper generic constraints, discriminated unions, or `unknown` with runtime type narrowing (e.g., Zod).
- **Explicit Types at Boundaries**: Function arguments, return types, API route request payloads, response data schemas, and database mappings must have explicit TypeScript types.
- **Naming Conventions**: Use descriptive, intention-revealing names:
  - PascalCase for React components, types, and interfaces.
  - camelCase for functions, variables, hooks, and object properties.
  - kebab-case for component and utility file names (e.g., `announcement-card.tsx`, `auth-options.ts`).
  - UPPER_SNAKE_CASE for environment variables and compile-time constants.

### Code Organization & SOLID Principles
- **Single Responsibility Principle (SRP)**: Keep functions, components, and modules small and focused on a single concern.
- **Separation of Concerns**:
  - Presentation components must not execute database queries or perform complex business logic.
  - Route Handlers must act as thin orchestrators (authentication check -> validation -> domain logic -> response formatting).
  - Database access must reside strictly in dedicated service/data access modules (`lib/announcements/`, `lib/db/`).
- **Composition over Inheritance**: Prefer React component composition and functional utilities over inheritance or deep abstraction hierarchies.
- **Avoid Premature Abstraction**: Do not build generic frameworks, dynamic entity managers, or complex repository layers for a single-resource domain.
- **Avoid Duplicated Logic**: Shared validation schemas, type definitions, and business calculations must be colocated in `lib/` and reused across frontend and backend.

### Async & Error Handling
- **Consistent Async/Await**: Always use `async`/`await` for asynchronous operations. Avoid mixing raw `.then()`/`.catch()` chains with `async`/`await`.
- **Explicit Error Handling**: Always handle expected errors explicitly.
- **No Silent Failures**: Never catch exceptions and swallow them without logging or re-throwing appropriate user-facing or operational errors.
- **Sanitized Error Responses**: Never expose internal database errors, ORM details, or stack traces to client HTTP responses. Return structured, safe error objects (e.g., `{ error: { message: string, code?: string, details?: unknown } }`).

### Security First
- **Zero Client-Side Secrets**: Server secrets, database credentials, and cryptographic keys (`AUTH_SECRET`, `DATABASE_URL`) must never be imported into client components or exposed through `NEXT_PUBLIC_*` variables.
- **Never Commit Secrets**: Never commit `.env`, `.env.local`, or any private credential files. Always keep `.env.example` up to date with non-sensitive placeholder values.
- **Password Security**: Passwords must never be stored in plaintext. Use secure hashing (`bcryptjs` or `bcrypt` with appropriate salt rounds). Never return password hashes in queries or API responses.
- **Server-Side Enforcement**: Client-side validation is purely for user experience. Every API endpoint must independently enforce authentication, authorization, and input validation.

### Clean Code & Documentation
- **Comments**: Add comments only to explain **WHY** an unconventional decision or complex algorithm was chosen, not obvious **WHAT** the code is doing.
- **Semantic HTML & Accessibility**: Ensure forms have associated `<label>` elements, buttons use native `<button>` tags with proper focus indicators, and ARIA attributes are used when semantics cannot be conveyed by native HTML.

---

## 3. Dependency Governance Rules

Before installing or introducing any new package into `package.json`:
1. **Justification**: Verify that the package solves a direct, non-trivial requirement that cannot be cleanly achieved using standard Web APIs, React, or Next.js capabilities.
2. **Maturity & Maintenance**: Choose mature, actively maintained libraries with active TypeScript support.
3. **No Duplication**: Avoid installing packages that overlap in capability (e.g., do not combine `axios` with `fetch`, or `date-fns` with `dayjs` when native `Intl.DateTimeFormat` suffices).
4. **Next.js Compatibility**: Ensure packages are fully compatible with Next.js App Router and React Server Components (RSC).
5. **Approved Baseline Stack**:
   - Framework: Next.js (App Router)
   - Language: TypeScript
   - Styling: Tailwind CSS
   - Authentication: Auth.js (`next-auth`) with Credentials provider
   - Password Hashing: `bcryptjs`
   - Database & ORM: PostgreSQL with Prisma ORM
   - Validation: Zod
   - Client Remote State: SWR
   - Testing: Vitest (Unit/Integration) + Playwright (E2E)

---

## 4. Quality Gates & Verification

All code submitted to this repository must pass the following quality commands without errors or warnings:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

### Quality Directives:
- **Zero Warning Tolerance**: Fix linting errors and warnings at their source.
- **No Rule Disabling**: Never disable ESLint rules, add `// @ts-ignore`, `// @ts-expect-error`, or `/* eslint-disable */` solely to force a build to pass.
- **Continuous Verification**: After making any functional change, run the relevant verification script before proceeding to subsequent phases.
