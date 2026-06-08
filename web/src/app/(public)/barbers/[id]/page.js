import { notFound } from "next/navigation";
import BarberDetail from "@/client/modules/public/pages/BarberDetail.jsx";
import { publicService } from "@/server/modules/public/service";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const barber = await publicService.getBarberBySlug(id);
    return { title: `${barber.name} · Barber` };
  } catch {
    return { title: "Barber not found" };
  }
}

export default async function BarberDetailPage({ params }) {
  const { id } = await params;

  try {
    const barber = await publicService.getBarberBySlug(id);
    return <BarberDetail barber={barber} />;
  } catch {
    notFound();
  }
}
