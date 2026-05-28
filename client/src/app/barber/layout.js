import AppShell from "@/components/layout/shell/AppShell";
import BarberSidebar from "@/components/layout/sidebar/BarberSidebar";
import BarberBottomNav from "@/components/layout/bottom-nav/BarberBottomNav";

export default function BarberLayout({ children }) {
  return (
    <AppShell
      role="barber"
      sidebar={<BarberSidebar />}
      bottomNav={<BarberBottomNav />}
    >
      {children}
    </AppShell>
  );
}
