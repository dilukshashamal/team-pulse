---
name: database-prisma
description: Use for database schema modeling, migrations, query optimization, Prisma ORM operations, PostgreSQL configuration, and database seeding.
---

# Goal
Ensure reliable, type-safe persistence and migrations for TeamPulse using PostgreSQL and Prisma ORM, adhering to strict data integrity, indexing, and security practices.

# When to Use
- Designing or modifying Prisma schema (`prisma/schema.prisma`).
- Generating and running database migrations (`prisma migrate dev`).
- Writing queries or repository functions for `User` and `Announcement` entities.
- Writing or executing database seed scripts (`prisma/seed.ts`).
- Configuring Prisma client singleton for Next.js hot reloading.

# Engineering Standards
- **Relational Schema Design**:
  - `User`:
    - `id`: String (cuid/uuid), primary key.
    - `name`: String, required.
    - `email`: String, unique, indexed, normalized lowercase.
    - `passwordHash`: String, required.
    - `createdAt`: DateTime (UTC default now).
    - `announcements`: Relation list to `Announcement`.
  - `Announcement`:
    - `id`: String (cuid/uuid), primary key.
    - `title`: VarChar/String, required.
    - `body`: Text/String, required.
    - `authorId`: String, foreign key referencing `User.id` on delete cascade/restrict.
    - `createdAt`: DateTime (UTC default now), indexed for descending order sorting.
    - `updatedAt`: DateTime (UTC auto-updated).
    - `author`: Relation to `User`.
- **Query Hygiene**:
  - Never use blind `select *` or implicit complete object fetches when only specific fields are needed.
  - Exclude `passwordHash` explicitly in all user-facing queries via Prisma `select` projections.
  - Eagerly load relations using `include` or explicit joins to eliminate N+1 query overhead:
    ```typescript
    prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        body: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    ```
- **Prisma Client Singleton**:
  - In Next.js development mode, avoid exhausting database connection pools caused by hot module reloading by caching the Prisma instance on `globalThis`.
- **Migrations & Seeding**:
  - Never manually alter database tables; always use Prisma migration files.
  - The seed script (`prisma/seed.ts`) must generate a demo user with a pre-hashed password using `bcryptjs`.
  - Seed execution must be idempotent (e.g., using `upsert` on email).

# Implementation Guidelines
1. **Prisma Client Setup (`lib/db/prisma.ts`)**:
   ```typescript
   import { PrismaClient } from "@prisma/client";

   const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

   export const prisma =
     globalForPrisma.prisma ??
     new PrismaClient({
       log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
     });

   if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
   ```
2. **Seed Script Requirements**:
   - Seed at least 1 demo user (`demo@teampulse.internal`) with documented test credentials.
   - Seed 2–3 realistic initial announcements.

# Security / Quality Requirements
- Unique index on `User(email)`.
- Index on `Announcement(createdAt)` to guarantee high-performance feed retrieval.
- Never store raw passwords during seeding or user creation.
- Connection string credentials stored strictly in `DATABASE_URL` env variable.

# Verification Checklist
- [ ] Are migrations tracked in version control under `prisma/migrations/`?
- [ ] Does `prisma db seed` execute cleanly and idempotently?
- [ ] Are query selections explicitly omitting `passwordHash`?
- [ ] Is the Prisma client singleton configured properly for Next.js?
- [ ] Does the `docker-compose.yml` provide isolated PostgreSQL storage with persistent volume?
