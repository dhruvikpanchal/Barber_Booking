import { routes } from "@/config/routes/routes.js";

/** localStorage sections for customer nav badge tracking. */
export const CUSTOMER_NAV_SECTIONS = {
  notifications: "notifications",
  appointments: "appointments",
  reviews: "reviews",
};

/** Map customer routes to their last-seen section. */
export const CUSTOMER_NAV_ROUTE_SECTIONS = {
  [routes.customer.notifications]: CUSTOMER_NAV_SECTIONS.notifications,
  [routes.customer.myAppointments]: CUSTOMER_NAV_SECTIONS.appointments,
  [routes.customer.reviews]: CUSTOMER_NAV_SECTIONS.reviews,
};
