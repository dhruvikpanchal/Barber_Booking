import { notFound } from "next/navigation";
import BarberDetail from "@/client/modules/public/pages/BarberDetail.jsx";
import { getCachedBarberBySlug } from "@/server/modules/public/serverFetch";

export const revalidate = 30;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const barber = await getCachedBarberBySlug(id);
  if (!barber) {
    return { title: "Barber not found" };
  }
  return { title: `${barber.name} · Barber` };
}

export default async function BarberDetailPage({ params }) {
  const { id } = await params;
  if (!id) notFound();

  const barber = await getCachedBarberBySlug(id);
  if (!barber) notFound();

  return <BarberDetail slug={id} initialBarber={barber} />;
}
