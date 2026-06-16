import { createHash } from "node:crypto";
import { signAccessToken, signRefreshToken } from "@/server/infra/auth/jwt";
import type { Role } from "@/server/modules/shared/constants/roles";

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function issueTokenPair(userId: string, role: Role) {
  const payload = { sub: userId, role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
}

export function getRefreshTokenExpiry(): Date {
  const expires = process.env.JWT_REFRESH_EXPIRES ?? "7d";
  const match = /^(\d+)([dhms])$/.exec(expires);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const amount = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return new Date(Date.now() + amount * (multipliers[unit] ?? multipliers.d));
}
