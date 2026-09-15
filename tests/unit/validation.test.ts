import { describe, it, expect } from "vitest";
import { createAnnouncementSchema } from "@/lib/validation/announcement";
import { loginSchema } from "@/lib/validation/auth";

describe("Announcement Validation Schema (createAnnouncementSchema)", () => {
  it("should accept valid announcement payload", () => {
    const valid = {
      title: "Sprint Review Tomorrow",
      body: "All team members are invited to join the sprint review meeting.",
    };

    const result = createAnnouncementSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe(valid.title);
      expect(result.data.body).toBe(valid.body);
    }
  });

  it("should trim excess whitespace from title and body", () => {
    const padded = {
      title: "   Release 2.4.0 is live   ",
      body: "   The release has been successfully deployed.   ",
    };

    const result = createAnnouncementSchema.safeParse(padded);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Release 2.4.0 is live");
      expect(result.data.body).toBe("The release has been successfully deployed.");
    }
  });

  it("should reject title shorter than 3 characters", () => {
    const result = createAnnouncementSchema.safeParse({
      title: "Hi",
      body: "This body is long enough.",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toBeDefined();
    }
  });

  it("should reject title exceeding 120 characters", () => {
    const result = createAnnouncementSchema.safeParse({
      title: "A".repeat(121),
      body: "This body is long enough.",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toBeDefined();
    }
  });

  it("should reject body shorter than 3 characters", () => {
    const result = createAnnouncementSchema.safeParse({
      title: "Valid Title",
      body: "No",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.body).toBeDefined();
    }
  });

  it("should reject body exceeding 2000 characters", () => {
    const result = createAnnouncementSchema.safeParse({
      title: "Valid Title",
      body: "B".repeat(2001),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.body).toBeDefined();
    }
  });
});

describe("Auth Validation Schema (loginSchema)", () => {
  it("should accept valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "engineer@company.internal",
      password: "SuperSecretPassword123!",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("engineer@company.internal");
    }
  });

  it("should reject invalid email formats", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("should reject empty password", () => {
    const result = loginSchema.safeParse({
      email: "engineer@company.internal",
      password: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });
});
