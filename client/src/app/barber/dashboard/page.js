import Dashboard from "@/modules/barber/Dashboard";

export const metadata = {
  title: "Dashboard · Barber",
  description: "Today's appointments, pending requests, queue, and earnings.",
};

export default function BarberDashboardPage() {
  return <Dashboard />;
}
