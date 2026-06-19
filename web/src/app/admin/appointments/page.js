import Appointments from "@/client/modules/admin/pages/Appointments.jsx";
import SearchParamsBoundary from "@/client/modules/shared/components/layout/SearchParamsBoundary.jsx";

export default function AdminAppointmentsPage() {
  return (
    <SearchParamsBoundary>
      <Appointments />
    </SearchParamsBoundary>
  );
}
