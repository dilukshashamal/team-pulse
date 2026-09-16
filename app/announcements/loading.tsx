import { AnnouncementSkeleton } from "@/components/announcements/announcement-skeleton";

export default function AnnouncementsLoading(): React.ReactElement {
  return (
    <div>
      <div className="mb-10 space-y-4 motion-safe:animate-pulse" aria-hidden="true">
        <div className="h-3 w-32 rounded bg-stone-200" />
        <div className="h-10 w-64 max-w-full rounded bg-stone-200" />
        <div className="h-4 w-80 max-w-full rounded bg-stone-100" />
      </div>
      <div className="announcement-surface"><AnnouncementSkeleton /></div>
    </div>
  );
}
