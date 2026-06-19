import { Loader2 } from "lucide-react";

const SPINNER_SIZE = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};

/** Theme-aligned spinning icon for buttons and inline use. */
export function InlineSpinner({ size = "md", className = "" }) {
  return (
    <Loader2
      className={`text-primary animate-spin ${SPINNER_SIZE[size] ?? SPINNER_SIZE.md} ${className}`}
      aria-hidden
    />
  );
}

/** Centered spinner + label — base building block for all loaders. */
export function LoadingIndicator({
  label = "Loading...",
  size = "lg",
  className = "",
  labelClassName = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <InlineSpinner size={size} aria-label={label || "Loading"} />
      {label ? (
        <p className={`text-on-surface-variant text-sm tracking-wide ${labelClassName}`}>{label}</p>
      ) : null}
    </div>
  );
}

/** Full-page or in-route loading state while React Query / auth resolves. */
export function PageLoader({
  label = "Loading...",
  fullScreen = false,
  className = "",
}) {
  return (
    <div
      className={`bg-background text-on-surface flex w-full items-center justify-center ${
        fullScreen ? "min-h-dvh" : "min-h-[50vh] py-16"
      } ${className}`}
    >
      <LoadingIndicator label={label} size="lg" />
    </div>
  );
}

/** Contained loader for tabs, modals, cards, and booking steps. */
export function SectionLoader({ label = "Loading...", className = "", minHeight = "min-h-48" }) {
  return (
    <div
      className={`border-outline-variant/40 flex w-full items-center justify-center rounded-xl border border-dashed py-12 ${minHeight} ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <LoadingIndicator label={label} size="md" />
    </div>
  );
}

/** Semi-transparent overlay for refetch / filter transitions when content stays mounted. */
export function LoadingOverlay({ label = "Loading...", className = "" }) {
  return (
    <div
      className={`bg-background/75 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px] ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <LoadingIndicator label={label} size="md" />
    </div>
  );
}

export default function Loader(props) {
  return <PageLoader fullScreen {...props} />;
}
