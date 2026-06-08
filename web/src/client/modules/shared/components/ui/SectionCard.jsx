export default function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  className = "",
  id,
}) {
  const sectionClass = [
    "rounded-xl border border-outline-variant bg-surface-container-low",
    id ? "scroll-mt-24" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} className={sectionClass}>
      <header className="border-b border-outline-variant px-4 py-4 sm:px-5 md:px-6">
        {Icon ? (
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="font-serif text-base font-bold text-on-surface md:text-lg">
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-base font-bold text-on-surface md:text-lg">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
            ) : null}
          </>
        )}
      </header>
      <div className="p-4 sm:p-5 md:p-6">{children}</div>
    </section>
  );
}
