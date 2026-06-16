import { Star } from "lucide-react";
import { reviews } from "@/client/modules/public/constants/reviewsConstants.js";

export default function LandingTestimonials() {
  return (
    <section className="px-4 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="font-label-caps text-primary mb-3">Word on the street</div>
        <h2 className="text-on-surface font-serif text-4xl font-bold md:text-5xl">
          Trusted by regulars.
        </h2>
        <div className="bg-outline-variant mt-14 grid gap-px md:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-surface-container p-8">
              <div className="flex gap-1" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="fill-primary text-primary h-4 w-4" aria-hidden />
                ))}
              </div>
              <p className="text-on-surface mt-5">&ldquo;{r.text}&rdquo;</p>
              <div className="border-outline-variant text-on-surface-variant mt-6 flex items-center justify-between border-t pt-4 text-xs">
                <span className="font-label-caps text-on-surface">{r.name}</span>
                <span>{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
