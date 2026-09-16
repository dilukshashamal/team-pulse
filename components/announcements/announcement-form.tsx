"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/ui/form-error";
import { createAnnouncementSchema } from "@/lib/validation/announcement";

export interface AnnouncementFormProps {
  onSuccess: () => Promise<unknown> | void;
  titleRef: React.RefObject<HTMLInputElement>;
}

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  onSuccess,
  titleRef,
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    body?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
    <div className="page-enter rounded-[28px] bg-white p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">
          New announcement
        </h2>
        <p className="text-xs leading-5 text-slate-500 mt-1.5">
          Share an update with everyone in your organization.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={isSubmitting}>
        {formError && <FormError message={formError} />}

        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="announcement-title"
              className="block text-sm font-medium text-slate-700"
            >
              Title
            </label>
            <span id="title-count" className="text-xs tabular-nums text-slate-500">
              {title.length}/120
            </span>
          </div>
          <Input
            ref={titleRef}
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
            placeholder="Give your update a title"
            maxLength={120}
            error={!!fieldErrors.title}
            aria-describedby={fieldErrors.title ? "title-count title-error" : "title-count"}
          />
          {fieldErrors.title && (
            <p id="title-error" className="mt-1 text-xs text-rose-600">
              {fieldErrors.title}
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="announcement-body"
              className="block text-sm font-medium text-slate-700"
            >
              Message
            </label>
            <span id="body-count" className="text-xs tabular-nums text-slate-500">
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
            placeholder="What would you like the team to know?"
            maxLength={2000}
            rows={5}
            error={!!fieldErrors.body}
            aria-describedby={fieldErrors.body ? "body-count body-error" : "body-count"}
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
