import AppShell from "@/client/modules/shared/components/layout/shell/AppShell";
import CustomerSidebar from "@/client/modules/shared/components/layout/sidebar/CustomerSidebar";
import CustomerBottomNav from "@/client/modules/shared/components/layout/bottom-nav/CustomerBottomNav";
import AuthGuard from "@/client/modules/shared/components/auth/AuthGuard";

export default function CustomerLayout({ children }) {
  return (
    <AuthGuard role="customer">
      <AppShell role="customer" sidebar={<CustomerSidebar />} bottomNav={<CustomerBottomNav />}>
        {children}
      </AppShell>
    </AuthGuard>
  );
}
