import { AnnouncementList } from "@/components/announcements/announcement-list";

export const metadata = {
  title: "Announcements — TeamPulse",
  description: "Company-wide announcements and team updates.",
};

export const dynamic = "force-dynamic";

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Announcements
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Stay updated with company-wide news, milestones, and important broadcasts.
        </p>
      </div>

      <AnnouncementList />
    </div>
  );
}
