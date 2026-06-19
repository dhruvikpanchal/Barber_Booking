import ServicesList from "@/client/modules/public/pages/ServicesList.jsx";
import { getCachedServicesList } from "@/server/modules/public/serverFetch";

export const metadata = {
  title: "Services · Iron & Oak",
  description: "Browse barber services, pricing, and durations across Iron & Oak shops.",
};

export const revalidate = 30;

export default async function ServicesPage() {
  const result = await getCachedServicesList();
  const services = result?.items ?? [];

  return <ServicesList initialServices={services} />;
}
