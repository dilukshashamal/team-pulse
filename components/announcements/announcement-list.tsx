"use client";

import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { SessionExpired } from "@/components/auth/session-expired";
import { AnnouncementCard } from "./announcement-card";
import { AnnouncementForm } from "./announcement-form";
import { AnnouncementSkeleton } from "./announcement-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { announcementListResponseSchema, type AnnouncementResponse } from "@/lib/announcements/contracts";

class SessionExpiredError extends Error {}

const fetcher = async (url: string): Promise<AnnouncementResponse[]> => {
  const res = await fetch(url);
  if (res.status === 401) throw new SessionExpiredError("Session expired");
  if (!res.ok) throw new Error("Failed to load announcements.");
  const json: unknown = await res.json();
  return announcementListResponseSchema.parse(json).data;
};

export const AnnouncementList: React.FC = () => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [publishSessionExpired, setPublishSessionExpired] = useState(false);
  const composerButton = useRef<HTMLButtonElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const { data: announcements, error, isLoading, mutate } = useSWR<AnnouncementResponse[], Error>(
    publishSessionExpired ? null : "/api/announcements", fetcher, {
      revalidateOnFocus: true,
      shouldRetryOnError: (fetchError: Error) => !(fetchError instanceof SessionExpiredError),
    }
  );
  const sessionExpired = publishSessionExpired || error instanceof SessionExpiredError;

  useEffect(() => {
    if (!successMessage) return;
    const timeoutId = window.setTimeout(() => setSuccessMessage(""), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const handlePublished = async (announcement: AnnouncementResponse): Promise<void> => {
    // The POST response confirms persistence even if a subsequent GET is unavailable.
    await mutate((current = []) => [announcement, ...current.filter((item) => item.id !== announcement.id)], { revalidate: false });
    setIsComposerOpen(false);
    setSuccessMessage("Announcement published. Your update is shared with the team.");
    composerButton.current?.focus();
  };

  if (sessionExpired) return <SessionExpired />;

  return (
    <div className="page-enter">
      <div className="workspace-heading">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">The team journal</p>
          <h1 className="text-[30px] font-semibold tracking-[-0.045em] text-neutral-950 sm:text-[40px]">Announcements</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-500">The latest news and updates, all in one place.</p>
        </div>
        <Button
          ref={composerButton}
          type="button"
          aria-expanded={isComposerOpen}
          aria-controls="announcement-composer"
          onClick={() => {
            const nextOpenState = !isComposerOpen;
            setSuccessMessage("");
            setIsComposerOpen(nextOpenState);
            if (nextOpenState) requestAnimationFrame(() => titleInput.current?.focus());
          }}
          className="shrink-0"
        >
          <span aria-hidden="true" className="text-lg leading-none">+</span>
          {isComposerOpen ? "Close form" : "New announcement"}
        </Button>
      </div>

      {successMessage && (
        <div className="success-toast page-enter" role="status" aria-live="polite" aria-atomic="true">
          <span className="success-icon" aria-hidden="true">✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        <div id="announcement-composer" hidden={!isComposerOpen} className="page-enter">
          <AnnouncementForm
            onSuccess={handlePublished}
            onSessionExpired={() => setPublishSessionExpired(true)}
            titleRef={titleInput}
          />
        </div>
        <section aria-labelledby="feed-heading" className="min-w-0">
          <div className="announcement-toolbar">
            <div className="flex items-center gap-3 rounded-full bg-neutral-950 px-5 py-3 text-white">
              <h2 id="feed-heading" className="text-sm font-medium">All updates</h2>
              {announcements && <span className="text-xs tabular-nums text-white/70">{announcements.length}</span>}
            </div>
            <span className="text-xs text-neutral-500">Newest first</span>
          </div>
          <div className="announcement-surface">
            {isLoading && <AnnouncementSkeleton />}
            {!isLoading && error && (
              <div role="alert" className="border-b border-slate-200 py-8">
                <h3 className="mb-2 text-base font-semibold text-slate-900">Unable to load updates</h3>
                <p className="mb-4 text-sm leading-6 text-slate-600">
                  {announcements?.length ? "Showing previously loaded updates. Try again to get the latest." : "Please check your connection and try again."}
                </p>
                <Button variant="secondary" onClick={async () => { await mutate(); }}>Try again</Button>
              </div>
            )}
            {!isLoading && !error && announcements?.length === 0 && (
              <EmptyState title="A fresh start." description="No announcements yet. Use New announcement to share the first update with your team." />
            )}
            {announcements && announcements.length > 0 && (
              <div className="announcement-grid">
                {announcements.map((item) => <AnnouncementCard key={item.id} announcement={item} />)}
                {!error && <p className="col-span-full border-t border-neutral-100 pt-8 text-center text-xs text-neutral-500">End of updates</p>}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
