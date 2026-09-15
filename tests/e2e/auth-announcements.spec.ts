import { test, expect } from "@playwright/test";

test.describe("TeamPulse End-to-End User Journey", () => {
  const demoEmail = "demo@teampulse.internal";
  const demoPassword = "Password123!";

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

    // 4. Verify seeded announcements are visible
    await expect(page.locator("text=Welcome to TeamPulse!")).toBeVisible();

    // 5. Create a new announcement
    await page.fill('input[name="title"]', uniqueTitle);
    await page.fill('textarea[name="body"]', uniqueBody);
    await page.click('button:has-text("Publish")');

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
  });
});
