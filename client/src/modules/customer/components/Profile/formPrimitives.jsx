export const INPUT_CLASS =
  "h-10 w-full rounded-md border border-outline-variant bg-surface-container px-3 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none";

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="font-label-caps mb-1.5 block text-on-surface-variant">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1 block text-xs text-on-surface-variant">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low shadow-sm">
      <div className="border-b border-outline-variant bg-surface-container-low px-4 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          {Icon ? (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className="font-serif text-lg font-bold text-on-surface">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-on-surface-variant">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

export function IconInput({ icon: Icon, className = "", ...props }) {
  return (
    <div className="relative">
      <Icon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
        aria-hidden
      />
      <input {...props} className={`${INPUT_CLASS} pl-9 ${className}`} />
    </div>
  );
}

export function IconTextarea({ icon: Icon, rows = 3, className = "", ...props }) {
  return (
    <div className="relative">
      {Icon ? (
        <Icon
          className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-on-surface-variant"
          aria-hidden
        />
      ) : null}
      <textarea
        rows={rows}
        {...props}
        className={`w-full resize-y rounded-md border border-outline-variant bg-surface-container py-2.5 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none ${Icon ? "pl-9 pr-3" : "px-3"} ${className}`}
      />
    </div>
  );
}
