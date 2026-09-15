export default function AnnouncementsLoading() {
  return (
    <div className="space-y-8 animate-pulse" aria-busy="true">
      {/* Header skeleton */}
      <div>
        <div className="h-8 bg-slate-200 rounded w-48 mb-2" />
        <div className="h-4 bg-slate-100 rounded w-80" />
      </div>

      {/* Form skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="h-5 bg-slate-200 rounded w-40" />
        <div className="h-10 bg-slate-100 rounded w-full" />
        <div className="h-28 bg-slate-100 rounded w-full" />
        <div className="flex justify-end">
          <div className="h-10 bg-slate-200 rounded w-24" />
        </div>
      </div>

      {/* List skeleton */}
      <div className="space-y-4">
        <div className="h-5 bg-slate-200 rounded w-36" />
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-6 rounded-xl border border-slate-200 bg-white space-y-3"
          >
            <div className="h-5 bg-slate-200 rounded w-1/3" />
            <div className="h-4 bg-slate-100 rounded w-full" />
            <div className="h-4 bg-slate-100 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
