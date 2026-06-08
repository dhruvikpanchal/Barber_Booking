import { MessageSquare, Reply } from "lucide-react";
import { formatShortDate } from "@/client/lib/format/formatDateTime.js";

/**
 * @param {{ items: Array<{ id: string, type: string, at: string, title: string, body: string }> }} props
 */
export default function ReviewHistory({ items = [] }) {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-low">
      <header className="border-b border-outline-variant px-4 py-3.5 sm:px-5">
        <h2 className="font-serif text-base font-bold text-on-surface sm:text-lg">
          Review & reply history
        </h2>
      </header>
      <ol className="divide-y divide-outline-variant">
        {items.map((item) => {
          const Icon = item.type === "reply" ? Reply : MessageSquare;
          const accent =
            item.type === "reply"
              ? "bg-primary/15 text-primary"
              : "bg-surface-container-high text-on-surface-variant";

          return (
            <li key={item.id} className="flex gap-3 px-4 py-4 sm:px-5">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent}`}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-on-surface">
                    {item.title}
                  </p>
                  <time
                    dateTime={item.at}
                    className="text-[11px] text-on-surface-variant"
                  >
                    {formatShortDate(item.at)}
                  </time>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                  {item.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
