export function SkeletonLoader() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl border border-outline-variant/30 bg-surface-container-low/40 p-4"
          />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-60 rounded-xl border border-outline-variant/30 bg-surface-container-low/40" />
        <div className="h-60 rounded-xl border border-outline-variant/30 bg-surface-container-low/40" />
        <div className="h-60 rounded-xl border border-outline-variant/30 bg-surface-container-low/40" />
        <div className="h-60 rounded-xl border border-outline-variant/30 bg-surface-container-low/40" />
      </div>

      {/* Insights Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl border border-outline-variant/30 bg-surface-container-low/40"
          />
        ))}
      </div>
    </div>
  );
}
