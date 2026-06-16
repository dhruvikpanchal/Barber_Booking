import AppShell from "@/client/modules/shared/components/layout/shell/AppShell";
import AdminSidebar from "@/client/modules/shared/components/layout/sidebar/AdminSidebar";
import AdminBottomNav from "@/client/modules/shared/components/layout/bottom-nav/AdminBottomNav";
import AuthGuard from "@/client/modules/shared/components/auth/AuthGuard";

export default function AdminLayout({ children }) {
  return (
    <AuthGuard role="admin">
      <AppShell role="admin" sidebar={<AdminSidebar />} bottomNav={<AdminBottomNav />}>
        {children}
      </AppShell>
    </AuthGuard>
  );
}
