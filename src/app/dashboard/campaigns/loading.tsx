export default function CampaignsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-8 w-36 bg-white/5 rounded-lg mb-2" />
          <div className="h-4 w-64 bg-white/5 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-white/5 rounded-xl" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 h-[120px]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 w-48 bg-white/5 rounded" />
              <div className="h-6 w-20 bg-white/5 rounded-full" />
            </div>
            <div className="flex gap-4">
              <div className="h-4 w-24 bg-white/5 rounded" />
              <div className="h-4 w-24 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
