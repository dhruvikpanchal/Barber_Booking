import BarberDetail from "@/client/modules/admin/pages/BarberDetail.jsx";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Barber · ${id}`,
  };
}

export default async function BarberDetailPage({ params }) {
  const { id } = await params;
  return <BarberDetail id={id} />;
}
