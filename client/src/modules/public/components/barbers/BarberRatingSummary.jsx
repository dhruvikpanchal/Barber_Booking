import { Star } from "lucide-react";

/**
 * @param {{ rating: number, reviewCount: number, breakdown: Record<number, number> }} props
 */
export default function BarberRatingSummary({ rating, reviewCount, breakdown }) {
  const stars = [5, 4, 3, 2, 1];
  const total = Object.values(breakdown).reduce((s, n) => s + n, 0) || reviewCount;

  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
      <h2 className="font-serif text-base font-bold text-on-surface sm:text-lg">
        Ratings summary
      </h2>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex flex-col items-center justify-center rounded-xl border border-outline-variant bg-surface-container px-6 py-4 sm:min-w-[120px]">
          <p className="font-serif text-4xl font-bold text-on-surface">
            {rating.toFixed(1)}
          </p>
          <StarRow rating={Math.round(rating)} />
          <p className="mt-1 text-xs text-on-surface-variant">
            {reviewCount} reviews
          </p>
        </div>

        <ul className="min-w-0 flex-1 space-y-2">
          {stars.map((star) => {
            const count = breakdown[star] ?? 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <li key={star} className="flex items-center gap-2 text-xs">
                <span className="flex w-8 items-center gap-0.5 text-on-surface-variant">
                  {star}
                  <Star className="h-3 w-3 fill-primary text-primary" aria-hidden />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-2 rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-on-surface-variant">
                  {count}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function StarRow({ rating }) {
  return (
    <span className="mt-1 inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= rating ? "fill-primary text-primary" : "text-outline"}`}
          aria-hidden
        />
      ))}
    </span>
  );
}
