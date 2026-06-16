import AppointmentDetail from "@/client/modules/admin/pages/AppointmentDetail.jsx";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Appointment · ${id}`,
  };
}

export default async function AppointmentDetailPage({ params }) {
  const { id } = await params;
  return <AppointmentDetail id={id} />;
}
