import { auth } from "@/auth";
import { UnauthorizedError } from "@/lib/errors";

export interface AuthenticatedUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

/**
 * Reusable server-side guard that returns the authenticated user or throws UnauthorizedError.
 * Ensures consistent authentication enforcement across Route Handlers and Server Actions.
 */
export async function requireUser(): Promise<AuthenticatedUser> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new UnauthorizedError("Authentication required");
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };
}
