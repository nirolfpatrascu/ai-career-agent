export default function DashboardLoading() {
  return (
    <div className="pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-container mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-black/[0.06] rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-black/[0.04] rounded-lg animate-pulse mt-2" />
        </div>
        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-black/[0.08] bg-white p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/[0.06] animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-black/[0.06] rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-black/[0.04] rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-black/[0.04] rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-black/[0.04] rounded animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-black/[0.04] rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-black/[0.04] rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
