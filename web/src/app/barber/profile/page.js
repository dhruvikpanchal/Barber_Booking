import { loadBarberPage } from "@/client/modules/barber/loadBarberPage.js";

const BarberProfile = loadBarberPage(() => import("@/client/modules/barber/pages/Profile"));

export default function BarberProfilePage() {
  return <BarberProfile />;
}
