"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  const displayName = user.name || "Team Member";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center justify-center border border-indigo-200 select-none"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900 leading-tight">
            {displayName}
          </p>
          {user.email && (
            <p className="text-xs text-slate-500 leading-tight">{user.email}</p>
          )}
        </div>
      </div>

      <Button
        variant="secondary"
        onClick={handleLogout}
        isLoading={isLoggingOut}
        aria-label="Log out of TeamPulse"
        className="text-xs h-9 px-3"
      >
        {isLoggingOut ? "Logging out..." : "Log out"}
      </Button>
    </div>
  );
};
