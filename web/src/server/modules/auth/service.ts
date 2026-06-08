import { randomInt } from "node:crypto";
import type { Role } from "@/server/shared/constants/roles";
import { OAuth2Client } from "google-auth-library";
import { appConfig, env } from "@/server/config";
import { hashPassword, verifyPassword } from "@/server/infrastructure/auth/password";
import { verifyRefreshToken } from "@/server/infrastructure/auth/jwt";
import {
  sendBarberApplicationReceived,
  sendGoogleAccountConflict,
  sendMail,
  sendPasswordReset,
} from "@/server/infrastructure/mail/mailtrap";
import { uploadImage } from "@/server/infrastructure/storage/cloudinary";
import { authRepository } from "@/server/modules/auth/repository";
import { toAuthResponse } from "@/server/modules/auth/mapper";
import { getRefreshTokenExpiry, hashToken, issueTokenPair } from "@/server/modules/auth/tokens";
import type {
  BarberRegisterInput,
  CustomerRegisterInput,
  ForgotPasswordInput,
  GoogleAuthInput,
  LoginInput,
  RefreshTokenInput,
  ResetPasswordInput,
  VerifyResetTokenInput,
} from "@/server/modules/auth/schema";
import { BadRequestError, ConflictError, UnauthorizedError } from "@/server/shared/errors/AppError";
import { ROLES } from "@/server/shared/constants/roles";
import { BARBER_REQUEST_STATUS } from "@/server/shared/constants/statuses";
import { ok } from "@/server/shared/responses";

function fireAndForget(promise: Promise<unknown>): void {
  promise.catch((err) => console.error("[auth] async side-effect failed", err));
}

async function persistRefreshToken(userId: string, refreshToken: string) {
  await authRepository.updateUser(userId, {
    refreshTokenHash: hashToken(refreshToken),
    refreshTokenExpires: getRefreshTokenExpiry(),
  });
}

async function buildAuthResult(user: {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  photoUrl: string | null;
  isActive: boolean;
  passwordHash: string | null;
}) {
  if (!user.isActive) {
    if (user.role === ROLES.BARBER) {
      throw new UnauthorizedError("Your barber account is pending admin approval");
    }
    throw new UnauthorizedError("Account is deactivated");
  }

  const tokens = issueTokenPair(user.id, user.role);
  await persistRefreshToken(user.id, tokens.refreshToken);
  return toAuthResponse(user, tokens);
}

