import { loadBarberPage } from "@/client/modules/barber/loadBarberPage.js";

const AppointmentDetail = loadBarberPage(
  () => import("@/client/modules/barber/pages/AppointmentDetail.jsx"),
);

export const metadata = {
  title: "Appointment · Barber",
  description: "Appointment details and actions.",
};

export default async function BarberAppointmentDetailPage({ params }) {
  const { id } = await params;
  return <AppointmentDetail appointmentId={id} />;
}
