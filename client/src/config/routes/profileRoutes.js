import { routes } from "@/config/routes/routes";

export function getProfileHref(role) {
  switch (role) {
    case "barber":
      return routes.barber.profile;
    case "admin":
      return routes.admin.profile;
    case "customer":
      return routes.customer.profile;
    default:
      return "#";
  }
}

export function getSettingsHref(role) {
  switch (role) {
    case "barber":
      return routes.barber.settings;
    case "admin":
      return routes.admin.settings;
    case "customer":
      return routes.customer.settings;
    default:
      return "#";
  }
}
