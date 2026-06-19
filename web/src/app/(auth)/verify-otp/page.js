import VerifyResetOtp from "@/client/modules/auth/pages/VerifyResetOtp.jsx";
import SearchParamsBoundary from "@/client/modules/shared/components/layout/SearchParamsBoundary.jsx";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

export default function VerifyOtpPage() {
  return (
    <div className="bg-background min-h-screen">
      <SearchParamsBoundary fallback={<PageLoader fullScreen label="Loading..." />}>
        <VerifyResetOtp />
      </SearchParamsBoundary>
    </div>
  );
}
