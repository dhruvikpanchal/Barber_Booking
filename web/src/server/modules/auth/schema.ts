import { z } from "zod";
import { BARBER_AVAILABILITY, BARBER_EXPERIENCE_TIERS } from "@/server/shared/constants/barber";
import { BARBER_SPECIALTIES_VALUES } from "@/server/shared/constants/barberSpecialties";

const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;

export const PASSWORD_RULES = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const passwordMatchRefine = {
  message: "Passwords do not match",
  path: ["confirmPassword"],
};

const turnstileTokenField = z.string().min(1).optional();

export const customerRegisterSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").max(50),
    lastName: z.string().trim().min(1, "Last name is required").max(50),
    email: z.string().email().toLowerCase(),
    phone: z.string().regex(PHONE_REGEX, "Invalid phone number").optional().or(z.literal("")),
    password: PASSWORD_RULES,
    confirmPassword: z.string(),
    turnstileToken: turnstileTokenField,
  })
  .refine((data) => data.password === data.confirmPassword, passwordMatchRefine);

export const barberRegisterSchema = z
  .object({
    firstName: z.string().trim().min(1).max(50),
    lastName: z.string().trim().min(1).max(50),
    email: z.string().email().toLowerCase(),
    phone: z.string().regex(PHONE_REGEX, "Invalid phone number").optional().or(z.literal("")),
    city: z.string().trim().max(100).optional().or(z.literal("")),
    experience: z.enum(BARBER_EXPERIENCE_TIERS),
    shopName: z.string().trim().max(120).optional().or(z.literal("")),
    bio: z.string().trim().max(200).optional().or(z.literal("")),
    availability: z
      .union([z.enum(BARBER_AVAILABILITY), z.literal("")])
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    specialties: z
      .array(z.string())
      .optional()
      .default([])
      .refine(
        (items) =>
          items.every((item) => (BARBER_SPECIALTIES_VALUES as readonly string[]).includes(item)),
        { message: "Invalid specialty selected" },
      ),
    portfolio: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
    password: PASSWORD_RULES,
    confirmPassword: z.string(),
    terms: z.coerce
      .boolean()
      .refine((v) => v === true, { message: "You must accept the Terms of Service" }),
    barberAgreement: z.coerce.boolean().refine((v) => v === true, {
      message: "You must acknowledge admin approval is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, passwordMatchRefine);

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  turnstileToken: turnstileTokenField,
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().toLowerCase(),
  turnstileToken: turnstileTokenField,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: PASSWORD_RULES,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, passwordMatchRefine);

export const verifyResetTokenSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required"),
});

export type CustomerRegisterInput = z.infer<typeof customerRegisterSchema>;
export type BarberRegisterInput = z.infer<typeof barberRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyResetTokenInput = z.infer<typeof verifyResetTokenSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
