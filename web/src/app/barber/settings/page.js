import { loadBarberPage } from "@/client/modules/barber/loadBarberPage.js";

const Settings = loadBarberPage(() => import("@/client/modules/barber/pages/Settings.jsx"));

export default function BarberSettingsPage() {
  return <Settings />;
}
