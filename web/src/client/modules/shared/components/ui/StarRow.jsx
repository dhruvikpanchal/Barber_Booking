import { Star } from "lucide-react";

const SIZE_CLASS = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-6 w-6",
};

/**
 * @param {{
 *   rating: number,
 *   size?: "xs" | "sm" | "md" | "lg",
 *   variant?: "primary" | "yellow",
 *   interactive?: boolean,
 *   onChange?: (rating: number) => void,
 *   className?: string,
 * }} props
 */
export function StarRow({
  rating,
  size = "sm",
  variant = "primary",
  interactive = false,
  onChange,
  className = "",
}) {
  const starClass = SIZE_CLASS[size] ?? SIZE_CLASS.sm;
  const filledClass =
    variant === "yellow"
      ? "fill-yellow-400 text-yellow-400"
      : "fill-primary text-primary";
  const emptyClass =
    variant === "yellow" ? "text-outline-variant" : "fill-transparent text-outline";

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${starClass} transition-colors ${
            n <= Math.round(rating) ? filledClass : emptyClass
          } ${interactive ? "cursor-pointer hover:fill-primary hover:text-primary" : ""}`}
          aria-hidden={!interactive}
          onClick={interactive && onChange ? () => onChange(n) : undefined}
        />
      ))}
    </span>
  );
}
