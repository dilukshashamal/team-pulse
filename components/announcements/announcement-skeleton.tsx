import type { ReactElement } from "react";

export function AnnouncementSkeleton(): ReactElement {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading announcements...</span>
      <div className="announcement-grid motion-safe:animate-pulse" aria-hidden="true">
        {[1, 2, 3].map((item) => (
          <div key={item} className="space-y-4">
            <div className="aspect-[16/9] rounded-2xl bg-neutral-100" />
            <div className="h-3 w-36 rounded bg-neutral-100" />
            <div className="h-6 w-5/6 rounded bg-neutral-200" />
            <div className="h-3 w-full rounded bg-neutral-100" />
            <div className="h-3 w-5/6 rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
