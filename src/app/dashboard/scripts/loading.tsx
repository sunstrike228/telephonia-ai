export default function ScriptsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-8 w-28 bg-white/5 rounded-lg mb-2" />
          <div className="h-4 w-64 bg-white/5 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-white/5 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 h-[160px]"
          >
            <div className="h-5 w-40 bg-white/5 rounded mb-3" />
            <div className="h-3 w-full bg-white/5 rounded mb-2" />
            <div className="h-3 w-3/4 bg-white/5 rounded mb-2" />
            <div className="h-3 w-1/2 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
