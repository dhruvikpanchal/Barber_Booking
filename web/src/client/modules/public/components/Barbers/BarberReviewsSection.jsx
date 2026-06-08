import { StarRow } from "@/client/modules/shared/components/ui/StarRow.jsx";

/**
 * @param {{ reviews: Array<{ id: string, name: string, rating: number, text: string, date: string, service?: string }> }} props
 */
export default function BarberReviewsSection({ reviews }) {
  return (
    <section
      id="reviews"
      className="scroll-mt-28 rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-6"
    >
      <header className="mb-4">
        <h2 className="font-serif text-lg font-bold text-on-surface">
          Customer reviews
        </h2>
        <p className="mt-0.5 text-xs text-on-surface-variant">
          What clients are saying
        </p>
      </header>

      <ul className="space-y-4">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="rounded-xl border border-outline-variant bg-surface-container p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-on-surface">{review.name}</p>
                {review.service ? (
                  <p className="text-xs text-on-surface-variant">
                    {review.service}
                  </p>
                ) : null}
              </div>
              <div className="text-right">
                <StarRow rating={review.rating} />
                <p className="mt-0.5 text-[11px] text-on-surface-variant">
                  {review.date}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              &ldquo;{review.text}&rdquo;
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

