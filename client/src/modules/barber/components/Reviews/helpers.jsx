import { Star } from "lucide-react";

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function StarRow({
  rating,
  size = "sm",
  interactive = false,
  onChange,
}) {
  const sizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${sizes[size]} transition-colors ${
            n <= rating
              ? "fill-primary text-primary"
              : "fill-transparent text-outline"
          } ${interactive ? "cursor-pointer hover:fill-primary hover:text-primary" : ""}`}
          aria-hidden
          onClick={interactive && onChange ? () => onChange(n) : undefined}
        />
      ))}
    </span>
  );
}
