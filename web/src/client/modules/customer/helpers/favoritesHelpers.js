export function formatLastVisited(iso) {
  if (!iso) return "Never visited";
  const d = new Date(iso);
  const diffDays = Math.round((Date.now() - d) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.round(diffDays / 30)}mo ago`;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
