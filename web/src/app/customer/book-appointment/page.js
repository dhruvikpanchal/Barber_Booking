import { Suspense } from "react";
import BookAppointment from "@/client/modules/customer/pages/BookAppointment";

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={null}>
      <BookAppointment />
    </Suspense>
  );
}
