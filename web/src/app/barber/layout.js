import AppShell from "@/client/modules/shared/components/layout/shell/AppShell";
import BarberSidebar from "@/client/modules/shared/components/layout/sidebar/BarberSidebar";
import BarberBottomNav from "@/client/modules/shared/components/layout/bottom-nav/BarberBottomNav";
import AuthGuard from "@/client/modules/shared/components/auth/AuthGuard";

export default function BarberLayout({ children }) {
  return (
    <AuthGuard role="barber">
      <AppShell role="barber" sidebar={<BarberSidebar />} bottomNav={<BarberBottomNav />}>
        {children}
      </AppShell>
    </AuthGuard>
  );
}
