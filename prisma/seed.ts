import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("Seeding database...");

  const demoEmail = "demo@teampulse.internal";
  const demoPassword = "Password123!";
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(demoPassword, saltRounds);

  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      name: "Demo User",
      passwordHash,
    },
    create: {
      name: "Demo User",
      email: demoEmail,
      passwordHash,
    },
  });

  console.log(`Seeded user: ${demoUser.email} (id: ${demoUser.id})`);

  // Clear existing announcements for idempotent demo reset if desired, or upsert
  const existingCount = await prisma.announcement.count({
    where: { authorId: demoUser.id },
  });

  if (existingCount === 0) {
    const announcements = [
      {
        title: "Welcome to TeamPulse!",
        body: "Welcome to our internal announcements portal. Here you can find updates from leadership and across teams. Feel free to publish your first announcement using the form above.",
        authorId: demoUser.id,
      },
      {
        title: "Q3 Engineering All-Hands Scheduled",
        body: "Our quarterly engineering all-hands meeting will be held this Thursday at 2:00 PM UTC. We will review our product roadmap, architecture milestones, and celebrate key team achievements.",
        authorId: demoUser.id,
      },
      {
        title: "Platform Maintenance Window: Sunday 02:00 UTC",
        body: "Scheduled database maintenance and infrastructure upgrades are planned for this upcoming Sunday between 02:00 and 03:00 UTC. Zero downtime is expected, but background jobs may experience brief pauses.",
        authorId: demoUser.id,
      },
    ];

    for (const item of announcements) {
      const created = await prisma.announcement.create({
        data: item,
      });
      console.log(`Seeded announcement: "${created.title}"`);
    }
  } else {
    console.log(`Existing announcements found (${existingCount}), skipping announcement seed.`);
  }

  console.log("Seeding finished successfully.");
}

async function runSeed(): Promise<void> {
  try {
    await main();
  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void runSeed();
