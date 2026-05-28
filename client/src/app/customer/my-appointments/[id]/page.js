import { notFound } from "next/navigation";
import AppointmentDetail from "@/modules/customer/AppointmentDetail.jsx";
import {
  MY_APPOINTMENTS,
  getAppointmentById,
} from "@/data/customer/appointmentsData.js";

export function generateStaticParams() {
  return MY_APPOINTMENTS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const appt = getAppointmentById(id);
  return {
    title: appt
      ? `Booking ${id} · Customer`
      : "Appointment not found · Customer",
  };
}

export default async function CustomerAppointmentDetailPage({ params }) {
  const { id } = await params;
  const appt = getAppointmentById(id);
  if (!appt) notFound();

  return <AppointmentDetail appt={appt} />;
}
