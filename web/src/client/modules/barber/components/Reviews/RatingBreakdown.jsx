import { Star } from "lucide-react";
import { CATEGORY_LABELS } from "@/modules/barber/data/reviewsData.js";
import { StarRow } from "@/client/modules/shared/components/ui/StarRow.jsx";

/**
 * @param {{ overall: number, categories: Record<string, number> }} props
 */
export default function RatingBreakdown({ overall, categories }) {
  const entries = Object.entries(categories ?? {});

  return (
    <section className="border-outline-variant bg-surface-container-low rounded-xl border">
      <header className="border-outline-variant border-b px-4 py-3.5 sm:px-5">
        <h2 className="text-on-surface font-serif text-base font-bold sm:text-lg">
          Rating breakdown
        </h2>
      </header>

      <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,140px)_1fr] sm:items-center sm:px-5 sm:py-5">
        <div className="border-outline-variant bg-surface-container flex flex-col items-center justify-center rounded-xl border px-4 py-5 text-center">
          <p className="font-label-caps text-on-surface-variant">Overall</p>
          <p className="text-on-surface mt-1 font-serif text-4xl font-bold">{overall.toFixed(1)}</p>
          <StarRow rating={overall} size="md" />
          <p className="text-on-surface-variant mt-2 text-xs">out of 5</p>
        </div>

        <ul className="space-y-3">
          {entries.map(([key, value]) => {
            const pct = (value / 5) * 100;
            return (
              <li key={key}>
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <span className="text-on-surface">{CATEGORY_LABELS[key] ?? key}</span>
                  <span className="text-on-surface inline-flex items-center gap-1 font-semibold">
                    <Star className="fill-primary text-primary h-3.5 w-3.5" aria-hidden />
                    {value}
                  </span>
                </div>
                <div className="bg-surface-container-high h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
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
