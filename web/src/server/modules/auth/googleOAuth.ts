import { randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import type { NextRequest } from "next/server";
import { env } from "@/server/config";
import type { AuthTokensDto, AuthUserDto } from "@/server/modules/auth/mapper";
import { UnauthorizedError } from "@/server/modules/shared/helpers/AppError";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const HANDOFF_PURPOSE = "google_oauth_handoff";
const HANDOFF_MAX_AGE_SECONDS = 120;

export const GOOGLE_OAUTH_STATE_COOKIE = "google_oauth_state";
export const GOOGLE_HANDOFF_COOKIE = "google_handoff";

type GoogleHandoffPayload = {
  purpose: typeof HANDOFF_PURPOSE;
  user: AuthUserDto;
  tokens: AuthTokensDto;
};

export function getRequestOrigin(req: NextRequest): string {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) return env.NEXT_PUBLIC_APP_URL;

  const forwardedProto = req.headers.get("x-forwarded-proto");
  const proto =
    forwardedProto ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  return `${proto}://${host}`;
}

export function getGoogleRedirectUri(req: NextRequest): string {
  return `${getRequestOrigin(req)}/api/v1/auth/google/callback`;
}

export function createGoogleOAuthState(): string {
  return randomBytes(32).toString("hex");
}

export function buildGoogleAuthorizeUrl(req: NextRequest, state: string): string {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new UnauthorizedError("Google sign-in is not configured");
  }

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: getGoogleRedirectUri(req),
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeGoogleCodeForIdToken(
  req: NextRequest,
  code: string,
): Promise<string> {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    throw new UnauthorizedError("Google sign-in is not configured");
  }

  const client = new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    getGoogleRedirectUri(req),
  );

  const { tokens } = await client.getToken(code);
  if (!tokens.id_token) {
    throw new UnauthorizedError("Google did not return an ID token");
  }

  return tokens.id_token;
}

export function signGoogleHandoff(data: { user: AuthUserDto; tokens: AuthTokensDto }): string {
  return jwt.sign(
    {
      purpose: HANDOFF_PURPOSE,
      user: data.user,
      tokens: data.tokens,
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: HANDOFF_MAX_AGE_SECONDS },
  );
}

export function verifyGoogleHandoff(token: string): GoogleHandoffPayload {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as GoogleHandoffPayload;
    if (payload.purpose !== HANDOFF_PURPOSE || !payload.user || !payload.tokens) {
      throw new UnauthorizedError("Invalid Google sign-in session");
    }
    return payload;
  } catch {
    throw new UnauthorizedError("Google sign-in session expired. Please try again.");
  }
}

export function oauthCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}
