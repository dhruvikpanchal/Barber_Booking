import BarberRequestDetail from "@/client/modules/admin/pages/BarberRequestDetail.jsx";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Barber request · ${id}`,
  };
}

export default async function BarberRequestDetailPage({ params }) {
  const { id } = await params;
  return <BarberRequestDetail id={id} />;
}
