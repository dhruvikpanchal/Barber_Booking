import { loadBarberPage } from "@/client/modules/barber/loadBarberPage.js";

const BarberServices = loadBarberPage(() => import("@/client/modules/barber/pages/Services"));

export default function BarberServicesPage() {
  return <BarberServices />;
}
