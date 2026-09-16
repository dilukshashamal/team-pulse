import { z } from "zod";

export const announcementSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  author: z.object({ id: z.string(), name: z.string() }),
});

export type AnnouncementResponse = z.infer<typeof announcementSchema>;
export const announcementResponseSchema = z.object({ data: announcementSchema });
export const announcementListResponseSchema = z.object({ data: z.array(announcementSchema) });
export const announcementErrorSchema = z.object({
  error: z.object({
    message: z.string(),
    details: z.object({
      title: z.array(z.string()).optional(),
      body: z.array(z.string()).optional(),
    }).optional(),
  }),
});
