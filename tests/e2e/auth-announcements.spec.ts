import { test, expect } from "@playwright/test";
import { announcementListResponseSchema } from "../../lib/announcements/contracts";

test.describe("TeamPulse End-to-End User Journey", () => {
  const demoEmail = "demo@teampulse.internal";
  const demoPassword = "Password123!";

  test("API rejects unauthenticated reads and writes", async ({ request }) => {
    expect((await request.get("/api/announcements")).status()).toBe(401);
    expect((await request.post("/api/announcements", {
      data: { title: "Unauthorized post", body: "Must not be saved" },
    })).status()).toBe(401);
  });

  test("unauthenticated user is redirected to /login", async ({ page }) => {
    await page.goto("/announcements");
    await expect(page).toHaveURL(/.*\/login/);
  });

  test("invalid credentials show error message", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "wrong@teampulse.internal");
    await page.fill('input[name="password"]', "WrongPassword999!");
    await page.click('button[type="submit"]');

    const errorMessage = page
      .getByRole("alert")
      .filter({ hasText: "Invalid email or password" });
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Invalid email or password");
  });

  test("complete lifecycle: login -> view -> create -> refresh -> logout -> guard", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const uniqueTitle = `Automated Broadcast ${timestamp}`;
    const uniqueBody = `Automated lifecycle verification message payload ${timestamp}.`;

    // 1. Visit login page
    await page.goto("/login");

    // 2. Submit valid demo credentials
    await page.fill('input[name="email"]', demoEmail);
    await page.fill('input[name="password"]', demoPassword);
    await page.click('button[type="submit"]');

    // 3. Confirm redirection to /announcements
    await expect(page).toHaveURL(/.*\/announcements/, { timeout: 10000 });
    await expect(page.locator("h1")).toContainText("Announcements");

    // Existing content can change; verify the real API records instead of a seed title.
    const response = await page.request.get("/api/announcements");
    expect(response.status()).toBe(200);
    const payload: unknown = await response.json();
    const { data: existing } = announcementListResponseSchema.parse(payload);
    const timestamps = existing.map((item) => Date.parse(item.createdAt));
    expect(timestamps).toEqual([...timestamps].sort((a, b) => b - a));
    if (existing.length > 0) {
      await expect(page.getByRole("heading", { name: existing[0].title, exact: true }).first()).toBeVisible();
    } else {
      await expect(page.getByText("A fresh start.")).toBeVisible();
    }

    // 5. Create a new announcement
    await page.getByRole("button", { name: "New announcement", exact: true }).click();
    await page.fill('input[name="title"]', uniqueTitle);
    await page.fill('textarea[name="body"]', uniqueBody);
    await page.click('button:has-text("Publish")');
    await expect(page.getByRole("status")).toContainText("Announcement published.");
    await expect(page.getByRole("button", { name: "New announcement", exact: true }))
      .toHaveAttribute("aria-expanded", "false");

    // 6. Verify new announcement immediately appears in feed
    await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`text=${uniqueBody}`)).toBeVisible();

    // 7. Refresh page and verify persistence
    await page.reload();
    await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible();

    // 8. Log out
    await page.click('button:has-text("Log out")');

    // 9. Verify redirected to login
    await expect(page).toHaveURL(/.*\/login/);

    // 10. Verify protected route is inaccessible after logout
    await page.goto("/announcements");
    await expect(page).toHaveURL(/.*\/login/);
    expect((await page.request.get("/api/announcements")).status()).toBe(401);
  });

  test("expired session during publishing offers a working sign-in action", async ({ page, context }) => {
    await page.goto("/login");
    await page.getByLabel("Work email").fill(demoEmail);
    await page.getByLabel("Password", { exact: true }).fill(demoPassword);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page).toHaveURL(/\/announcements$/);
    await page.getByRole("button", { name: "New announcement", exact: true }).click();
    await page.getByLabel("Title", { exact: true }).fill("Expired session update");
    await page.getByLabel("Message", { exact: true }).fill("This must not be published.");
    await context.clearCookies();
    await page.getByRole("button", { name: "Publish", exact: true }).click();
    await expect(page.getByRole("main").getByRole("alert")).toContainText("Your session has expired");
    await page.getByRole("link", { name: "Sign in again" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
  });
});
