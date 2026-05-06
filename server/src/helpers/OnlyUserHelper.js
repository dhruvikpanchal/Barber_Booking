import { prisma } from '../config/prismaClient.js';
import { ApiError } from '../utils/index.js';

// Check req.user.id and req.user.role from req.user
export const checkUserAndRole = ({ userId, userRole }) => {
  if (!userId) {
    throw new ApiError(401, 'Unauthorized User');
  }

  if (userRole !== 'USER') {
    throw new ApiError(403, 'Access denied');
  }
};

// User verify and status check
export const userVerifyAndStatusCheck = async ({ userId }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      isActive: true,
      imagePublicId: true,
      imageUrl: true,
      passwordHash: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'User is not active');
  }

  return user;
};

// barber verify and status check
export const barberVerifyAndStatusCheck = async ({ barberId }) => {
  const barber = await prisma.barber.findUnique({
    where: { id: barberId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!barber) {
    throw new ApiError(404, 'Barber not found');
  }

  if (barber.status !== 'APPROVED') {
    throw new ApiError(403, 'Barber not approved');
  }

  return barber;
};

// helper function for api [9] & [10]
export const validateRating = ({ rating }) => {
  const r = Number(rating);
  if (!(r >= 1 && r <= 5)) throw new ApiError(400, 'Rating must be an integer between 1 and 5');

  return Number(r.toFixed(1));
};
