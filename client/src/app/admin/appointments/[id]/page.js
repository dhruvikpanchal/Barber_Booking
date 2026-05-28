import { notFound } from "next/navigation";
import AppointmentDetail from "@/modules/admin/AppointmentDetail.jsx";
import { getAdminAppointmentById } from "@/data/admin/appointmentDetailData.js";
import { INITIAL_ADMIN_APPOINTMENTS } from "@/data/admin/appointmentsData.js";

export function generateStaticParams() {
  return INITIAL_ADMIN_APPOINTMENTS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const appt = getAdminAppointmentById(id);
  return {
    title: appt
      ? `${appt.customer.name} · Appointment`
      : "Appointment not found · Admin",
  };
}

export default async function AppointmentDetailPage({ params }) {
  const { id } = await params;
  if (!getAdminAppointmentById(id)) notFound();
  return <AppointmentDetail id={id} />;
}
