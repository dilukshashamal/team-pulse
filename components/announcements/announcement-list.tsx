"use client";

import React from "react";
import useSWR from "swr";
import { AnnouncementCard } from "./announcement-card";
import { AnnouncementForm } from "./announcement-form";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { AnnouncementItem } from "@/lib/announcements/service";

const fetcher = async (url: string): Promise<AnnouncementItem[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || "Failed to load announcements."
    );
  }
  const json = await res.json();
  return json.data;
};

export const AnnouncementList: React.FC = () => {
  const {
    data: announcements,
    error,
    isLoading,
    mutate,
  } = useSWR<AnnouncementItem[]>("/api/announcements", fetcher, {
    revalidateOnFocus: true,
  });

  return (
    <div>
      {/* Create Announcement Section */}
      <AnnouncementForm onSuccess={() => mutate()} />

      {/* Announcements Feed Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Recent Announcements
          </h2>
          {announcements && announcements.length > 0 && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {announcements.length} {announcements.length === 1 ? "update" : "updates"}
            </span>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4" aria-live="polite" aria-busy="true">
            <p className="sr-only">Loading announcements...</p>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm animate-pulse"
              >
                <div className="h-5 bg-slate-200 rounded w-1/3 mb-4" />
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <div className="h-4 bg-slate-200 rounded w-24" />
                  <div className="h-4 bg-slate-100 rounded w-32" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="text-center py-12 px-4 rounded-xl border border-rose-200 bg-rose-50/50">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-3">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              We couldn’t load announcements.
            </h3>
            <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
              There was a problem retrieving updates from the server.
            </p>
            <Button
              variant="secondary"
              onClick={() => mutate()}
              className="text-xs h-9 px-4"
            >
              Try again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!announcements || announcements.length === 0) && (
          <EmptyState
            title="No announcements yet."
            description="Be the first person to share an update with the team."
          />
        )}

        {/* Success List */}
        {!isLoading && !error && announcements && announcements.length > 0 && (
          <div className="space-y-4">
            {announcements.map((item) => (
              <AnnouncementCard key={item.id} announcement={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
