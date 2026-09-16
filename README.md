# TeamPulse

A small internal announcements portal built with Next.js App Router, TypeScript,
Auth.js, PostgreSQL, Prisma, Zod, Tailwind CSS, and SWR. Team members can log in,
publish plain-text announcements, read the newest updates, and log out.

## Setup

Prerequisites: Node.js 22, npm, and Docker with Docker Compose.

```bash
npm ci
cp .env.example .env
```

In PowerShell, use `Copy-Item .env.example .env` instead of `cp`.
Edit `.env`: set `POSTGRES_PASSWORD`, put the same password in `DATABASE_URL`
(URL-encode special characters), and replace `AUTH_SECRET` with a random secret:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

The remaining defaults configure the local database and app at `http://localhost:3000`.
See [.env.example](.env.example) for all variables.

```bash
docker compose up -d
npm run prisma:generate
npx prisma migrate deploy
npm run prisma:seed
npm run dev
```

Open [localhost:3000](http://localhost:3000). Log in with
**demo@teampulse.internal / Password123!**. These credentials and the seed script
are for local assessment only; do not seed this account in a deployed environment.

For a production build locally:

```bash
npm run build
npm run start
```

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Browser tests require Docker, a production build, and Playwright Chromium:

```bash
npx playwright install chromium
npm run build
npm run test:e2e
```

E2E tests start a separate app on port **3100** and a disposable PostgreSQL
container on **55432**. Both ports must be free. The test configuration overrides
local database/auth settings and never reuses the development server. Setup
applies migrations and seeds the test database; teardown removes the container
and its temporary data. The tests cover authentication, API protection, publishing,
persistence after refresh, and logout.

If a run is interrupted, remove its container with:

```bash
docker compose -p teampulse-e2e -f docker-compose.e2e.yml down --volumes
```

The next run also cleans up any leftover test container before starting.

## Key decisions

- **One announcements section:** demonstrates the complete create/read flow while
  keeping scope small. No editing, deletion, comments, or public registration;
  accounts are provisioned by the organization or seeded locally.
- **Next.js Route Handlers:** provide independently testable HTTP boundaries.
  Handlers authenticate and validate requests, then call dedicated data services.
- **Auth.js credentials and JWT sessions:** use bcrypt password verification and
  HTTP-only cookies. Middleware and the portal layout protect pages; every
  announcements API handler independently checks the session. Authors come from
  that session, never the request body. Expired sessions show a sign-in action.
- **PostgreSQL with Prisma:** preserves the user/announcement relationship through
  foreign keys and supplies typed queries and versioned migrations. Docker adds
  a setup step but makes local persistence reproducible.
- **React state plus SWR:** form inputs stay local; SWR manages the feed. A
  successful POST inserts the returned item into the cache immediately. Focus
  revalidation refreshes it later. A global state library would add little value.
- **Shared Zod schemas:** validate input on both client and server and validate
  API responses in the browser. Unexpected server errors are logged and returned
  as safe messages.

The feed deliberately returns all announcements for this small assessment.
JWT sessions avoid a session table but do not provide immediate server-side
revocation. Deployment hardening, such as login rate limits and trusted proxy
configuration, is outside this local assessment.

See [the architecture and API reference](docs/ARCHITECTURE.md) for module
boundaries, the database model, and endpoint contracts.
