import { loadBarberPage } from "@/client/modules/barber/loadBarberPage.js";

const Analytics = loadBarberPage(() => import("@/client/modules/barber/pages/Analytics.jsx"), {
  tiles: 5,
  ssr: false,
});

export const metadata = {
  title: "Analytics · Barber",
  description: "Revenue, appointments, service popularity, and customer growth reports.",
};

export default function BarberAnalyticsPage() {
  return <Analytics />;
}
