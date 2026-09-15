---
name: testing-quality
description: Use when authoring tests, verifying features, reviewing code, fixing regressions, and enforcing automated quality gates.
---

# Goal
Ensure TeamPulse maintains uncompromising reliability, security posture, and functionality through automated unit, integration, and end-to-end tests paired with strict static quality checks.

# When to Use
- Writing or executing unit tests for utility functions, schemas, and domain services.
- Writing or executing integration tests for Route Handlers and authentication logic.
- Authoring and running Playwright E2E tests for user journeys.
- Running quality gate scripts (`npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`).
- Investigating test failures or continuous integration regressions.

# Engineering Standards
- **Testing Philosophy**:
  - Prioritize meaningful behavioral verification over high vanity code coverage percentages.
  - Test critical security and data integrity boundaries first.
- **Testing Frameworks**:
  - **Vitest**: Fast unit and integration testing for schemas, domain services, and Route Handlers.
  - **Playwright**: Reliable browser-based end-to-end testing for full user lifecycles.
- **Mandatory Test Scenarios**:
  - **Authentication**:
    - Valid credentials yield successful session creation and redirect.
    - Invalid credentials return generic rejection without disclosing existence of email.
    - Accessing `/announcements` unauthenticated redirects to `/login`.
    - `GET /api/announcements` unauthenticated returns `401 Unauthorized`.
    - `POST /api/announcements` unauthenticated returns `401 Unauthorized`.
    - Logging out terminates session and makes `/announcements` inaccessible.
  - **Announcements**:
    - `POST /api/announcements` validates minimum and maximum lengths for title and body.
    - `POST /api/announcements` ignores or strips any client-provided `authorId` and binds the authenticated user ID.
    - `GET /api/announcements` returns records sorted descending by `createdAt`.
  - **Critical E2E Journey**:
    ```text
    Open App (Redirect to /login)
          ↓
    Submit Valid Credentials
          ↓
    Confirm Navigation to /announcements
          ↓
    Verify Seeded Announcements Render
          ↓
    Fill Title and Message Body → Click Publish
          ↓
    Verify New Announcement Immediately Appears in List
          ↓
    Click Logout
          ↓
    Verify Redirect to /login and Protected Route Guard
    ```

# Implementation Guidelines
1. **Vitest Configuration (`vitest.config.ts`)**:
   - Configure path aliases matching `tsconfig.json` (`@/*`).
   - Use Node test environment for backend/schema tests.
2. **Quality Gate Execution**:
   - All code must pass without errors or warnings before task completion:
     ```bash
     npm run lint
     npm run typecheck
     npm run test
     npm run build
     ```
   - Never suppress linter or compiler errors (`// @ts-ignore`, `eslint-disable`) to satisfy the build.

# Security / Quality Requirements
- Verify that test assertions explicitly inspect HTTP status codes, error message structure, and payload data.
- Ensure test environments use isolated mock databases or reset routines to avoid state bleeding.
- Ensure no real credentials or sensitive secrets are stored in test fixtures.

# Verification Checklist
- [ ] Do unit and integration tests run cleanly with `npm run test`?
- [ ] Does Playwright E2E verify the complete unauthenticated → login → create → view → logout flow?
- [ ] Does `npm run lint` pass with zero warnings or errors?
- [ ] Does `npm run typecheck` succeed with zero TypeScript errors?
- [ ] Does `npm run build` create a production-ready build successfully?
