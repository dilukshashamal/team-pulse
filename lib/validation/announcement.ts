import { z } from "zod";

export const createAnnouncementSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title cannot exceed 120 characters"),
  body: z
    .string({ required_error: "Message body is required" })
    .trim()
    .min(3, "Message must be at least 3 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
