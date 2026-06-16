import Home from "@/client/modules/public/pages/Home.jsx";
import { getCachedHome } from "@/server/modules/public/serverFetch";

export const revalidate = 60;

export default async function HomePage() {
  const home = await getCachedHome();

  return (
    <div className="bg-background min-h-screen">
      <Home initialData={home} />
    </div>
  );
}
