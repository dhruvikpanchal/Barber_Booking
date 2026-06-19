import { Star, TrendingUp, ThumbsUp } from "lucide-react";
import { StarRow } from "@/client/modules/shared/components/ui/StarRow.jsx";

export function ReviewStats({ breakdown, replySummary }) {
  const total = breakdown?.total ?? 0;
  const avg = breakdown?.average ?? 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = breakdown?.[String(star)] ?? 0;
    const pct = total === 0 ? 0 : (count / total) * 100;
    return { star, count, pct };
  });

  const replied = replySummary?.replied ?? 0;
  const replyRate = total === 0 ? 0 : Math.round((replied / total) * 100);

  return (
    <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
      <div className="border-outline-variant bg-surface-container-low flex flex-col items-center justify-center gap-3 rounded-xl border px-8 py-6">
        <p className="font-label-caps text-on-surface-variant">Overall</p>
        <p className="text-on-surface font-serif text-6xl font-bold">{avg.toFixed(1)}</p>
        <StarRow rating={Math.round(avg)} size="lg" />
        <p className="text-on-surface-variant text-sm">
          {total} review{total !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-outline-variant bg-surface-container-low rounded-xl border p-5">
          <p className="font-label-caps text-on-surface-variant mb-3">Rating Breakdown</p>
          <div className="space-y-2">
            {distribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-on-surface-variant flex w-14 shrink-0 items-center gap-1 text-xs">
                  <Star className="fill-primary text-primary h-3 w-3" aria-hidden />
                  {star}
                </span>
                <div className="bg-surface-container-high h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-on-surface-variant w-8 shrink-0 text-right text-xs">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: TrendingUp,
              label: "Reply Rate",
              value: total === 0 ? "—" : `${replyRate}%`,
            },
            {
              icon: ThumbsUp,
              label: "Awaiting Reply",
              value: replySummary?.unreplied ?? 0,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="border-outline-variant bg-surface-container-low flex flex-col items-center gap-2 rounded-xl border p-3 text-center"
            >
              <span className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="font-label-caps text-on-surface-variant">{label}</p>
                <p className="text-on-surface truncate font-serif text-base font-bold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
