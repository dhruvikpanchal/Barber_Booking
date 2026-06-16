import type { NextRequest, NextResponse } from "next/server";
import { ROLES, type Role } from "@/server/modules/shared/constants/roles";
import { ForbiddenError } from "@/server/modules/shared/helpers/AppError";
import type { AuthedRequest } from "@/server/modules/shared/types/request";

export type MiddlewareHandler = (req: NextRequest, ctx?: unknown) => Promise<NextResponse>;

export function requireRole(...allowedRoles: Role[]) {
  return function withRole(handler: MiddlewareHandler): MiddlewareHandler {
    return async (req, ctx) => {
      const user = (req as AuthedRequest).user;
      if (!user) throw new ForbiddenError();
      if (!allowedRoles.includes(user.role)) {
        throw new ForbiddenError(`Access restricted to: ${allowedRoles.join(", ")}`);
      }
      return handler(req, ctx);
    };
  };
}

export const adminOnly = requireRole(ROLES.ADMIN);
export const barberOnly = requireRole(ROLES.BARBER);
export const customerOnly = requireRole(ROLES.CUSTOMER);
export const staffOnly = requireRole(ROLES.ADMIN, ROLES.BARBER);
