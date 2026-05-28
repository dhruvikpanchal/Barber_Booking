import MyAppointments from "@/modules/customer/MyAppointments.jsx";

export const metadata = {
  title: "My Appointments · Customer",
  description: "View and manage your upcoming, past, and cancelled bookings.",
};

export default function MyAppointmentsPage() {
  return <MyAppointments />;
}
