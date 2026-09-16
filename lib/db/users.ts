import { prisma } from "@/lib/db/prisma";

interface CredentialUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
}

// This projection is only for server-side password verification, never API output.
export async function findUserForLogin(email: string): Promise<CredentialUser | null> {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, email: true, name: true, passwordHash: true },
  });
}
