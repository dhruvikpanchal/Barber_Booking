import ServiceDetail from "@/client/modules/public/pages/ServiceDetail.jsx";
import { notFound } from "next/navigation";

export default async function ServiceDetailPage({ params }) {
  const { id } = await params;
  if (!id) notFound();

  return <ServiceDetail id={id} />;
}
