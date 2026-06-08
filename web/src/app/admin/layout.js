import AppShell from "@/client/modules/shared/components/layout/shell/AppShell";
import AdminSidebar from "@/client/modules/shared/components/layout/sidebar/AdminSidebar";
import AdminBottomNav from "@/client/modules/shared/components/layout/bottom-nav/AdminBottomNav";

export default function AdminLayout({ children }) {
  return (
    <AppShell role="admin" sidebar={<AdminSidebar />} bottomNav={<AdminBottomNav />}>
      {children}
    </AppShell>
  );
}
