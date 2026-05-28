export default function ShellHeading({ eyebrow, title, description }) {
  return (
    <header className="mb-8 space-y-2">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      ) : null}
    </header>
  );
}
