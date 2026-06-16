import dynamic from "next/dynamic";
import PageSkeleton from "@/client/modules/shared/components/ui/PageSkeleton.jsx";

export function loadBarberPage(importFn, options = {}) {
  return dynamic(importFn, {
    loading: () => <PageSkeleton tiles={options.tiles ?? 4} />,
    ...options,
  });
}
