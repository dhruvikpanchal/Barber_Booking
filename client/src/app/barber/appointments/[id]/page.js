import { notFound } from "next/navigation";
import AppointmentDetail from "@/modules/barber/AppointmentDetail.jsx";
import {
  INITIAL_APPOINTMENTS,
  getAppointmentById,
} from "@/data/barber/appointmentsData.js";

export function generateStaticParams() {
  return INITIAL_APPOINTMENTS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const appt = getAppointmentById(id);
  return {
    title: appt
      ? `${appt.customer.name} · Appointment`
      : "Appointment not found · Barber",
  };
}

export default async function BarberAppointmentDetailPage({ params }) {
  const { id } = await params;
  const appt = getAppointmentById(id);
  if (!appt) notFound();

  return <AppointmentDetail appt={appt} />;
}
