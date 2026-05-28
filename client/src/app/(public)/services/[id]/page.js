import ServiceDetail from "@/modules/public/ServiceDetail";
import { notFound } from "next/navigation";

export default async function ServiceDetailPage({ params }) {
  const { id } = await params;
  if (!id) notFound();

  return <ServiceDetail id={id} />;
}
