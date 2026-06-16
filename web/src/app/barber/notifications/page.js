import { loadBarberPage } from "@/client/modules/barber/loadBarberPage.js";

const Notifications = loadBarberPage(
  () => import("@/client/modules/barber/pages/Notifications.jsx"),
);

export default function BarberNotificationsPage() {
  return <Notifications />;
}
