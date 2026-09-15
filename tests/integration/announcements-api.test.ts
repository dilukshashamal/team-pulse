import { describe, it, expect, vi, beforeEach } from "vitest";
import { UnauthorizedError } from "@/lib/errors";

// Mock requireUser before importing route handler
vi.mock("@/lib/auth/require-user", () => ({
  requireUser: vi.fn(),
}));

// Mock announcements service
vi.mock("@/lib/announcements/service", () => ({
  getAnnouncements: vi.fn(),
  createAnnouncement: vi.fn(),
}));

import { GET, POST } from "@/app/api/announcements/route";
import { requireUser } from "@/lib/auth/require-user";
import {
  getAnnouncements,
  createAnnouncement,
  type AnnouncementItem,
} from "@/lib/announcements/service";

describe("Announcements API Route Handlers (/api/announcements)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/announcements", () => {
    it("should return 401 when unauthenticated", async () => {
      vi.mocked(requireUser).mockRejectedValueOnce(
        new UnauthorizedError("Authentication required")
      );

      const response = await GET();
      expect(response.status).toBe(401);

      const json = await response.json();
      expect(json.error.code).toBe("UNAUTHORIZED");
      expect(json.error.message).toBe("Authentication required");
    });

    it("should return 200 and announcements list when authenticated", async () => {
      vi.mocked(requireUser).mockResolvedValueOnce({
        id: "user-123",
        name: "Authenticated User",
        email: "user@example.com",
      });

      const mockAnnouncements: AnnouncementItem[] = [
        {
          id: "ann-1",
          title: "First Announcement",
          body: "Hello World",
          createdAt: new Date("2026-01-01T10:00:00Z"),
          updatedAt: new Date("2026-01-01T10:00:00Z"),
          author: { id: "user-123", name: "Authenticated User" },
        },
      ];

      vi.mocked(getAnnouncements).mockResolvedValueOnce(mockAnnouncements);

      const response = await GET();
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.data).toHaveLength(1);
      expect(json.data[0].title).toBe("First Announcement");
      expect(json.data[0].author.name).toBe("Authenticated User");
    });
  });

  describe("POST /api/announcements", () => {
    it("should return 401 when unauthenticated", async () => {
      vi.mocked(requireUser).mockRejectedValueOnce(
        new UnauthorizedError("Authentication required")
      );

      const req = new Request("http://localhost:3000/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Valid Title",
          body: "Valid message body",
        }),
      });

      const response = await POST(req);
      expect(response.status).toBe(401);

      const json = await response.json();
      expect(json.error.code).toBe("UNAUTHORIZED");
    });

    it("should return 400 when body contains invalid JSON", async () => {
      vi.mocked(requireUser).mockResolvedValueOnce({
        id: "user-123",
        name: "Test User",
      });

      const req = new Request("http://localhost:3000/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{ malformed json",
      });

      const response = await POST(req);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.error.message).toContain("Invalid JSON payload");
    });

    it("should return 400 when input validation fails (title too short)", async () => {
      vi.mocked(requireUser).mockResolvedValueOnce({
        id: "user-123",
        name: "Test User",
      });

      const req = new Request("http://localhost:3000/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "No", body: "Valid body text here" }),
      });

      const response = await POST(req);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.error.message).toBe("Validation failed.");
      expect(json.error.details.title).toBeDefined();
    });

    it("should derive author strictly from session and reject client authorId spoofing", async () => {
      const authenticatedUser = {
        id: "session-author-id-999",
        name: "Genuine Author",
      };

      vi.mocked(requireUser).mockResolvedValueOnce(authenticatedUser);

      vi.mocked(createAnnouncement).mockResolvedValueOnce({
        id: "new-ann-id",
        title: "Genuine Title",
        body: "Genuine Message Body",
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: authenticatedUser.id, name: authenticatedUser.name },
      });

      const req = new Request("http://localhost:3000/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Genuine Title",
          body: "Genuine Message Body",
          authorId: "spoofed-attacker-id",
        }),
      });

      const response = await POST(req);
      expect(response.status).toBe(201);

      // Verify that createAnnouncement was called with session author ID, NOT spoofed ID
      expect(createAnnouncement).toHaveBeenCalledWith(
        { title: "Genuine Title", body: "Genuine Message Body" },
        "session-author-id-999"
      );
    });
  });
});
