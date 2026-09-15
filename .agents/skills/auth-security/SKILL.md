---
name: auth-security
description: Use for authentication, authorization, login, logout, sessions, credentials, protected routes, and protected APIs.
---

# Goal
Establish robust, defense-in-depth authentication and access control for TeamPulse using Auth.js (NextAuth.js) and secure credentials management.

# When to Use
- Configuring or updating Auth.js configuration (`auth.ts`, `app/api/auth/[...nextauth]/route.ts`).
- Implementing credentials-based login or logout flows.
- Protecting UI routes, layouts, or pages from unauthenticated access.
- Securing backend Route Handlers and internal APIs.
- Managing session cookies, token issuance, or password hashing.

# Engineering Standards
- **Standard Library & Tooling**:
  - Use Auth.js (`next-auth`) with the Credentials Provider.
  - Use `bcryptjs` for secure salt generation and password hashing (minimum 10 salt rounds).
  - Never implement custom session management or custom cryptographic primitives.
- **Strict Separation of Route vs. API Protection**:
  - Never assume that protecting a page (via middleware or server component redirect) protects the underlying API.
  - Every protected API endpoint (`/api/announcements`) must independently verify the user's session.
- **Authentication Lifecycle**:
  ```text
  User inputs email/password
        ↓
  Server-side Zod validation
        ↓
  Query user by email (Prisma)
        ↓
  Verify password hash with bcryptjs
        ↓
  Issue secure HTTP-only session cookie (Auth.js)
        ↓
  Client redirects to /announcements
  ```
- **Session Utilities**:
  - Provide a reusable server helper `requireUser()` / `requireAuth()` that retrieves the active session, validates identity, and throws or returns an unauthorized response if missing.
- **Credential Hygiene**:
  - Never log passwords, raw credentials, or session secret tokens.
  - Never include `passwordHash` in session objects, client payloads, or API responses.
  - Return generic "Invalid email or password" error messages to avoid user enumeration.

# Implementation Guidelines
1. **Helper Function `requireAuth()`**:
   ```typescript
   import { auth } from "@/lib/auth/auth";
   import { UnauthorizedError } from "@/lib/errors";

   export async function requireUser() {
     const session = await auth();
     if (!session?.user?.id) {
       throw new UnauthorizedError("Authentication required");
     }
     return session.user;
   }
   ```
2. **Route Protection**:
   - In App Router, enforce authentication checks in server components / layouts (`app/announcements/layout.tsx` or `page.tsx`) or Next.js middleware, redirecting unauthenticated users to `/login`.
   - In Route Handlers, return `401 Unauthorized` directly if `session?.user` is absent.
3. **Environment Security**:
   - `AUTH_SECRET` must be set via environment variable with high entropy (e.g., 32+ random bytes).
   - In production, ensure cookies have `Secure`, `HttpOnly`, and `SameSite=Lax` flags enabled.

# Security / Quality Requirements
- [x] Zero plaintext passwords in database, memory, or logs.
- [x] Password hashes strictly excluded from all `select` statements returning to clients.
- [x] Middleware / layout redirects unauthenticated requests on protected pages.
- [x] API endpoints return `401` on missing or invalid session.
- [x] Secrets stored exclusively in `.env.local` / system env; never committed to git.

# Verification Checklist
- [ ] Does valid login succeed and redirect to `/announcements`?
- [ ] Does invalid login fail with a generic error message?
- [ ] Does accessing `/announcements` without a session redirect to `/login`?
- [ ] Does `GET /api/announcements` return `401` when unauthenticated?
- [ ] Does `POST /api/announcements` return `401` when unauthenticated?
- [ ] Does logging out terminate the session and revoke access to `/announcements`?
- [ ] Is `passwordHash` excluded from all API output?
