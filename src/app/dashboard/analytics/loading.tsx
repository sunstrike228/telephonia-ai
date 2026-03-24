export default function AnalyticsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-8 w-32 bg-white/5 rounded-lg mb-2" />
        <div className="h-4 w-72 bg-white/5 rounded-lg" />
      </div>

      {/* Channel cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 h-[180px]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-white/5 rounded-xl" />
              <div className="h-5 w-24 bg-white/5 rounded" />
            </div>
            <div className="h-8 w-16 bg-white/5 rounded mb-3" />
            <div className="h-3 w-32 bg-white/5 rounded mb-2" />
            <div className="h-3 w-24 bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 h-[300px] mb-6">
        <div className="h-5 w-40 bg-white/5 rounded mb-6" />
        <div className="h-[220px] w-full bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}
