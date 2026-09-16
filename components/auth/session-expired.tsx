import React from "react";

export function SessionExpired(): React.ReactElement {
  return (
    <div role="alert" className="space-y-3 py-6">
      <p className="text-sm text-slate-700">Your session has expired. Sign in again to continue.</p>
      <a href="/login" className="inline-block rounded text-sm font-medium text-indigo-600 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
        Sign in again
      </a>
    </div>
  );
}
