import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

export function SkeletonLoader({ label = "Loading analytics...", className = "mx-auto max-w-7xl" }) {
  return <PageLoader label={label} className={className} />;
}
