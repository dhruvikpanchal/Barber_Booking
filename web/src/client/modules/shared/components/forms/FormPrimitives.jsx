export const INPUT_CLASS =
  "h-10 w-full rounded-md border border-outline-variant bg-surface-container px-3 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none";

/**
 * @param {{ label: string, children: import("react").ReactNode, hint?: string, error?: string, required?: boolean }} props
 */
export function Field({ label, children, hint, error, required }) {
  return (
    <label className="block space-y-1.5">
      <span className="font-label-caps text-on-surface-variant flex items-center gap-1">
        {label}
        {required ? <span className="text-primary">*</span> : null}
      </span>
      {children}
      {error ? (
        <span className="block text-xs font-medium text-status-cancelled">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-on-surface-variant">{hint}</span>
      ) : null}
    </label>
  );
}

export function IconInput({ icon: Icon, className = "", ...props }) {
  return (
    <div className="relative">
      <Icon
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
        aria-hidden
      />
      <input {...props} className={`${INPUT_CLASS} pl-9 ${className}`} />
    </div>
  );
}

export { default as SectionCard } from "@/client/modules/shared/components/ui/SectionCard";

export function IconTextarea({ icon: Icon, rows = 3, className = "", ...props }) {
  return (
    <div className="relative">
      {Icon ? (
        <Icon
          className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-on-surface-variant"
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
