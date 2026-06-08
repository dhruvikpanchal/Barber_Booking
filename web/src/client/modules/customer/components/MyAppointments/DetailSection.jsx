export default function DetailSection({ title, subtitle, icon: Icon, children }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
      <header className="flex items-center gap-3 border-b border-outline-variant px-4 py-3.5 sm:px-5 sm:py-4">
        {Icon ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="font-serif text-base font-bold text-on-surface sm:text-lg">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-xs text-on-surface-variant">{subtitle}</p>
          ) : null}
        </div>
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}
