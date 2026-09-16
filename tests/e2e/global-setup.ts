import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { e2eEnvironment } from "./environment";

const run = promisify(execFile);
const composeArgs = ["compose", "-p", "teampulse-e2e", "-f", "docker-compose.e2e.yml"];

async function removeTestDatabase(): Promise<void> {
  await run("docker", [...composeArgs, "down", "--volumes"], { timeout: 60000 });
}

export default async function globalSetup(): Promise<() => Promise<void>> {
  try {
    // Start each run with a fresh, disposable database, including after interrupted runs.
    await removeTestDatabase();
    await run("docker", [...composeArgs, "up", "-d", "--wait"], { timeout: 120000 });
    const options = { env: { ...process.env, ...e2eEnvironment }, timeout: 60000 };
    await run(process.execPath, ["node_modules/prisma/build/index.js", "migrate", "deploy"], options);
    await run(process.execPath, ["--import", "tsx", "prisma/seed.ts"], options);
  } catch (error) {
    try {
      await removeTestDatabase();
    } catch (cleanupError) {
      console.error("Unable to remove the E2E database container:", cleanupError);
    }
    throw error;
  }

  return removeTestDatabase;
}
