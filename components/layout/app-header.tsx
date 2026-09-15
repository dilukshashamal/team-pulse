import React from "react";
import Link from "next/link";
import { UserMenu } from "./user-menu";

export interface AppHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export const AppHeader: React.FC<AppHeaderProps> = ({ user }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/announcements"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md py-1 px-1.5 -ml-1.5"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-indigo-700 transition-colors">
            TP
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-900 tracking-tight">
              TeamPulse
            </span>
            <span className="hidden md:inline-block text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              Announcements
            </span>
          </div>
        </Link>

        <UserMenu user={user} />
      </div>
    </header>
  );
};
