export default function JobsLoading() {
  return (
    <div className="pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-container mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-40 bg-black/[0.06] rounded-lg animate-pulse" />
          <div className="h-4 w-56 bg-black/[0.04] rounded-lg animate-pulse mt-2" />
        </div>
        {/* Kanban columns skeleton */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, col) => (
            <div key={col} className="flex-shrink-0 w-72 rounded-2xl border border-black/[0.08] bg-black/[0.02] p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-black/[0.08] animate-pulse" />
                <div className="h-4 w-24 bg-black/[0.06] rounded animate-pulse" />
                <div className="h-5 w-6 bg-black/[0.04] rounded-full animate-pulse ml-auto" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: col === 0 ? 3 : col === 1 ? 2 : 1 }).map((_, card) => (
                  <div key={card} className="rounded-xl border border-black/[0.06] bg-white p-4 space-y-3">
                    <div className="h-4 w-3/4 bg-black/[0.06] rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-black/[0.04] rounded animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-5 w-14 bg-black/[0.04] rounded-full animate-pulse" />
                      <div className="h-5 w-14 bg-black/[0.04] rounded-full animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
