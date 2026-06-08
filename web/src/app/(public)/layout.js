import PublicShell from "@/client/modules/shared/components/layout/shell/PublicShell.jsx";
import PublicFooter from "@/client/modules/shared/components/layout/footer/PublicFooter.jsx";
import PublicNavbar from "@/client/modules/shared/components/layout/navbar/PublicNavbar.jsx";

export default function PublicLayout({ children }) {
  return (
    <PublicShell>
      <PublicNavbar />
      {children}
      <PublicFooter />
    </PublicShell>
  );
}
