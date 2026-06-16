import jwt from "jsonwebtoken";
import { env } from "@/server/config";
import { UnauthorizedError } from "@/server/modules/shared/helpers/AppError";
import type { Role } from "@/server/modules/shared/constants/roles";

export type JwtPayload = {
  sub: string;
  role: Role;
  iat?: number;
  exp?: number;
};

type TokenInput = Pick<JwtPayload, "sub" | "role">;

export function signAccessToken(payload: TokenInput): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES as jwt.SignOptions["expiresIn"],
  });
}

export function signRefreshToken(payload: TokenInput): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Access token expired");
    }
    throw new UnauthorizedError("Invalid access token");
  }
}

export function verifyRefreshToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Refresh token expired");
    }
    throw new UnauthorizedError("Invalid refresh token");
  }
}
