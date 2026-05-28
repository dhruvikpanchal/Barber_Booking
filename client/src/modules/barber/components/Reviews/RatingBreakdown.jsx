import { Star } from "lucide-react";
import { CATEGORY_LABELS } from "@/data/barber/reviewsData.js";
import { StarRow } from "./helpers.jsx";

/**
 * @param {{ overall: number, categories: Record<string, number> }} props
 */
export default function RatingBreakdown({ overall, categories }) {
  const entries = Object.entries(categories ?? {});

  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-low">
      <header className="border-b border-outline-variant px-4 py-3.5 sm:px-5">
        <h2 className="font-serif text-base font-bold text-on-surface sm:text-lg">
          Rating breakdown
        </h2>
      </header>

      <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,140px)_1fr] sm:items-center sm:px-5 sm:py-5">
        <div className="flex flex-col items-center justify-center rounded-xl border border-outline-variant bg-surface-container px-4 py-5 text-center">
          <p className="font-label-caps text-on-surface-variant">Overall</p>
          <p className="mt-1 font-serif text-4xl font-bold text-on-surface">
            {overall.toFixed(1)}
          </p>
          <StarRow rating={overall} size="md" />
          <p className="mt-2 text-xs text-on-surface-variant">out of 5</p>
        </div>

        <ul className="space-y-3">
          {entries.map(([key, value]) => {
            const pct = (value / 5) * 100;
            return (
              <li key={key}>
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <span className="text-on-surface">
                    {CATEGORY_LABELS[key] ?? key}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-on-surface">
                    <Star
                      className="h-3.5 w-3.5 fill-primary text-primary"
                      aria-hidden
                    />
                    {value}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-2 rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
