import type { ReactElement } from "react";

export function Brand(): ReactElement {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="brand-mark flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 12h4l3-7 4 14 3-7h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="brand-wordmark text-xl font-semibold tracking-[-0.045em] text-slate-900">TeamPulse<span className="brand-dot text-indigo-600">.</span></span>
    </span>
  );
}
