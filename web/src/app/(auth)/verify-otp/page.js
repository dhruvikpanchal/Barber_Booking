import { Suspense } from "react";
import VerifyResetOtp from "@/client/modules/auth/pages/VerifyResetOtp.jsx";

export default function VerifyOtpPage() {
  return (
    <div className="bg-background min-h-screen">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-[#131313] text-[#e4e2e1]">
            Loading...
          </div>
        }
      >
        <VerifyResetOtp />
      </Suspense>
    </div>
  );
}

