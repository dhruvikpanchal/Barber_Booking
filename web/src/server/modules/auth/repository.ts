import { and, eq, gt } from "drizzle-orm";
import { db, barberRequests, notifications, users } from "@/server/db";
import { NOTIFICATION_TYPE } from "@/server/shared/constants/notificationTypes";
import { ROLES } from "@/server/shared/constants/roles";
import { BARBER_REQUEST_STATUS } from "@/server/shared/constants/statuses";
import type { Role } from "@/server/shared/constants/roles";

export type CreateUserInput = {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string | null;
  city?: string | null;
  photoUrl?: string | null;
  passwordHash?: string | null;
  role: Role;
  isActive: boolean;
  emailVerified: boolean;
  googleId?: string | null;
};

export type CreateBarberRequestInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  profilePhotoUrl?: string | null;
  shopName?: string | null;
  bio?: string | null;
  portfolioUrl?: string | null;
  experience: string;
  availability?: string | null;
  specialties?: string[] | null;
  status: typeof BARBER_REQUEST_STATUS.PENDING;
};

export type UpdateUserInput = Partial<{
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  city: string | null;
  photoUrl: string | null;
  passwordHash: string | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  refreshTokenHash: string | null;
  refreshTokenExpires: Date | null;
  googleId: string | null;
  emailVerified: boolean;
  isActive: boolean;
}>;

export const authRepository = {
  findByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });
  },

  findById(id: string) {
    return db.query.users.findFirst({
      where: eq(users.id, id),
    });
  },

  findByGoogleId(googleId: string) {
    return db.query.users.findFirst({
      where: eq(users.googleId, googleId),
    });
  },

  findByPasswordResetToken(tokenHash: string) {
    return db.query.users.findFirst({
      where: and(
        eq(users.passwordResetToken, tokenHash),
        gt(users.passwordResetExpires, new Date()),
      ),
    });
  },

  async createUser(data: CreateUserInput) {
    const [user] = await db
      .insert(users)
      .values({
        email: data.email.toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName,
        phone: data.phone ?? null,
        city: data.city ?? null,
        photoUrl: data.photoUrl ?? null,
        passwordHash: data.passwordHash ?? null,
        role: data.role,
        isActive: data.isActive,
        emailVerified: data.emailVerified,
        googleId: data.googleId ?? null,
      })
      .returning();
    return user!;
  },

  async createBarberApplication(params: {
    user: CreateUserInput;
    request: CreateBarberRequestInput;
  }) {
    return db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email: params.user.email.toLowerCase(),
          firstName: params.user.firstName,
          lastName: params.user.lastName,
          fullName: params.user.fullName,
          phone: params.user.phone ?? null,
          city: params.user.city ?? null,
          photoUrl: params.user.photoUrl ?? null,
          passwordHash: params.user.passwordHash ?? null,
          role: params.user.role,
          isActive: params.user.isActive,
          emailVerified: params.user.emailVerified,
        })
        .returning();

      const [request] = await tx
        .insert(barberRequests)
        .values({
          firstName: params.request.firstName,
          lastName: params.request.lastName,
          email: params.request.email.toLowerCase(),
          phone: params.request.phone ?? null,
          city: params.request.city ?? null,
          profilePhotoUrl: params.request.profilePhotoUrl ?? null,
          shopName: params.request.shopName ?? null,
          bio: params.request.bio ?? null,
          portfolioUrl: params.request.portfolioUrl ?? null,
          experience: params.request.experience,
          availability: params.request.availability ?? null,
          specialties: params.request.specialties ?? null,
          status: params.request.status,
        })
        .returning();

      return { user: user!, request: request! };
    });
  },

  async updateUser(id: string, data: UpdateUserInput) {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user!;
  },

  async notifyAdminsNewBarberRequest(requestId: string, ownerName: string) {
    const admins = await db.query.users.findMany({
      where: and(eq(users.role, ROLES.ADMIN), eq(users.isActive, true)),
      columns: { id: true },
    });
    if (admins.length === 0) return;

    await db.insert(notifications).values(
      admins.map((admin) => ({
        userId: admin.id,
        type: NOTIFICATION_TYPE.BARBER_REQUEST_SUBMITTED,
        title: "New barber application",
        message: `${ownerName} submitted a barber registration application.`,
        metadata: { requestId },
      })),
    );
  },

  hasPendingBarberRequest(email: string) {
    return db.query.barberRequests.findFirst({
      where: and(
        eq(barberRequests.email, email.toLowerCase()),
        eq(barberRequests.status, BARBER_REQUEST_STATUS.PENDING),
      ),
    });
  },
};
