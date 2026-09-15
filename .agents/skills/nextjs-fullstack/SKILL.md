---
name: nextjs-fullstack
description: Use for Next.js App Router engineering, layouts, pages, Route Handlers, Server Components, Client Components, navigation, loading/error states, and server/client boundaries.
---

# Goal
Provide standards for building scalable, idiomatic full-stack applications with the Next.js App Router, enforcing proper boundary management between React Server Components (RSC) and Client Components.

# When to Use
- Implementing or modifying Next.js pages, layouts, and templates.
- Creating or updating Next.js Route Handlers (`app/api/**/route.ts`).
- Structuring React Server Components and interactive Client Components (`"use client"`).
- Implementing UI loading states (`loading.tsx`), error boundaries (`error.tsx`), or not-found handlers (`not-found.tsx`).
- Managing server/client data handoffs and navigation.

# Engineering Standards
- **App Router Exclusivity**: Strictly use the Next.js App Router (`app/` directory). Never use the legacy Pages Router (`pages/`).
- **Server Components as Default**:
  - Keep all components as React Server Components unless explicit browser interactivity (hooks, DOM event listeners, browser APIs) is required.
  - Push Client Components down the component tree to the interactive leaves.
- **Strict Boundary Isolation**:
  - Never import server-only libraries (`@prisma/client`, `bcryptjs`, Node `crypto`, `fs`) into Client Components.
  - Use `server-only` markers or conventions to prevent accidental bundle leakage.
- **Semantic HTML & Standards**:
  - Render accessible, semantic HTML elements (`<header>`, `<main>`, `<nav>`, `<article>`, `<button>`).
  - Eliminate hydration mismatches by ensuring consistent SSR/client markup (avoid non-deterministic date formats during initial render).
- **Correct HTTP Status Codes**:
  - `200 OK`: Successful data retrieval or standard updates.
  - `201 Created`: Successful resource creation.
  - `400 Bad Request`: Client validation error or malformed JSON.
  - `401 Unauthorized`: Missing, expired, or invalid session token.
  - `403 Forbidden`: Authenticated user lacks permission.
  - `500 Internal Server Error`: Unexpected server-side fault (generic response to client).

# Implementation Guidelines
1. **Route Handlers**:
   - Always return standard Web `Response` or `NextResponse`.
   - Read request body using safe JSON parsing wrappers.
   - Set appropriate cache-control headers (`Cache-Control: no-store` for authenticated endpoints).
2. **Page & Layout Composition**:
   - `app/layout.tsx`: Root layout with font definitions, metadata, and global shell.
   - `app/announcements/layout.tsx`: Authenticated portal shell with navigation header and user menu.
   - `app/announcements/page.tsx`: Server Component entry point delegating to announcements feed.
   - `app/announcements/loading.tsx`: Clean visual skeleton matching content layout.

# Security / Quality Requirements
- Route Handlers must always validate authentication independently; do not rely on middleware or UI redirects alone.
- Never render raw unescaped HTML. React JSX handles string escaping by default.
- Minimize bundle size by avoiding heavy client-side utility libraries.

# Verification Checklist
- [ ] Are all routes built inside the `app/` directory adhering to App Router patterns?
- [ ] Is `"use client"` placed only on interactive leaf components?
- [ ] Are Route Handlers using standard HTTP status codes (200, 201, 400, 401, 500)?
- [ ] Do pages have functional loading (`loading.tsx`) and error states?
- [ ] Are hydration errors absent from browser and server logs?
