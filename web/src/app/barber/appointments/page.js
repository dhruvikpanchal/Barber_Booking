import { loadBarberPage } from "@/client/modules/barber/loadBarberPage.js";

const Appointments = loadBarberPage(() => import("@/client/modules/barber/pages/Appointments"));

export const metadata = {
  title: "Appointments · Barber",
  description: "View and manage your upcoming and past appointments.",
};

export default function BarberAppointmentsPage() {
  return <Appointments />;
}
