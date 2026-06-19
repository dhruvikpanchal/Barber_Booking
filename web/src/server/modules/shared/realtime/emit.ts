import { getSocketIO } from "@/server/infra/socket/store";
import {
  REALTIME_EVENT,
  type RealtimeEmitOptions,
  type RealtimeInvalidatePayload,
  type RealtimeScope,
} from "@/server/infra/socket/events";
import type { Role } from "@/server/modules/shared/constants/roles";

function resolveOptions(
  entityIdOrOptions?: string | RealtimeEmitOptions,
): RealtimeEmitOptions {
  if (typeof entityIdOrOptions === "string") {
    return { entityId: entityIdOrOptions };
  }
  return entityIdOrOptions ?? {};
}

function emitInvalidate(
  room: string,
  scopes: RealtimeScope[],
  entityIdOrOptions?: string | RealtimeEmitOptions,
): void {
  const io = getSocketIO();
  if (!io) return;

  const options = resolveOptions(entityIdOrOptions);
  const payload: RealtimeInvalidatePayload = {
    scopes,
    ...(options.entityId ? { entityId: options.entityId } : {}),
    ...(options.toast ? { toast: options.toast } : {}),
  };

  io.to(room).emit(REALTIME_EVENT.INVALIDATE, payload);
}

export function realtimeToUser(
  userId: string,
  scopes: RealtimeScope[],
  entityIdOrOptions?: string | RealtimeEmitOptions,
): void {
  emitInvalidate(`user:${userId}`, scopes, entityIdOrOptions);
}

export function realtimeToRole(
  role: Role,
  scopes: RealtimeScope[],
  entityIdOrOptions?: string | RealtimeEmitOptions,
): void {
  emitInvalidate(`role:${role}`, scopes, entityIdOrOptions);
}

export function realtimeToBarber(
  barberId: string,
  scopes: RealtimeScope[],
  entityIdOrOptions?: string | RealtimeEmitOptions,
): void {
  emitInvalidate(`barber:${barberId}`, scopes, entityIdOrOptions);
}

/** Sync badge counts across tabs/devices after local read/delete actions. */
export function realtimeSyncUser(userId: string, scopes: RealtimeScope[]): void {
  realtimeToUser(userId, scopes);
}
