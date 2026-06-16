import { loadBarberPage } from "@/client/modules/barber/loadBarberPage.js";

const BarberSchedule = loadBarberPage(() => import("@/client/modules/barber/pages/Schedule"));

export default function BarberSchedulePage() {
  return <BarberSchedule />;
}
