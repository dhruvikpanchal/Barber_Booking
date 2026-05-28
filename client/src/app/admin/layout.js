import AppShell from "@/components/layout/shell/AppShell";
import AdminSidebar from "@/components/layout/sidebar/AdminSidebar";
import AdminBottomNav from "@/components/layout/bottom-nav/AdminBottomNav";

export default function AdminLayout({ children }) {
  return (
    <AppShell
      role="admin"
      sidebar={<AdminSidebar />}
      bottomNav={<AdminBottomNav />}
    >
      {children}
    </AppShell>
  );
}
