import dynamic from "next/dynamic";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

export function loadBarberPage(importFn, options = {}) {
  return dynamic(importFn, {
    loading: () => (
      <PageLoader label="Loading..." className="mx-auto w-full max-w-6xl min-w-0" />
    ),
    ...options,
  });
}
