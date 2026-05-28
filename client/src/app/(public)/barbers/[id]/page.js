import { notFound } from "next/navigation";
import BarberDetail from "@/modules/public/BarberDetail.jsx";
import { barbers, getBarberById } from "@/data/public/barbers.js";

export function generateStaticParams() {
  return barbers.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const barber = getBarberById(id);
  return {
    title: barber ? `${barber.name} · Barber` : "Barber not found",
  };
}

export default async function BarberDetailPage({ params }) {
  const { id } = await params;
  const barber = getBarberById(id);
  if (!barber) notFound();

  return <BarberDetail barber={barber} />;
}
