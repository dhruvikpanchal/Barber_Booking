import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { appConfig } from "@/server/config";
import { verifyTurnstile } from "@/server/infra/security/turnstile";
import { authService } from "@/server/modules/auth/service";
import {
  buildGoogleAuthorizeUrl,
  createGoogleOAuthState,
  exchangeGoogleCodeForIdToken,
  getRequestOrigin,
  GOOGLE_HANDOFF_COOKIE,
  GOOGLE_OAUTH_STATE_COOKIE,
  oauthCookieOptions,
  signGoogleHandoff,
  verifyGoogleHandoff,
} from "@/server/modules/auth/googleOAuth";
import {
  barberRegisterSchema,
  customerRegisterSchema,
  forgotPasswordSchema,
  googleAuthSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  validateResetFlowSchema,
  verifyResetTokenSchema,
} from "@/server/modules/auth/schema";
import { created, ok } from "@/server/modules/shared/responses";
import { parseBody } from "@/server/modules/shared/validation";
import { AppError, UnauthorizedError, ValidationError } from "@/server/modules/shared/helpers/AppError";

const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function parseSpecialtiesField(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function parseBooleanField(value: FormDataEntryValue | null): boolean {
  if (value === "true" || value === "on" || value === "1") return true;
  return false;
}

async function parseBarberRegister(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const photoFile = form.get("photo");
    let photo: { buffer: Buffer; mimeType: string } | null = null;

    if (photoFile && photoFile instanceof File && photoFile.size > 0) {
      if (photoFile.size > appConfig.auth.maxPhotoBytes) {
        throw new ValidationError("Photo must be 4 MB or smaller");
      }
      if (!ALLOWED_PHOTO_TYPES.has(photoFile.type)) {
        throw new ValidationError("Photo must be JPG, PNG, or WEBP");
      }
      const buffer = Buffer.from(await photoFile.arrayBuffer());
      photo = { buffer, mimeType: photoFile.type };
    }

    const body = {
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      city: String(form.get("city") ?? ""),
      experience: String(form.get("experience") ?? ""),
      shopName: String(form.get("shopName") ?? ""),
      bio: String(form.get("bio") ?? ""),
      availability: String(form.get("availability") ?? ""),
      specialties: parseSpecialtiesField(form.get("specialties")),
      portfolio: String(form.get("portfolio") ?? ""),
      password: String(form.get("password") ?? ""),
      confirmPassword: String(form.get("confirmPassword") ?? ""),
      terms: parseBooleanField(form.get("terms")),
      barberAgreement: parseBooleanField(form.get("barberAgreement")),
    };

    const input = barberRegisterSchema.parse(body);
    return { input, photo };
  }

  const input = await parseBody(req, barberRegisterSchema);
  return { input, photo: null };
}

export const authController = {
  async register(req: NextRequest) {
    const input = await parseBody(req, customerRegisterSchema);
    await verifyTurnstile(input.turnstileToken);
    const data = await authService.registerCustomer(input);
    return created(data);
  },

  async barberRegister(req: NextRequest) {
    const { input, photo } = await parseBarberRegister(req);
    const data = await authService.registerBarber(input, photo);
    return created(data);
  },

  async login(req: NextRequest) {
    const input = await parseBody(req, loginSchema);
    await verifyTurnstile(input.turnstileToken);
    const data = await authService.login(input);
    return ok(data);
  },

  async google(req: NextRequest) {
    const input = await parseBody(req, googleAuthSchema);
    const data = await authService.googleSignIn(input);
    return ok(data);
  },

  async googleAuthorize(req: NextRequest) {
    const state = createGoogleOAuthState();
    const redirectUrl = buildGoogleAuthorizeUrl(req, state);
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
      ...oauthCookieOptions(),
      maxAge: 600,
    });
    return response;
  },

  async googleCallback(req: NextRequest) {
    const origin = getRequestOrigin(req);
    const loginUrl = new URL("/login", origin);
    const completeUrl = new URL("/login/google-complete", origin);
    const error = req.nextUrl.searchParams.get("error");
    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");
    const savedState = req.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

    const clearStateCookie = (response: NextResponse) => {
      response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, "", {
        ...oauthCookieOptions(),
        maxAge: 0,
      });
      return response;
    };

    if (error) {
      loginUrl.searchParams.set("error", "Google sign-in was cancelled.");
      return clearStateCookie(NextResponse.redirect(loginUrl));
    }

    if (!code || !state || !savedState || state !== savedState) {
      loginUrl.searchParams.set("error", "Google sign-in failed. Please try again.");
      return clearStateCookie(NextResponse.redirect(loginUrl));
    }

    try {
      const idToken = await exchangeGoogleCodeForIdToken(req, code);
      const data = await authService.googleSignIn({ idToken });
      const handoff = signGoogleHandoff(data);
      const response = NextResponse.redirect(completeUrl);
      clearStateCookie(response);
      response.cookies.set(GOOGLE_HANDOFF_COOKIE, handoff, {
        ...oauthCookieOptions(),
        maxAge: 120,
      });
      return response;
    } catch (err) {
      const message =
        err instanceof AppError
          ? err.message
          : "Google sign-in failed. Please try again.";
      loginUrl.searchParams.set("error", message);
      return clearStateCookie(NextResponse.redirect(loginUrl));
    }
  },

  async googleComplete(req: NextRequest) {
    const handoffToken = req.cookies.get(GOOGLE_HANDOFF_COOKIE)?.value;
    if (!handoffToken) {
      throw new UnauthorizedError("Google sign-in session expired. Please try again.");
    }

    const payload = verifyGoogleHandoff(handoffToken);
    const response = ok({
      user: payload.user,
      tokens: payload.tokens,
    });
    response.cookies.set(GOOGLE_HANDOFF_COOKIE, "", {
      ...oauthCookieOptions(),
      maxAge: 0,
    });
    return response;
  },

  async refresh(req: NextRequest) {
    const input = await parseBody(req, refreshTokenSchema);
    const data = await authService.refresh(input);
    return ok(data);
  },

  async forgotPassword(req: NextRequest) {
    const input = await parseBody(req, forgotPasswordSchema);
    await verifyTurnstile(input.turnstileToken);
    const data = await authService.forgotPassword(input);
    return ok(data);
  },

  async resetPassword(req: NextRequest) {
    const input = await parseBody(req, resetPasswordSchema);
    const data = await authService.resetPassword(input);
    return ok(data);
  },

  async verifyResetToken(req: NextRequest) {
    const input = await parseBody(req, verifyResetTokenSchema);
    const data = await authService.verifyResetToken(input);
    return ok(data);
  },

  async validateResetFlow(req: NextRequest) {
    const input = await parseBody(req, validateResetFlowSchema);
    const data = await authService.validateResetFlow(input);
    return ok(data);
  },

  async logout(req: NextRequest) {
    const data = await authService.logout();
    return ok(data);
  },
};
