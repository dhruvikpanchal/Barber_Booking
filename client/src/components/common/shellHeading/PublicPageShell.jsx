export default function PublicPageShell({ title, eyebrow, children }) {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-10 pt-10">
      {eyebrow ? (
        <p className="font-label-caps mb-3 text-primary">{eyebrow}</p>
      ) : null}
      <h1 className="font-serif text-3xl font-bold text-on-surface md:text-4xl">
        {title}
      </h1>
      <div className="mt-8 text-on-surface-variant">{children}</div>
    </main>
  );
}
