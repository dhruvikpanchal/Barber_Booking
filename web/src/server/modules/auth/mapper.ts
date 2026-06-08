import type { Role } from "@/server/shared/constants/roles";
import type { User } from "@/server/db";

export type AuthUserDto = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  photoUrl: string | null;
};

export type AuthTokensDto = {
  accessToken: string;
  refreshToken: string;
};

export function toAuthUser(
  user: Pick<User, "id" | "email" | "fullName" | "role" | "photoUrl">,
): AuthUserDto {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role as Role,
    photoUrl: user.photoUrl,
  };
}

export function toAuthResponse(
  user: Pick<User, "id" | "email" | "fullName" | "role" | "photoUrl">,
  tokens: AuthTokensDto,
) {
  return {
    user: toAuthUser(user),
    tokens,
  };
}
