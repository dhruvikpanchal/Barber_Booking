const NOTIFICATIONS_QUERY_KEY = ["notifications"];
const UNREAD_COUNT_KEY = ["unreadNotificationCount"];
const DASHBOARD_KEY = ["dashboard"];

function patchAllNotificationLists(queryClient, updater) {
  queryClient.setQueriesData({ queryKey: NOTIFICATIONS_QUERY_KEY }, (current) => {
    if (!current?.items) return current;
    const items = updater(current.items);
    if (items === current.items) return current;
    return { ...current, items };
  });
}

export function syncAdminUnreadCount(queryClient, count) {
  const next = Math.max(0, Number(count) || 0);
  queryClient.setQueryData(UNREAD_COUNT_KEY, { count: next });
}

export function invalidateAdminNotificationQueries(queryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY }),
    queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY }),
  ]);
}

export function applyAdminNotificationReadInCache(queryClient, id) {
  let wasUnread = false;

  patchAllNotificationLists(queryClient, (items) =>
    items.map((item) => {
      if (item.id !== id) return item;
      const read = item.read ?? item.isRead;
      if (!read) wasUnread = true;
      return { ...item, read: true, isRead: true };
    }),
  );

  if (wasUnread) {
    const current = queryClient.getQueryData(UNREAD_COUNT_KEY);
    syncAdminUnreadCount(queryClient, Math.max(0, (current?.count ?? 0) - 1));
  }
}

export function applyAllAdminNotificationsReadInCache(queryClient) {
  patchAllNotificationLists(queryClient, (items) =>
    items.map((item) => ({ ...item, read: true, isRead: true })),
  );
  syncAdminUnreadCount(queryClient, 0);
}

export function applyAdminNotificationDeleteInCache(queryClient, id) {
  let wasUnread = false;

  patchAllNotificationLists(queryClient, (items) => {
    const next = items.filter((item) => {
      if (item.id === id) {
        const read = item.read ?? item.isRead;
        if (!read) wasUnread = true;
        return false;
      }
      return true;
    });
    return next.length === items.length ? items : next;
  });

  if (wasUnread) {
    const current = queryClient.getQueryData(UNREAD_COUNT_KEY);
    syncAdminUnreadCount(queryClient, Math.max(0, (current?.count ?? 0) - 1));
  }
}
