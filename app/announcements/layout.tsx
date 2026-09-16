import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppHeader } from "@/components/layout/app-header";

export const dynamic = "force-dynamic";

export default async function AnnouncementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="announcement-workspace min-h-svh flex flex-col">
      <AppHeader user={session.user} />
      <main id="main-content" className="workspace-main">
        {children}
      </main>
    </div>
  );
}
