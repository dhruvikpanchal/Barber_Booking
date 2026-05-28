import { notFound } from "next/navigation";
import BarberDetail from "@/modules/admin/BarberDetail.jsx";
import { getAdminBarberById } from "@/data/admin/barberDetailData.js";
import { INITIAL_BARBERS } from "@/data/admin/barberData.js";

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
