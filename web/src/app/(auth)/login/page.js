import Login from "@/client/modules/auth/pages/Login.jsx";
import SearchParamsBoundary from "@/client/modules/shared/components/layout/SearchParamsBoundary.jsx";

export default function LoginPage() {
  return (
    <div className="bg-background min-h-screen">
      <SearchParamsBoundary>
        <Login />
      </SearchParamsBoundary>
    </div>
  );
}
