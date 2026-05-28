export default function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  id,
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-xl border border-outline-variant bg-surface-container-low"
    >
      <div className="border-b border-outline-variant px-4 py-4 sm:px-6">
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
