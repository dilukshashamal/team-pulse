---
name: documentation
description: Use when authoring or updating technical documentation, README.md, .env.example, setup guides, architecture diagrams, and architectural tradeoff analyses.
---

# Goal
Provide complete, developer-friendly, and architecturally sound documentation for TeamPulse, allowing any reviewer or engineer to understand, configure, run, and extend the system with zero guesswork.

# When to Use
- Authoring or modifying `README.md`.
- Updating environment variable specifications in `.env.example`.
- Documenting architectural choices, design tradeoffs, and rationale.
- Documenting database migrations, seeding procedures, and test credentials.
- Preparing project submission reports or walkthroughs.

# Engineering Standards
- **Clarity & Completeness**:
  - Provide copy-pasteable shell commands for setup, database startup, migration, seeding, testing, and running.
  - Document every required environment variable in `.env.example` with descriptions of purpose and safe defaults.
  - Include demo credentials clearly for evaluators.
- **Explain the "WHY"**:
  - Do not merely list technologies; explain the specific engineering rationale and tradeoffs for every major choice.
  - Must explicitly cover:
    1. **Why Announcements?**: Minimal, clean vertical slice proving end-to-end full-stack capabilities (auth, persistence, validation, state management) without scope creep.
    2. **Why No Public Registration?**: Reflects realistic internal corporate intranet architecture where identity is provisioned by organization/admin.
    3. **Why PostgreSQL?**: Relational integrity, ACID compliance, and foreign key cascades fit the relational User-Announcement relationship.
    4. **Why Prisma ORM?**: Type-safe queries, automated migrations, declarative schema, and seamless TypeScript DX.
    5. **Why No Redux / Zustand?**: Eliminates unnecessary boilerplate; React local state handles form inputs while SWR manages remote server cache and invalidation.
    6. **Why Route Handlers?**: Direct fulfillment of backend/API integration requirement, enabling decoupled REST endpoints with independent auth and validation.
- **Architectural Diagramming**:
  - Include clear Mermaid diagrams illustrating the user journey, authentication flow, and data flow.
- **Mandatory README Structure**:
  - `# TeamPulse`
  - `## Overview`
  - `## Features`
  - `## Tech Stack`
  - `## Architecture`
  - `## Project Structure`
  - `## Authentication`
  - `## API Design`
  - `## Database Model`
  - `## Getting Started`
  - `## Environment Variables`
  - `## Database Setup`
  - `## Database Migrations`
  - `## Seed Data`
  - `## Demo Credentials`
  - `## Running the Application`
  - `## Running Tests`
  - `## Design Decisions`
  - `## Security Considerations`
  - `## Tradeoffs`
  - `## Future Improvements`

# Implementation Guidelines
- Keep code snippets in documentation syntax-highlighted and aligned with the actual codebase.
- Maintain accurate directory trees matching the physical repository.
- Ensure future improvements are clearly separated from core requirements so they are never perceived as missing assessment requirements.

# Security / Quality Requirements
- NEVER include production secrets, live database passwords, or private keys in documentation.
- Clearly mark demo credentials as intended only for local development/assessment environments.

# Verification Checklist
- [ ] Does `README.md` contain all required sections in exact order?
- [ ] Are the 6 core architectural decisions (Announcements, No Registration, Postgres, Prisma, No Redux, Route Handlers) thoroughly explained?
- [ ] Can a clean clone be configured, migrated, seeded, and tested following the README instructions alone?
- [ ] Are demo credentials documented with exact login details?
- [ ] Does `.env.example` mirror all environment variables required by the runtime?
