export default function LeadsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-8 w-24 bg-white/5 rounded-lg mb-2" />
          <div className="h-4 w-56 bg-white/5 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-28 bg-white/5 rounded-xl" />
          <div className="h-10 w-28 bg-white/5 rounded-xl" />
        </div>
      </div>

      {/* Search bar skeleton */}
      <div className="h-10 w-full max-w-md bg-white/5 rounded-xl mb-4" />

      {/* Table skeleton */}
      <div className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-b border-white/5 px-6 py-4 flex gap-6">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-4 w-24 bg-white/5 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
