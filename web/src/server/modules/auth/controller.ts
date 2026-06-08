import type { NextRequest } from "next/server";
import { appConfig } from "@/server/config";
import { verifyTurnstile } from "@/server/infrastructure/security/turnstile";
import { authService } from "@/server/modules/auth/service";
import {
  barberRegisterSchema,
  customerRegisterSchema,
  forgotPasswordSchema,
  googleAuthSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  verifyResetTokenSchema,
} from "@/server/modules/auth/schema";
import { created, ok } from "@/server/shared/responses";
import { parseBody } from "@/server/shared/validation";
import { ValidationError } from "@/server/shared/errors/AppError";

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

  async logout(req: NextRequest) {
    const data = await authService.logout();
    return ok(data);
  },
};
