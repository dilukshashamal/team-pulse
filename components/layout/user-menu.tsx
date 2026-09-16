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
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("Unable to log out. Please try again.");
      setIsLoggingOut(false);
    }
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
    <div className="flex min-w-0 items-center gap-2 sm:gap-5">
      {logoutError && <p role="alert" className="text-xs text-rose-600">{logoutError}</p>}
      <div className="hidden sm:flex min-w-0 items-center gap-3">
        <div
          className="w-9 h-9 shrink-0 rounded-full bg-stone-200/70 text-slate-600 font-semibold text-xs flex items-center justify-center select-none"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="min-w-0 max-w-56">
          <p className="truncate text-sm font-medium text-slate-800 leading-5">
            {displayName}
          </p>
          {user.email && (
            <p className="truncate text-xs text-slate-500 leading-5">{user.email}</p>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={handleLogout}
        isLoading={isLoggingOut}
        aria-label="Log out of TeamPulse"
        className="shrink-0"
      >
        {isLoggingOut ? "Logging out..." : "Log out"}
      </Button>
    </div>
  );
};
