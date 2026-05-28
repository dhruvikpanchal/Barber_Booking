import AppShell from "@/components/layout/shell/AppShell";
import CustomerSidebar from "@/components/layout/sidebar/CustomerSidebar";
import CustomerBottomNav from "@/components/layout/bottom-nav/CustomerBottomNav";

export default function CustomerLayout({ children }) {
  return (
    <AppShell
      role="customer"
      sidebar={<CustomerSidebar />}
      bottomNav={<CustomerBottomNav />}
    >
      {children}
    </AppShell>
  );
}
