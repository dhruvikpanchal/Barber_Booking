import { Star, TrendingUp, ThumbsUp, Award } from "lucide-react";
import { StarRow } from "./helpers.jsx";

export function ReviewStats({ reviews }) {
  const avg =
    reviews.length === 0
      ? 0
      : reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = reviews.length === 0 ? 0 : (count / reviews.length) * 100;
    return { star, count, pct };
  });

  const replied = reviews.filter((r) => r.reply).length;
  const totalHelpful = reviews.reduce((s, r) => s + r.helpful, 0);

  const topService = (() => {
    const freq = {};
    reviews.forEach((r) => {
      if (r.rating >= 4) freq[r.service] = (freq[r.service] ?? 0) + 1;
    });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : "—";
  })();

  return (
    <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
      {/* Overall score */}
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low px-8 py-6">
        <p className="font-label-caps text-on-surface-variant">Overall</p>
        <p className="font-serif text-6xl font-bold text-on-surface">
          {avg.toFixed(1)}
        </p>
        <StarRow rating={Math.round(avg)} size="lg" />
        <p className="text-sm text-on-surface-variant">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-4">
        {/* Rating distribution */}
        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
          <p className="font-label-caps mb-3 text-on-surface-variant">
            Rating Breakdown
          </p>
          <div className="space-y-2">
            {distribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="flex w-14 shrink-0 items-center gap-1 text-xs text-on-surface-variant">
                  <Star
                    className="h-3 w-3 fill-primary text-primary"
                    aria-hidden
                  />
                  {star}
                </span>
                <div className="flex-1 overflow-hidden rounded-full bg-surface-container-high h-2">
                  <div
                    className="h-2 rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-xs text-on-surface-variant">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: TrendingUp,
              label: "Reply Rate",
              value:
                reviews.length === 0
                  ? "—"
                  : `${Math.round((replied / reviews.length) * 100)}%`,
            },
            { icon: ThumbsUp, label: "Helpful Votes", value: totalHelpful },
            { icon: Award, label: "Top Service", value: topService },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low p-3 text-center"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="font-label-caps text-on-surface-variant">
                  {label}
                </p>
                <p className="font-serif text-base font-bold text-on-surface truncate">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
