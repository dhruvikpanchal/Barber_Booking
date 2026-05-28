export default function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-xl border border-outline-variant bg-surface-container-low ${className}`}
    >
      <div className="border-b border-outline-variant px-5 py-4 md:px-6">
        <div className="flex items-start gap-3">
          {Icon ? (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
          ) : null}
          <div>
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
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}
