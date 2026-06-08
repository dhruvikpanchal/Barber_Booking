import AppShell from "@/client/modules/shared/components/layout/shell/AppShell";
import CustomerSidebar from "@/client/modules/shared/components/layout/sidebar/CustomerSidebar";
import CustomerBottomNav from "@/client/modules/shared/components/layout/bottom-nav/CustomerBottomNav";

export default function CustomerLayout({ children }) {
  return (
    <AppShell role="customer" sidebar={<CustomerSidebar />} bottomNav={<CustomerBottomNav />}>
      {children}
    </AppShell>
  );
}
