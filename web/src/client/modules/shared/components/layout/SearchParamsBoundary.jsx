import { Suspense } from "react";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

/**
 * Wraps client components that call useSearchParams() so Next.js can prerender safely.
 */
export default function SearchParamsBoundary({
  children,
  fallback = <PageLoader fullScreen label="Loading..." />,
}) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
