export default function PageSkeleton({ tiles = 4 }) {
  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 space-y-6 pb-4 sm:space-y-8">
      <div className="bg-surface-container h-24 animate-pulse rounded-xl" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: tiles }, (_, i) => (
          <div key={i} className="bg-surface-container h-24 animate-pulse rounded-xl" />
        ))}
      </div>
      <div className="bg-surface-container h-64 animate-pulse rounded-xl" />
    </div>
  );
}
