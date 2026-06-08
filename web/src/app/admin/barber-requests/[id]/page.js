import { notFound } from "next/navigation";
import BarberRequestDetail from "@/client/modules/admin/pages/BarberRequestDetail.jsx";
import {
  getBarberRequestById,
  INITIAL_BARBER_REQUESTS,
} from "@/client/modules/admin/data/barberRequestsData.js";

export function generateStaticParams() {
  return INITIAL_BARBER_REQUESTS.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const request = getBarberRequestById(id);
  return {
    title: request ? `${request.shopName} · Barber request` : "Request not found · Admin",
  };
}

export default async function BarberRequestDetailPage({ params }) {
  const { id } = await params;
  if (!getBarberRequestById(id)) notFound();
  return <BarberRequestDetail id={id} />;
}
