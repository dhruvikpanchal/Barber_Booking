import { INPUT_CLASS } from "@/constants/barber/barber.js";

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
