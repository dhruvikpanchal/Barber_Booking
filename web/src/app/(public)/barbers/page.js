import BarbersList from "@/client/modules/public/pages/BarbersList.jsx";
import { getCachedBarbersList } from "@/server/modules/public/serverFetch";

export const metadata = {
  title: "Barbers · Iron & Oak",
  description: "Browse barbers, compare ratings and services, and book your next appointment.",
};

export const revalidate = 30;

export default async function BarbersPage() {
  const result = await getCachedBarbersList();
  const barbers = result?.items ?? [];

  return <BarbersList initialBarbers={barbers} />;
}
