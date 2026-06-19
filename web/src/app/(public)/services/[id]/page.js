import ServiceDetail from "@/client/modules/public/pages/ServiceDetail.jsx";
import { notFound } from "next/navigation";
import { getCachedServiceBySlug } from "@/server/modules/public/serverFetch";

export const revalidate = 30;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const service = await getCachedServiceBySlug(id);
  if (!service) {
    return { title: "Service not found" };
  }
  return { title: `${service.name} · Service` };
}

export default async function ServiceDetailPage({ params }) {
  const { id } = await params;
  if (!id) notFound();

  const service = await getCachedServiceBySlug(id);
  if (!service) notFound();

  return <ServiceDetail id={id} initialData={service} />;
}
