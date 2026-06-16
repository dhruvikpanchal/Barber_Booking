import type { NextRequest } from "next/server";
import type { Role } from "@/server/modules/shared/constants/roles";

export type AuthUser = {
  id: string;
  role: Role;
};

export type AuthedRequest = NextRequest & {
  user?: AuthUser;
};
