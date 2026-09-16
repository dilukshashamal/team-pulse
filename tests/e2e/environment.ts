export const E2E_BASE_URL = "http://localhost:3100";

// Fixed local test settings prevent a developer's DATABASE_URL from being used.
export const e2eEnvironment: Record<string, string> = {
  DATABASE_URL: "postgresql://teampulse_e2e:local_e2e_only@127.0.0.1:55432/teampulse_e2e?schema=public",
  AUTH_SECRET: "local-e2e-only-secret-not-for-deployment",
  AUTH_TRUST_HOST: "true",
  AUTH_URL: E2E_BASE_URL,
  NEXTAUTH_URL: E2E_BASE_URL,
};
