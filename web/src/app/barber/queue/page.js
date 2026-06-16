import { loadBarberPage } from "@/client/modules/barber/loadBarberPage.js";

const Queue = loadBarberPage(() => import("@/client/modules/barber/pages/Queue"));

export const metadata = {
  title: "Queue management · Barber",
};

export default function QueuePage() {
  return <Queue />;
}
