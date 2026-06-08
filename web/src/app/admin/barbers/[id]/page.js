import { notFound } from "next/navigation";
import BarberDetail from "@/client/modules/admin/pages/BarberDetail.jsx";
import { getAdminBarberById } from "@/client/modules/admin/data/barberDetailData.js";
import { INITIAL_BARBERS } from "@/client/modules/admin/data/barberData.js";

export function generateStaticParams() {
  return INITIAL_BARBERS.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const barber = getAdminBarberById(id);
  return {
    title: barber ? `${barber.name} · Barber` : "Barber not found · Admin",
  };
}

export default async function BarberDetailPage({ params }) {
  const { id } = await params;
  if (!getAdminBarberById(id)) notFound();
  return <BarberDetail id={id} />;
}
