const BARBER_NOTIFICATION_LIST_KEY = ["barberListNotifications", { limit: 100 }];

export function patchBarberNotificationInCache(queryClient, id, patch) {
  queryClient.setQueryData(BARBER_NOTIFICATION_LIST_KEY, (current) => {
    if (!current?.notifications) return current;
    return {
      ...current,
      notifications: current.notifications.map((item) =>
        item.id === id ? { ...item, ...patch, read: patch.read ?? true } : item,
      ),
    };
  });
}

export function markAllBarberNotificationsReadInCache(queryClient) {
  queryClient.setQueryData(BARBER_NOTIFICATION_LIST_KEY, (current) => {
    if (!current?.notifications) return current;
    return {
      ...current,
      notifications: current.notifications.map((item) => ({ ...item, read: true })),
    };
  });
}