export const authService = {
  async registerCustomer(input: CustomerRegisterInput) {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) throw new ConflictError("Email already registered");

    const fullName = `${input.firstName} ${input.lastName}`.trim();
    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.createUser({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      fullName,
      phone: input.phone || null,
      passwordHash,
      role: ROLES.CUSTOMER,
      isActive: true,
      emailVerified: false,
    });

    fireAndForget(
      sendMail({
        to: user.email,
        subject: `Welcome to ${appConfig.name}`,
        html: `<p>Hi ${fullName},</p><p>Your account has been created. You can sign in and start booking.</p>`,
      }),
    );

    return buildAuthResult(user);
  },

  async registerBarber(
    input: BarberRegisterInput,
    photo?: { buffer: Buffer; mimeType: string } | null,
  ) {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) throw new ConflictError("Email already registered");

    const fullName = `${input.firstName} ${input.lastName}`.trim();
    const passwordHash = await hashPassword(input.password);

    let photoUrl: string | null = null;
    if (photo) {
      const uploaded = await uploadImage(
        photo.buffer,
        `${appConfig.cloudinary.defaultFolder}/avatars`,
        {
          resource_type: "image",
        },
      );
      photoUrl = uploaded.url;
    }

    const pending = await authRepository.hasPendingBarberRequest(input.email);
    if (pending) {
      throw new ConflictError("A barber application for this email is already pending review");
    }

    const { user, request } = await authRepository.createBarberApplication({
      user: {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        fullName,
        phone: input.phone || null,
        city: input.city || null,
        photoUrl,
        passwordHash,
        role: ROLES.BARBER,
        isActive: false,
        emailVerified: false,
      },
      request: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone || null,
        city: input.city || null,
        profilePhotoUrl: photoUrl,
        shopName: input.shopName || null,
        bio: input.bio || null,
        portfolioUrl: input.portfolio || null,
        experience: input.experience,
        availability: input.availability || null,
        specialties: input.specialties?.length ? input.specialties : undefined,
        status: BARBER_REQUEST_STATUS.PENDING,
      },
    });

    fireAndForget(sendBarberApplicationReceived({ to: user.email, ownerName: fullName }));
    fireAndForget(authRepository.notifyAdminsNewBarberRequest(request.id, fullName));

    return {
      message:
        "Application received. Our admin team will review your profile within 1–2 business days.",
      requestId: request.id,
    };
  },

  async login(input: LoginInput) {
    const user = await authRepository.findByEmail(input.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) throw new UnauthorizedError("Invalid email or password");

    return buildAuthResult(user);
  },

  async refresh(input: RefreshTokenInput) {
    const payload = verifyRefreshToken(input.refreshToken);
    const user = await authRepository.findById(payload.sub);
    if (!user || !user.isActive) throw new UnauthorizedError("Invalid refresh token");

    if (!user.refreshTokenHash || !user.refreshTokenExpires) {
      throw new UnauthorizedError("Invalid refresh token");
    }
    if (user.refreshTokenExpires < new Date()) {
      throw new UnauthorizedError("Refresh token expired");
    }
    if (user.refreshTokenHash !== hashToken(input.refreshToken)) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const tokens = issueTokenPair(user.id, user.role);
    await persistRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  },

  async forgotPassword(input: ForgotPasswordInput) {
    const user = await authRepository.findByEmail(input.email);
    if (!user) {
      return { message: "If that email exists, a reset link has been sent" };
    }

    if (!user.passwordHash) {
      fireAndForget(
        sendMail({
          to: user.email,
          subject: `Sign in with Google — ${appConfig.name}`,
          html: `<p>Hi ${user.fullName},</p><p>This account uses Google sign-in. Please use the Google button on the login page instead of resetting a password.</p>`,
        }),
      );
      return { message: "If that email exists, a reset link has been sent" };
    }

    const otp = randomInt(100000, 1_000_000).toString();
    const expires = new Date(Date.now() + appConfig.mail.passwordResetExpiresMinutes * 60 * 1000);

    await authRepository.updateUser(user.id, {
      passwordResetToken: hashToken(otp),
      passwordResetExpires: expires,
    });

    fireAndForget(sendPasswordReset(user.email, otp));
    return { message: "If that email exists, a reset link has been sent" };
  },

  async verifyResetToken(input: VerifyResetTokenInput) {
    const tokenHash = hashToken(input.token);
    const user = await authRepository.findByPasswordResetToken(tokenHash);

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestError("Invalid or expired OTP");
    }

    return { message: "Reset token is valid" };
  },

  async resetPassword(input: ResetPasswordInput) {
    const tokenHash = hashToken(input.token);
    const user = await authRepository.findByPasswordResetToken(tokenHash);
    if (!user) throw new BadRequestError("Invalid or expired reset token");

    const passwordHash = await hashPassword(input.password);
    await authRepository.updateUser(user.id, {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    return { message: "Password updated successfully. You can now sign in." };
  },

  async googleSignIn(input: GoogleAuthInput) {
    if (!env.GOOGLE_CLIENT_ID) {
      throw new BadRequestError("Google sign-in is not configured");
    }

    const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    let payload: { sub: string; email?: string; name?: string; picture?: string };
    try {
      const ticket = await client.verifyIdToken({
        idToken: input.idToken,
        audience: env.GOOGLE_CLIENT_ID,
      });
      const claims = ticket.getPayload();
      if (!claims?.sub || !claims.email) {
        throw new UnauthorizedError("Invalid Google token");
      }
      payload = {
        sub: claims.sub,
        email: claims.email.toLowerCase(),
        name: claims.name,
        picture: claims.picture,
      };
    } catch {
      throw new UnauthorizedError("Invalid or expired Google ID token");
    }

    let user = await authRepository.findByGoogleId(payload.sub);
    if (!user) {
      const byEmail = await authRepository.findByEmail(payload.email!);
      if (byEmail) {
        if (byEmail.role !== ROLES.CUSTOMER) {
          throw new ConflictError("Google login is available for customer accounts only");
        }
        if (byEmail.passwordHash) {
          fireAndForget(sendGoogleAccountConflict(byEmail.email));
          throw new ConflictError(
            "Email already registered with password — sign in with email instead",
          );
        }
        user = await authRepository.updateUser(byEmail.id, {
          googleId: payload.sub,
          emailVerified: true,
          photoUrl: byEmail.photoUrl ?? payload.picture ?? null,
        });
      } else {
        const fullName = payload.name?.trim() || payload.email!.split("@")[0]!;
        const nameParts = fullName.split(/\s+/).filter(Boolean);
        const firstName = nameParts[0] ?? "Customer";
        const lastName = nameParts.slice(1).join(" ") || "-";

        user = await authRepository.createUser({
          email: payload.email!,
          firstName,
          lastName,
          fullName,
          googleId: payload.sub,
          photoUrl: payload.picture ?? null,
          role: ROLES.CUSTOMER,
          isActive: true,
          emailVerified: true,
        });
      }
    }

    return buildAuthResult(user);
  },

  async logout() {
    return ok({ message: "Logged out successfully" });
  },
};
