import WalkIns from "@/modules/barber/WalkIns";

export const metadata = {
  title: "Walk-ins · Barber",
  description: "Manage the live walk-in queue and update customer status.",
};

export default function BarberWalkInsPage() {
  return <WalkIns />;
}
