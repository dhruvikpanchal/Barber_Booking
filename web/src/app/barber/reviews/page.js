import { loadBarberPage } from "@/client/modules/barber/loadBarberPage.js";

const Reviews = loadBarberPage(() => import("@/client/modules/barber/pages/Reviews"));

export default function ReviewsPage() {
  return <Reviews />;
}
