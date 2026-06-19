import GoogleComplete from "@/client/modules/auth/pages/GoogleComplete.jsx";
import SearchParamsBoundary from "@/client/modules/shared/components/layout/SearchParamsBoundary.jsx";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

export const dynamic = "force-dynamic";

export default function GoogleCompletePage() {
  return (
    <SearchParamsBoundary
      fallback={<PageLoader fullScreen label="Completing Google sign-in..." />}
    >
      <GoogleComplete />
    </SearchParamsBoundary>
  );
}
