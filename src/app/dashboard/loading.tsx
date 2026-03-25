export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-white/5 rounded-lg mb-2" />
        <div className="h-4 w-80 bg-white/5 rounded-lg" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] p-5 h-[100px]"
          >
            <div className="h-4 w-24 bg-white/5 rounded mb-3" />
            <div className="h-7 w-16 bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] p-6 h-[140px]"
          >
            <div className="h-10 w-10 bg-white/5 rounded-xl mb-4" />
            <div className="h-4 w-32 bg-white/5 rounded mb-2" />
            <div className="h-3 w-48 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
