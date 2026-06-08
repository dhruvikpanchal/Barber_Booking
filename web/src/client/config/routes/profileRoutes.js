import { routes } from "@/config/routes/routes";
import { ADMIN, BARBER, CUSTOMER } from "@/client/modules/shared/constants/roles.js";

export function getProfileHref(role) {
  switch (role) {
    case BARBER:
      return routes.barber.profile;
    case ADMIN:
      return routes.admin.profile;
    case CUSTOMER:
      return routes.customer.profile;
    default:
      return "#";
  }
}

export function getSettingsHref(role) {
  switch (role) {
    case BARBER:
      return routes.barber.settings;
    case ADMIN:
      return routes.admin.settings;
    case CUSTOMER:
      return routes.customer.settings;
    default:
      return "#";
  }
}
