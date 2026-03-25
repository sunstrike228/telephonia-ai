export default function VoiceLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-8 w-40 bg-white/5 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-white/5 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voice selection */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] p-6 h-[260px]">
          <div className="h-5 w-32 bg-white/5 rounded mb-4" />
          <div className="h-12 w-full bg-white/5 rounded-xl mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 w-full bg-white/5 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Language & personality */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] p-6 h-[260px]">
          <div className="h-5 w-28 bg-white/5 rounded mb-4" />
          <div className="h-12 w-full bg-white/5 rounded-xl mb-6" />
          <div className="h-5 w-28 bg-white/5 rounded mb-4" />
          <div className="h-12 w-full bg-white/5 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
