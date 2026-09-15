---
name: frontend-state
description: Use for React components, form handling, frontend local state, remote server state via SWR, UI states (loading, empty, error, success), accessibility, and responsive layouts.
---

# Goal
Provide structured guidance for clean, accessible, and performant UI components and state management in TeamPulse using native React hooks and SWR without unnecessary state library overhead.

# When to Use
- Implementing or modifying UI components (`components/**`).
- Building forms with validation feedback and submission lifecycles.
- Managing remote data fetching, caching, and cache revalidation via SWR.
- Styling components with Tailwind CSS for clean, responsive, SaaS-style presentation.
- Ensuring WCAG accessibility compliance across form controls and interactive elements.

# Engineering Standards
- **No Global Store Libraries**:
  - Do NOT introduce Redux, Zustand, MobX, or Jotai.
  - Rigorously separate **Local UI State** from **Remote Server State**:
    - **Local State** (`useState`): Form input fields (`title`, `body`), field errors, pending/submitting states.
    - **Server State** (`useSWR`): Remote announcements array, initial loading status, network error status, mutate/revalidate triggers.
- **Form Submission Lifecycle**:
  ```text
  User clicks "Publish"
        ↓
  Set isSubmitting = true, clear previous errors
        ↓
  POST /api/announcements
        ↓
  HTTP 201 Created received
        ↓
  Reset form fields (title = '', body = '')
        ↓
  Trigger SWR mutate() to revalidate announcements
        ↓
  New announcement renders immediately at top of list
        ↓
  Set isSubmitting = false
  ```
- **Component Architecture**:
  - `components/layout/app-header.tsx`: Top application navigation bar with branding and user session summary.
  - `components/layout/user-menu.tsx`: User greeting, email display, and accessible logout trigger.
  - `components/announcements/announcement-form.tsx`: Controlled announcement submission form with real-time feedback.
  - `components/announcements/announcement-list.tsx`: Container orchestrating loading, empty, error, and list views.
  - `components/announcements/announcement-card.tsx`: Individual announcement card showing title, body, author, and timestamp.
  - `components/ui/`: Atomic primitives (`button.tsx`, `input.tsx`, `textarea.tsx`, `form-error.tsx`, `empty-state.tsx`).
- **Accessibility Requirements**:
  - Every `<input>` and `<textarea>` must have an associated `<label>` element with matching `htmlFor`/`id`.
  - Display error messages linked via `aria-describedby` or visible inline error components.
  - All interactive buttons must have visible `:focus-visible` outlines and accessible names.
  - Disable form inputs and submit buttons while submission is in flight to prevent duplicate requests.
  - Follow logical heading hierarchy (`<h1>` for page title, `<h2>` for sections, `<h3>` for cards).

# Implementation Guidelines
1. **SWR Integration**:
   ```typescript
   // hooks/use-announcements.ts or components/announcements/announcement-list.tsx
   const fetcher = async (url: string) => {
     const res = await fetch(url);
     if (!res.ok) {
       const errorData = await res.json().catch(() => ({}));
       throw new Error(errorData?.error?.message || "Failed to fetch announcements");
     }
     const json = await res.json();
     return json.data;
   };

   export function useAnnouncements() {
     const { data, error, isLoading, mutate } = useSWR<AnnouncementItem[]>(
       "/api/announcements",
       fetcher,
       { revalidateOnFocus: true }
     );
     return { announcements: data ?? [], isLoading, error, mutate };
   }
   ```
2. **Design Language**:
   - Palette: Slate / Indigo / Neutral clean corporate SaaS aesthetic.
   - Typography: Clear hierarchy with `Inter` / system font stack.
   - Spacing: Consistent Tailwind scale (`p-4`, `p-6`, `gap-4`, `max-w-4xl`).

# Security / Quality Requirements
- Avoid hydration mismatch errors by formatting dates safely in client components or using ISO strings with hydration-safe formatting.
- Ensure XSS safety by never using `dangerouslySetInnerHTML`.
- Handle network dropouts gracefully with a retry button in the UI.

# Verification Checklist
- [ ] Are form inputs cleared and disabled while submission is pending?
- [ ] Does a new announcement immediately appear upon creation without a full page reload?
- [ ] Does the UI cleanly display loading skeletons, empty state, and error state with retry?
- [ ] Are form fields connected to explicit `<label>` elements?
- [ ] Does the layout adapt seamlessly between mobile and desktop screen sizes?
