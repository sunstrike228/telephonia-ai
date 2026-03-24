export default function CallsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-8 w-32 bg-white/5 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-white/5 rounded-lg" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] overflow-hidden">
        <div className="border-b border-white/8 px-6 py-3 flex gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-20 bg-white/5 rounded" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-b border-white/5 px-6 py-4 flex gap-6">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-4 w-20 bg-white/5 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
