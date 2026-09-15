import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { createAnnouncementSchema } from "@/lib/validation/announcement";
import { getAnnouncements, createAnnouncement } from "@/lib/announcements/service";
import { AppError, UnauthorizedError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireUser();
    const announcements = await getAnnouncements();
    return NextResponse.json({ data: announcements }, { status: 200 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { error: { message: error.message, code: error.code } },
        { status: 401 }
      );
    }

    console.error("GET /api/announcements unexpected error:", error);
    return NextResponse.json(
      { error: { message: "An unexpected error occurred while fetching announcements." } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { error: { message: "Invalid JSON payload in request body." } },
        { status: 400 }
      );
    }

    const parseResult = createAnnouncementSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: {
            message: "Validation failed.",
            details: parseResult.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const announcement = await createAnnouncement(parseResult.data, user.id);
    return NextResponse.json({ data: announcement }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { error: { message: error.message, code: error.code } },
        { status: 401 }
      );
    }

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { message: error.message, code: error.code, details: error.details } },
        { status: error.statusCode }
      );
    }

    console.error("POST /api/announcements unexpected error:", error);
    return NextResponse.json(
      { error: { message: "An unexpected error occurred while creating announcement." } },
      { status: 500 }
    );
  }
}
