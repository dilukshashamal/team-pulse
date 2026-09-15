import React from "react";
import type { AnnouncementItem } from "@/lib/announcements/service";

export interface AnnouncementCardProps {
  announcement: AnnouncementItem;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
}) => {
  // Safe date formatting using standard Intl.DateTimeFormat
  const formattedDate = new Date(announcement.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );

  const authorInitials =
    announcement.author.name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "A";

  return (
    <article className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight leading-snug">
          {announcement.title}
        </h3>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mb-5">
        {announcement.body}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px] flex items-center justify-center border border-slate-200"
            aria-hidden="true"
          >
            {authorInitials}
          </div>
          <span className="font-medium text-slate-700">
            {announcement.author.name}
          </span>
        </div>

        <time
          dateTime={new Date(announcement.createdAt).toISOString()}
          className="text-slate-400"
        >
          {formattedDate}
        </time>
      </div>
    </article>
  );
};
