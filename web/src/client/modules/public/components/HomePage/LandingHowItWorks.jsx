const steps = [
  { n: "01", t: "Pick your shop", d: "Browse multi-shop locations and find the chair closest to you." },
  { n: "02", t: "Choose your barber", d: "See ratings, specialties and live availability — book the cut you want." },
  { n: "03", t: "Show up. Get sharp.", d: "Track your queue position. Pay in person at the shop, no online checkout." },
];

export default function LandingHowItWorks() {
  return (
    <section className="border-y border-outline-variant bg-surface-container-low px-4 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="font-label-caps mb-3 text-primary">How it works</div>
        <h2 className="font-serif text-4xl font-bold text-on-surface md:text-5xl">Three steps. One sharp cut.</h2>
        <div className="mt-14 grid gap-px bg-outline-variant md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="bg-surface-container-low p-8">
              <div className="font-serif text-5xl font-bold text-primary">{s.n}</div>
              <div className="font-serif mt-4 text-xl font-semibold text-on-surface">{s.t}</div>
              <p className="mt-3 text-sm text-on-surface-variant">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
