import { hashPassword, verifyPassword } from "@/server/infra/auth/password";
import { authRepository } from "@/server/modules/auth/repository";
import { BadRequestError, UnprocessableError } from "@/server/modules/shared/helpers/AppError";
import type { UpdatePasswordInput } from "@/server/modules/shared/settings/schema";

export const userSettingsService = {
  async updatePassword(userId: string, input: UpdatePasswordInput) {
    const user = await authRepository.findById(userId);
    if (!user?.passwordHash) {
      throw new UnprocessableError("Password login is not configured for this account");
    }

    const valid = await verifyPassword(input.currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestError("Current password is incorrect");

    const passwordHash = await hashPassword(input.newPassword);
    await authRepository.updateUser(userId, { passwordHash });

    return { updated: true };
  },

  async deleteAccount(userId: string) {
    await authRepository.updateUser(userId, {
      isActive: false,
      refreshTokenHash: null,
      refreshTokenExpires: null,
    });

    return { deleted: true };
  },
};
