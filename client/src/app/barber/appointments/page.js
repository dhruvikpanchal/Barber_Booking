import Appointments from "@/modules/barber/Appointments";

export const metadata = {
  title: "Appointments · Barber",
  description: "Review, accept, reschedule, and complete customer bookings.",
};

export default function BarberAppointmentsPage() {
  return <Appointments />;
}
