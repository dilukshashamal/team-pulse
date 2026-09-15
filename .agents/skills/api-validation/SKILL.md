---
name: api-validation
description: Use for API Route Handlers, request schema validation, response formatting, HTTP status codes, Zod schemas, and API security.
---

# Goal
Provide consistent, safe, and strictly validated HTTP API interfaces for TeamPulse using Zod schemas and standard REST conventions.

# When to Use
- Implementing or modifying Next.js API Route Handlers (`app/api/**/route.ts`).
- Creating or updating Zod validation schemas (`lib/validation/**`).
- Designing API contracts, error payloads, and JSON response bodies.
- Parsing incoming request bodies, query strings, or route parameters.
- Ensuring author identity cannot be spoofed or overridden by client requests.

# Engineering Standards
- **Zod Runtime Validation**:
  - All incoming request bodies and search parameters must be parsed and validated with Zod before processing.
  - Trim strings automatically during schema parsing.
- **Announcement Validation Rules**:
  ```typescript
  export const createAnnouncementSchema = z.object({
    title: z
      .string({ required_error: "Title is required" })
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(120, "Title cannot exceed 120 characters"),
    body: z
      .string({ required_error: "Message body is required" })
      .trim()
      .min(3, "Message must be at least 3 characters")
      .max(2000, "Message cannot exceed 2000 characters"),
  });
  ```
- **Author Identity Integrity**:
  - Never accept `authorId` or `userId` in POST payloads.
  - Always derive the author identity strictly from the authenticated server-side session (`session.user.id`).
- **Standardized API Response Envelopes**:
  - Success Envelope: `{ data: T }`
  - Error Envelope: `{ error: { message: string, code?: string, details?: unknown } }`
- **Predictable HTTP Status Codes**:
  - `200 OK`: Successful data retrieval (`GET /api/announcements`).
  - `201 Created`: Successful creation (`POST /api/announcements`).
  - `400 Bad Request`: Validation failure or unparseable JSON.
  - `401 Unauthorized`: Missing or invalid authentication token/session.
  - `500 Internal Server Error`: Unexpected runtime failure (never leaking stack traces or internal DB info).

# Implementation Guidelines
1. **Safe Request Parsing**:
   ```typescript
   export async function parseJsonBody(req: Request): Promise<unknown> {
     try {
       return await req.json();
     } catch {
       throw new BadRequestError("Invalid JSON payload");
     }
   }
   ```
2. **Thin Route Handler Coordination**:
   ```typescript
   // app/api/announcements/route.ts
   export async function GET() {
     const user = await requireUser();
     const announcements = await getAnnouncements();
     return NextResponse.json({ data: announcements }, { status: 200 });
   }

   export async function POST(req: Request) {
     const user = await requireUser();
     const body = await parseJsonBody(req);
     const validated = createAnnouncementSchema.safeParse(body);
     
     if (!validated.success) {
       return NextResponse.json(
         {
           error: {
             message: "Validation failed",
             details: validated.error.flatten().fieldErrors,
           },
         },
         { status: 400 }
       );
     }

     const announcement = await createAnnouncement(validated.data, user.id);
     return NextResponse.json({ data: announcement }, { status: 201 });
   }
   ```

# Security / Quality Requirements
- Reject unexpected properties where applicable (`.strict()`).
- Never echo sensitive internal system paths or database query errors to clients.
- Sanitized strings prevent stored XSS (coupled with React's native JSX escaping).

# Verification Checklist
- [ ] Does `POST /api/announcements` reject missing or out-of-range title (<3 or >120)?
- [ ] Does `POST /api/announcements` reject missing or out-of-range body (<3 or >2000)?
- [ ] Is `authorId` stripped or ignored if passed in the request body?
- [ ] Does `GET /api/announcements` return items sorted newest first?
- [ ] Are error responses uniformly shaped with an `error` key?
