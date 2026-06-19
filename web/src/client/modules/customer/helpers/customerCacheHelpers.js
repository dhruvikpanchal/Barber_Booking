import { mergeProfileSnippet } from "@/client/lib/auth/profileCache.js";

const NOTIFICATION_LIST_KEY = ["listNotifications", { limit: 100 }];
const UNREAD_COUNT_KEY = ["getUnreadNotificationCount"];
const DASHBOARD_KEY = ["dashboard"];

export function seedDashboardQueryCache(queryClient, data) {
  if (!data) return;

  queryClient.setQueryData(DASHBOARD_KEY, data);

  if (data.profile) {
    mergeProfileSnippet(queryClient, "customer", data.profile);
  }

  if (data.notifications?.unreadCount != null) {
    queryClient.setQueryData(UNREAD_COUNT_KEY, { count: data.notifications.unreadCount });
  }
}

function patchNotificationList(queryClient, updater) {
  queryClient.setQueryData(NOTIFICATION_LIST_KEY, (current) => {
    if (!current?.items) return current;
    const items = updater(current.items);
    if (items === current.items) return current;
    return { ...current, items };
  });
}

function patchUnreadCount(queryClient, delta) {
  queryClient.setQueryData(UNREAD_COUNT_KEY, (current) => {
    const count = Math.max(0, (current?.count ?? 0) + delta);
    return { count };
  });
}

function patchDashboardUnread(queryClient, count) {
  queryClient.setQueryData(DASHBOARD_KEY, (current) => {
    if (!current?.notifications) return current;
    return {
      ...current,
      notifications: { ...current.notifications, unreadCount: count },
    };
  });
}

function syncUnreadCount(queryClient, nextCount) {
  queryClient.setQueryData(UNREAD_COUNT_KEY, { count: nextCount });
  patchDashboardUnread(queryClient, nextCount);
}

export function invalidateCustomerNotificationQueries(queryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["listNotifications"] }),
    queryClient.invalidateQueries({ queryKey: ["getUnreadNotificationCount"] }),
    queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY }),
  ]);
}

export function syncCustomerUnreadCount(queryClient, notifications = []) {
  const unread = notifications.filter((item) => !item.read).length;
  syncUnreadCount(queryClient, unread);
}

export function applyNotificationReadInCache(queryClient, id) {
  let wasUnread = false;

  patchNotificationList(queryClient, (items) =>
    items.map((item) => {
      if (item.id !== id) return item;
      if (!item.read) wasUnread = true;
      return { ...item, read: true };
    }),
  );

  if (wasUnread) {
    const current = queryClient.getQueryData(UNREAD_COUNT_KEY);
    syncUnreadCount(queryClient, Math.max(0, (current?.count ?? 0) - 1));
  }
}

export function applyAllNotificationsReadInCache(queryClient) {
  patchNotificationList(queryClient, (items) => items.map((item) => ({ ...item, read: true })));
  syncUnreadCount(queryClient, 0);
}

export function applyNotificationDeletedInCache(queryClient, id) {
  let wasUnread = false;

  patchNotificationList(queryClient, (items) => {
    const target = items.find((item) => item.id === id);
    if (target && !target.read) wasUnread = true;
    return items.filter((item) => item.id !== id);
  });

  if (wasUnread) {
    const current = queryClient.getQueryData(UNREAD_COUNT_KEY);
    syncUnreadCount(queryClient, Math.max(0, (current?.count ?? 0) - 1));
  }
}
