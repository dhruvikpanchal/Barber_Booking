import { FILTERS } from "@/client/modules/customer/constants/notificationsConstants.js";

export function matchesFilter(notif, filterId) {
  if (filterId === "all") return true;
  const filter = FILTERS.find((f) => f.id === filterId);
  if (!filter) return notif.type === filterId;
  if (filter.types) return filter.types.includes(notif.type);
  return notif.type === filterId;
}

export function unreadCountForFilter(notifications, filterId) {
  return notifications.filter((n) => !n.read && matchesFilter(n, filterId)).length;
}
