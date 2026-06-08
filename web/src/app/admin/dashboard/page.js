import Dashboard from "@/client/modules/admin/pages/Dashboard";

export const metadata = {
  title: "Dashboard · Admin",
  description: "Platform overview: users, barbers, bookings, growth, reports, and live queue.",
};

export default function AdminDashboardPage() {
  return <Dashboard />;
}
