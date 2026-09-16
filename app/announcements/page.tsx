import { AnnouncementList } from "@/components/announcements/announcement-list";

export const metadata = {
  title: "Announcements - TeamPulse",
  description: "Company-wide announcements and team updates.",
};

export const dynamic = "force-dynamic";

export default function AnnouncementsPage(): React.ReactElement {
  return <AnnouncementList />;
}
