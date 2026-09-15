---
name: architecture
description: Use when deciding project structure, boundaries, abstractions, dependencies, or architectural changes.
---

# Goal
Provide definitive architectural guidance for TeamPulse to maintain clean boundaries, high cohesion, low coupling, and predictable data and dependency flow without premature or unnecessary abstraction.

# When to Use
- Designing or refactoring file and directory structures.
- Deciding client versus server responsibility boundaries.
- Evaluating whether to add a new library, module, layer, or abstraction.
- Implementing cross-cutting features spanning database, backend, and frontend.
- Reviewing PRs or code changes for architectural integrity.

# Engineering Standards
- **Reasoning Process**: Before making any major structural change, follow this sequence:
  ```text
  Requirement → Boundary → Responsibility → Implementation → Verification
  ```
- **Separation of Concerns**:
  - **Route Handlers**: Must be thin coordinators. Never mix authentication, validation, raw database calls, and business logic directly in route handler files.
  - **Business & Domain Logic**: Colocate in `lib/` domain modules (e.g., `lib/announcements/`, `lib/auth/`).
  - **Database Access**: Encapsulate queries in domain services or data access functions. Presentation components must never import database clients.
  - **Validation**: Enforce schema validation at system boundaries (incoming HTTP payloads, environment configuration).
- **Pragmatic Abstraction**:
  - Do not introduce repository interfaces or multi-tier service abstractions if they do not provide tangible value for this focused single-resource domain.
  - Avoid circular dependencies between modules. Maintain unidirectional dependency flow: UI → Route Handlers / Actions → Domain Services → DB Client.
- **Server-First Mindset**:
  - Keep Next.js React Server Components (RSC) as the default presentation layer.
  - Minimize `"use client"` directives to only interactive leaf nodes (forms, interactive menus).
  - Never import server-only packages (Prisma, bcryptjs, session utilities) into client-facing files.

# Implementation Guidelines
1. **Directory Organization**:
   - `app/`: Routing, pages, layouts, Route Handlers (`app/api/`).
   - `components/`: Modular React components grouped by domain (`announcements/`, `auth/`, `layout/`, `ui/`).
   - `lib/`: Domain business logic, database client, schema validation, and authentication helpers.
   - `prisma/`: Prisma schema, migrations, and seed scripts.
   - `tests/`: Automated unit, integration, and end-to-end tests.
2. **Thin Route Handler Pattern**:
   ```typescript
   // Route Handler Pattern
   export async function POST(req: Request) {
     const session = await requireAuth();
     const payload = await parseAndValidate(req, schema);
     const result = await domainService.create(payload, session.user.id);
     return NextResponse.json({ data: result }, { status: 201 });
   }
   ```

# Security / Quality Requirements
- Boundaries must strictly isolate sensitive server modules from client bundles.
- Never pass database entities containing sensitive fields (like password hashes) directly across network boundaries.
- Ensure strict TypeScript typing across all architectural layers.

# Verification Checklist
- [ ] Are Route Handlers thin and free of inlined business or raw query logic?
- [ ] Is `"use client"` strictly limited to components requiring client interactivity?
- [ ] Are server-only utilities kept strictly on the server?
- [ ] Is dependency flow strictly unidirectional without cycles?
- [ ] Is the architectural change documented with clear rationale?
