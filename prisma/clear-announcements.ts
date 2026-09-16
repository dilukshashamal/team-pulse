import { prisma } from "@/lib/db/prisma";

const CONFIRMATION_FLAG = "--confirm";

async function clearAnnouncements(): Promise<void> {
  if (!process.argv.includes(CONFIRMATION_FLAG)) {
    console.error(
      `This will permanently delete every announcement. Re-run with ${CONFIRMATION_FLAG} to continue.`
    );
    process.exitCode = 1;
    return;
  }

  try {
    const result = await prisma.announcement.deleteMany();
    console.log(`Deleted ${result.count} announcement${result.count === 1 ? "" : "s"}.`);
  } catch (error) {
    console.error("Failed to delete announcements:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void clearAnnouncements();
