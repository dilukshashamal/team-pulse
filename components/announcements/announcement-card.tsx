"use client";

import React, { useId, useState } from "react";
import type { AnnouncementResponse } from "@/lib/announcements/contracts";
import { AnnouncementCover } from "./announcement-cover";

export interface AnnouncementCardProps { announcement: AnnouncementResponse }

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
});
const EXCERPT_LENGTH = 220;

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const bodyId = useId();
  const hasMore = announcement.body.length > EXCERPT_LENGTH;
  const visibleBody = hasMore && !isExpanded ? `${announcement.body.slice(0, EXCERPT_LENGTH).trimEnd()}…` : announcement.body;

  return (
    <article className="announcement-article">
      <AnnouncementCover seed={announcement.id} />
      <div className="mb-3 mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-5 text-neutral-500">
        <span className="break-words font-medium text-neutral-700 [overflow-wrap:anywhere]">{announcement.author.name}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={new Date(announcement.createdAt).toISOString()} title={new Date(announcement.createdAt).toUTCString()}>
          {dateFormatter.format(new Date(announcement.createdAt))}
        </time>
      </div>
      <h3 className="mb-3 text-xl font-bold leading-[1.45] tracking-[-0.035em] text-neutral-950 [overflow-wrap:anywhere]">{announcement.title}</h3>
      <p id={bodyId} className="whitespace-pre-wrap text-[15px] leading-7 text-neutral-600 [overflow-wrap:anywhere]">{visibleBody}</p>
      {hasMore && (
        <button type="button" className="read-announcement" aria-expanded={isExpanded} aria-controls={bodyId} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Show less" : "Read full announcement"}
          <span aria-hidden="true" className={isExpanded ? "rotate-[-90deg]" : ""}>↗</span>
        </button>
      )}
    </article>
  );
};
