import { PageLoader } from "./Loader.jsx";

/** @deprecated Prefer PageLoader — kept for dynamic import compatibility. */
export default function PageSkeleton({ label = "Loading..." }) {
  return <PageLoader label={label} className="mx-auto w-full max-w-6xl min-w-0" />;
}
