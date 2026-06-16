import { HOW_IT_WORKS_STEPS } from "@/client/modules/public/constants/howItWorksStepsConstants.js";

export default function LandingHowItWorks() {
  return (
    <section className="border-outline-variant bg-surface-container-low border-y px-4 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="font-label-caps text-primary mb-3">How it works</div>
        <h2 className="text-on-surface font-serif text-4xl font-bold md:text-5xl">
          Three steps. One sharp cut.
        </h2>
        <div className="bg-outline-variant mt-14 grid gap-px md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((s) => (
            <div key={s.n} className="bg-surface-container-low p-8">
              <div className="text-primary font-serif text-5xl font-bold">{s.n}</div>
              <div className="text-on-surface mt-4 font-serif text-xl font-semibold">{s.t}</div>
              <p className="text-on-surface-variant mt-3 text-sm">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
