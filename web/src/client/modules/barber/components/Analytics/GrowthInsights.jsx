import { Lightbulb, TrendingDown, TrendingUp } from "lucide-react";

/**
 * @param {{ insights: Array<{ title: string, body: string, trend: number }> }} props
 */
export default function GrowthInsights({ insights = [] }) {
  return (
    <section className="min-w-0 rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
      <header className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Lightbulb className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-serif text-base font-bold text-on-surface sm:text-lg">
            Performance insights
          </h2>
          <p className="text-xs text-on-surface-variant">
            Growth trends and highlights for the selected period
          </p>
        </div>
      </header>
      <ul className="space-y-3">
        {insights.length === 0 ? (
          <li className="text-on-surface-variant rounded-lg border border-dashed border-outline-variant px-3.5 py-4 text-center text-sm">
            Insights will appear once you have bookings and reviews in this period.
          </li>
        ) : (
          insights.map((item) => {
          const positive = item.trend >= 0;
          return (
            <li
              key={item.title}
              className="rounded-lg border border-outline-variant bg-surface-container px-3.5 py-3 sm:px-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-on-surface">
                  {item.title}
                </p>
                {item.trend !== 0 ? (
                  <span
                    className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      positive
                        ? "bg-status-confirmed/15 text-status-confirmed"
                        : "bg-status-cancelled/15 text-status-cancelled"
                    }`}
                  >
                    {positive ? (
                      <TrendingUp className="h-3 w-3" aria-hidden />
                    ) : (
                      <TrendingDown className="h-3 w-3" aria-hidden />
                    )}
                    {positive ? "+" : ""}
                    {item.trend}%
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                {item.body}
              </p>
            </li>
          );
        })
        )}
      </ul>
    </section>
  );
}
