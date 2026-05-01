import { prisma } from '../config/prismaClient.js';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/core/ApiError.js';

export const VerifyAndUpdatePassword = async ({
  userId,
  oldPassword,
  newPassword,
  existingPasswordHash,
}) => {
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, 'Old password and new password are required');
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, existingPasswordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid old password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return updatedUser;
};
