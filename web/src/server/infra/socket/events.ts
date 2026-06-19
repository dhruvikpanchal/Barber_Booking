export const REALTIME_EVENT = {
  INVALIDATE: "invalidate",
} as const;

export const REALTIME_SCOPES = [
  "notifications",
  "appointments",
  "queue",
  "reviews",
  "contact_messages",
  "barber_requests",
  "nav_badges",
  "users",
  "barbers",
  "dashboard",
  "walk_ins",
  "favorites",
] as const;

export type RealtimeScope = (typeof REALTIME_SCOPES)[number];

export type RealtimeToast = {
  title: string;
  message?: string;
};

export type RealtimeEmitOptions = {
  entityId?: string;
  toast?: RealtimeToast;
};

export type RealtimeInvalidatePayload = {
  scopes: RealtimeScope[];
  entityId?: string;
  toast?: RealtimeToast;
};
