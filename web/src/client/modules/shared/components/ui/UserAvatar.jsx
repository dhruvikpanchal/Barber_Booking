import { User } from "lucide-react";

const SIZES = {
  sm: { container: "h-8 w-8", icon: "h-4 w-4" },
  md: { container: "h-10 w-10", icon: "h-5 w-5" },
};

/**
 * @param {{ photoUrl?: string | null, name?: string, size?: "sm" | "md", className?: string }} props
 */
export function UserAvatar({ photoUrl, name = "User", size = "sm", className = "" }) {
  const { container, icon } = SIZES[size] ?? SIZES.sm;
  const hasPhoto = typeof photoUrl === "string" && photoUrl.trim().length > 0;

  return (
    <span
      className={`${container} flex shrink-0 items-center justify-center overflow-hidden rounded-full ${
        hasPhoto ? "bg-surface-container-high" : "bg-primary/15"
      } ${className}`}
    >
      {hasPhoto ? (
        <img key={photoUrl} src={photoUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <User className={`${icon} text-primary`} aria-hidden />
      )}
    </span>
  );
}
