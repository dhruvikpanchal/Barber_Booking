import { User, Store } from "lucide-react";

const CONFIG = {
  barbers: {
    icon: User,
    heading: "No saved barbers yet",
    sub: "Save your favourite barbers for quick access and one-tap booking.",
    cta: "Explore Barbers",
    href: "/customer/book-appointment",
  },
  shops: {
    icon: Store,
    heading: "No saved shops yet",
    sub: "Save Iron & Oak locations you love so you can easily book your next visit.",
    cta: "Explore Shops",
    href: "/customer/book-appointment",
  },
};

export default function FavoritesEmpty({ tab }) {
  const cfg = CONFIG[tab] ?? CONFIG.barbers;
  const Icon = cfg.icon;

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {/* Icon container with subtle glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/20 bg-surface-container">
          <Icon className="h-9 w-9 text-primary/50" />
        </div>
      </div>

      <h3 className="font-serif text-2xl font-bold text-on-surface">
        {cfg.heading}
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-on-surface-variant">
        {cfg.sub}
      </p>

      <a
        href={cfg.href}
        className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-on-primary transition-all hover:opacity-90 active:scale-95"
      >
        {cfg.cta}
      </a>
    </div>
  );
}
