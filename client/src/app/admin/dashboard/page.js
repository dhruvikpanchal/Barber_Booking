import Dashboard from "@/modules/admin/Dashboard";

export const metadata = {
  title: "Dashboard · Admin",
  description:
    "Platform overview: users, barbers, bookings, growth, reports, and live queue.",
};

export default function AdminDashboardPage() {
  return <Dashboard />;
}
