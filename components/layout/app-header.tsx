import React from "react";
import Link from "next/link";
import { UserMenu } from "./user-menu";
import { Brand } from "./brand";

export interface AppHeaderProps {
  user: { name?: string | null; email?: string | null };
}

export const AppHeader: React.FC<AppHeaderProps> = ({ user }) => (
  <header className="workspace-header">
    <div className="workspace-navigation">
      <Link href="/announcements" aria-label="TeamPulse announcements" className="shrink-0 rounded py-2"><Brand /></Link>
      <nav aria-label="Main navigation" className="ml-auto hidden lg:block">
        <Link href="/announcements" aria-current="page" className="border-b border-neutral-900 pb-2 text-sm font-medium text-neutral-900">Announcements</Link>
      </nav>
      <UserMenu user={user} />
    </div>
  </header>
);
