import AppointmentDetail from "@/client/modules/customer/pages/AppointmentDetail.jsx";

export const dynamic = "force-dynamic";

export default async function CustomerAppointmentDetailPage({ params }) {
  const { id } = await params;
  return <AppointmentDetail appointmentId={id} />;
}
