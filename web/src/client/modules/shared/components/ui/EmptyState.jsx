export default function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-20 text-center ${className}`.trim()}
    >
      {Icon ? (
        <div className="border-outline-variant bg-surface-container mb-4 flex h-14 w-14 items-center justify-center rounded-full border">
          <Icon className="text-on-surface-variant h-6 w-6" aria-hidden />
        </div>
      ) : null}
      {title ? (
        <p className="text-on-surface font-serif text-lg font-bold sm:text-base sm:font-semibold sm:font-sans">
          {title}
        </p>
      ) : null}
      {message ? (
        <p className="text-on-surface-variant mt-1.5 max-w-xs text-sm sm:text-xs">{message}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
