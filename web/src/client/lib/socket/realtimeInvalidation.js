const SCOPE_HANDLERS = {
  notifications: {
    customer: (qc) => [
      qc.invalidateQueries({ queryKey: ["listNotifications"] }),
      qc.invalidateQueries({ queryKey: ["getUnreadNotificationCount"] }),
      qc.invalidateQueries({ queryKey: ["dashboard"] }),
    ],
    barber: (qc) => [
      qc.invalidateQueries({ queryKey: ["barberListNotifications"] }),
      qc.invalidateQueries({ queryKey: ["barberUnreadNotificationCount"] }),
      qc.invalidateQueries({ queryKey: ["barberGetDashboard"] }),
    ],
    admin: (qc) => [
      qc.invalidateQueries({ queryKey: ["notifications"] }),
      qc.invalidateQueries({ queryKey: ["unreadNotificationCount"] }),
      qc.invalidateQueries({ queryKey: ["dashboard"] }),
    ],
  },
  appointments: {
    customer: (qc, entityId) => [
      qc.invalidateQueries({ queryKey: ["listAppointments"] }),
      qc.invalidateQueries({ queryKey: ["dashboard"] }),
      qc.invalidateQueries({ queryKey: ["getUnreadNotificationCount"] }),
      ...(entityId
        ? [qc.invalidateQueries({ queryKey: ["getAppointment", entityId] })]
        : []),
    ],
    barber: (qc, entityId) => [
      qc.invalidateQueries({ queryKey: ["barberListAppointments"] }),
      qc.invalidateQueries({ queryKey: ["barberGetQueue"] }),
      qc.invalidateQueries({ queryKey: ["barberListWalkIns"] }),
      qc.invalidateQueries({ queryKey: ["barberGetDashboard"] }),
      qc.invalidateQueries({ queryKey: ["barberNavBadges"] }),
      qc.invalidateQueries({ queryKey: ["barberListNotifications"] }),
      qc.invalidateQueries({ queryKey: ["barberUnreadNotificationCount"] }),
      qc.invalidateQueries({ queryKey: ["barberGetAnalytics"] }),
      ...(entityId
        ? [qc.invalidateQueries({ queryKey: ["barberGetAppointment", entityId] })]
        : []),
    ],
    admin: (qc, entityId) => [
      qc.invalidateQueries({ queryKey: ["appointments"] }),
      qc.invalidateQueries({ queryKey: ["appointment"] }),
      qc.invalidateQueries({ queryKey: ["dashboard"] }),
      qc.invalidateQueries({ queryKey: ["adminNavBadges"] }),
      ...(entityId
        ? [qc.invalidateQueries({ queryKey: ["appointment", entityId] })]
        : []),
    ],
  },
  queue: {
    barber: (qc) => [
      qc.invalidateQueries({ queryKey: ["barberGetQueue"] }),
      qc.invalidateQueries({ queryKey: ["barberGetDashboard"] }),
      qc.invalidateQueries({ queryKey: ["barberNavBadges"] }),
    ],
  },
  reviews: {
    customer: (qc, entityId) => [
      qc.invalidateQueries({ queryKey: ["listReviews"] }),
      qc.invalidateQueries({ queryKey: ["listAppointments"] }),
      ...(entityId ? [qc.invalidateQueries({ queryKey: ["getReview", entityId] })] : []),
    ],
    barber: (qc, entityId) => [
      qc.invalidateQueries({ queryKey: ["barberListReviews"] }),
      qc.invalidateQueries({ queryKey: ["barberNavBadges"] }),
      ...(entityId
        ? [qc.invalidateQueries({ queryKey: ["barberGetReview", entityId] })]
        : []),
    ],
  },
  contact_messages: {
    admin: (qc, entityId) => [
      qc.invalidateQueries({ queryKey: ["contactMessageStats"] }),
      qc.invalidateQueries({ queryKey: ["contactMessages"] }),
      qc.invalidateQueries({ queryKey: ["adminNavBadges"] }),
      ...(entityId
        ? [qc.invalidateQueries({ queryKey: ["contactMessage", entityId] })]
        : []),
    ],
  },
  barber_requests: {
    admin: (qc, entityId) => [
      qc.invalidateQueries({ queryKey: ["barberRequestStats"] }),
      qc.invalidateQueries({ queryKey: ["barberRequests"] }),
      qc.invalidateQueries({ queryKey: ["adminNavBadges"] }),
      ...(entityId
        ? [qc.invalidateQueries({ queryKey: ["barberRequest", entityId] })]
        : []),
    ],
  },
  nav_badges: {
    admin: (qc) => [qc.invalidateQueries({ queryKey: ["adminNavBadges"] })],
    barber: (qc) => [qc.invalidateQueries({ queryKey: ["barberNavBadges"] })],
  },
  dashboard: {
    customer: (qc) => [
      qc.invalidateQueries({ queryKey: ["dashboard"] }),
      qc.invalidateQueries({ queryKey: ["getUnreadNotificationCount"] }),
    ],
    barber: (qc) => [qc.invalidateQueries({ queryKey: ["barberGetDashboard"] })],
    admin: (qc) => [
      qc.invalidateQueries({ queryKey: ["dashboard"] }),
      qc.invalidateQueries({ queryKey: ["adminNavBadges"] }),
    ],
  },
  users: {
    admin: (qc) => [
      qc.invalidateQueries({ queryKey: ["users"] }),
      qc.invalidateQueries({ queryKey: ["user"] }),
      qc.invalidateQueries({ queryKey: ["adminNavBadges"] }),
      qc.invalidateQueries({ queryKey: ["dashboard"] }),
    ],
  },
  barbers: {
    admin: (qc, entityId) => [
      qc.invalidateQueries({ queryKey: ["barbers"] }),
      qc.invalidateQueries({ queryKey: ["adminNavBadges"] }),
      ...(entityId ? [qc.invalidateQueries({ queryKey: ["barber", entityId] })] : []),
    ],
  },
  walk_ins: {
    barber: (qc) => [
      qc.invalidateQueries({ queryKey: ["barberListWalkIns"] }),
      qc.invalidateQueries({ queryKey: ["barberGetQueue"] }),
      qc.invalidateQueries({ queryKey: ["barberGetDashboard"] }),
    ],
  },
  favorites: {
    customer: (qc) => [qc.invalidateQueries({ queryKey: ["listFavorites"] })],
  },
};

export function invalidateFromRealtime(queryClient, role, payload) {
  const scopes = payload?.scopes ?? [];
  const entityId = payload?.entityId;
  const tasks = [];

  for (const scope of scopes) {
    const roleHandlers = SCOPE_HANDLERS[scope];
    const handler = roleHandlers?.[role];
    if (handler) {
      tasks.push(...handler(queryClient, entityId));
    }
  }

  if (tasks.length === 0) return Promise.resolve();
  return Promise.all(tasks);
}
