import AppShell from "@/client/modules/shared/components/layout/shell/AppShell";
import BarberSidebar from "@/client/modules/shared/components/layout/sidebar/BarberSidebar";
import BarberBottomNav from "@/client/modules/shared/components/layout/bottom-nav/BarberBottomNav";

export default function BarberLayout({ children }) {
  return (
    <AppShell role="barber" sidebar={<BarberSidebar />} bottomNav={<BarberBottomNav />}>
      {children}
    </AppShell>
  );
}
