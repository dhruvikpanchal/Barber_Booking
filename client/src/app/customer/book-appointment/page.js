import { Suspense } from "react";
import BookAppointment from "@/modules/customer/BookAppointment";

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={null}>
      <BookAppointment />
    </Suspense>
  );
}
