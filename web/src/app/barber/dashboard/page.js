import { loadBarberPage } from "@/client/modules/barber/loadBarberPage.js";

const Dashboard = loadBarberPage(() => import("@/client/modules/barber/pages/Dashboard"));

export const metadata = {
  title: "Dashboard · Barber",
  description: "Today's appointments, pending requests, queue, and earnings.",
};

export default function BarberDashboardPage() {
  return <Dashboard />;
}
