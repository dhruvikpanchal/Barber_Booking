import BookAppointment from "@/client/modules/customer/pages/BookAppointment";
import SearchParamsBoundary from "@/client/modules/shared/components/layout/SearchParamsBoundary.jsx";

export default function BookAppointmentPage() {
  return (
    <SearchParamsBoundary>
      <BookAppointment />
    </SearchParamsBoundary>
  );
}
