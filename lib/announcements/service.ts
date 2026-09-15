import { prisma } from "@/lib/db/prisma";
import type { CreateAnnouncementInput } from "@/lib/validation/announcement";

export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
  };
}

/**
 * Retrieves announcements ordered newest first with minimal author information.
 */
export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  return prisma.announcement.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

/**
 * Creates a new announcement bound to the authenticated author.
 */
export async function createAnnouncement(
  input: CreateAnnouncementInput,
  authorId: string
): Promise<AnnouncementItem> {
  return prisma.announcement.create({
    data: {
      title: input.title,
      body: input.body,
      authorId,
    },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
