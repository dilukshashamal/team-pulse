"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/ui/form-error";
import { createAnnouncementSchema } from "@/lib/validation/announcement";

export interface AnnouncementFormProps {
  onSuccess: () => Promise<unknown> | void;
}

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    body?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    // Client-side validation check
    const validation = createAnnouncementSchema.safeParse({ title, body });
    if (!validation.success) {
      const flattened = validation.error.flatten().fieldErrors;
      setFieldErrors({
        title: flattened.title?.[0],
        body: flattened.body?.[0],
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      const responseData = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 400 && responseData?.error?.details) {
          const details = responseData.error.details;
          setFieldErrors({
            title: details.title?.[0],
            body: details.body?.[0],
          });
          setFormError(responseData.error.message || "Please fix the validation errors.");
        } else {
          setFormError(
            responseData?.error?.message ||
              "Unable to publish announcement. Please try again."
          );
        }
        setIsSubmitting(false);
        return;
      }

      // Success: clear fields and trigger revalidation
      setTitle("");
      setBody("");
      setFieldErrors({});
      await onSuccess();
    } catch (err) {
      console.error("Announcement creation unexpected error:", err);
      setFormError("Unable to publish announcement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">
          Create Announcement
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Share important updates, releases, or news with the entire team.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && <FormError message={formError} />}

        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="announcement-title"
              className="block text-sm font-medium text-slate-700"
            >
              Title
            </label>
            <span className="text-xs text-slate-400">
              {title.length}/120
            </span>
          </div>
          <Input
            id="announcement-title"
            name="title"
            required
            disabled={isSubmitting}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (fieldErrors.title) {
                setFieldErrors((prev) => ({ ...prev, title: undefined }));
              }
            }}
            placeholder="e.g., Engineering All-Hands Rescheduled"
            maxLength={120}
            error={!!fieldErrors.title}
            aria-describedby={fieldErrors.title ? "title-error" : undefined}
          />
          {fieldErrors.title && (
            <p id="title-error" className="mt-1 text-xs text-rose-600">
              {fieldErrors.title}
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="announcement-body"
              className="block text-sm font-medium text-slate-700"
            >
              Message
            </label>
            <span className="text-xs text-slate-400">
              {body.length}/2000
            </span>
          </div>
          <Textarea
            id="announcement-body"
            name="body"
            required
            disabled={isSubmitting}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              if (fieldErrors.body) {
                setFieldErrors((prev) => ({ ...prev, body: undefined }));
              }
            }}
            placeholder="Write the full update here..."
            maxLength={2000}
            rows={4}
            error={!!fieldErrors.body}
            aria-describedby={fieldErrors.body ? "body-error" : undefined}
          />
          {fieldErrors.body && (
            <p id="body-error" className="mt-1 text-xs text-rose-600">
              {fieldErrors.body}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting || title.trim().length === 0 || body.trim().length === 0}
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </form>
    </div>
  );
};
