import { ApiError } from '../utils/index.js';
import { prisma } from '../config/prismaClient.js';

export const USER_PUBLIC_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  isActive: true,
  isEmailVerified: true,
  imageUrl: true,
  provider: true,
  createdAt: true,
  updatedAt: true,
};

export const bookingListInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      imageUrl: true,
    },
  },
  barber: {
    select: {
      id: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  },
  service: {
    select: {
      id: true,
      name: true,
      price: true,
      durationMinutes: true,
    },
  },
  slot: {
    select: {
      id: true,
      slotDate: true,
      startTime: true,
      endTime: true,
      status: true,
    },
  },
};

export const parseBoolQuery = (value) => {
  if (value === undefined || value === '') return undefined;
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  return undefined;
};

export const monthKeyUTC = (date) => {
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
};

export const mailgenBarberNotice = ({ name, intro }) => ({
  body: {
    name,
    intro,
    outro: 'Thank you for using Barber Booking.',
  },
});

export const assertAdminNotSelf = ({ adminUserId, targetUserId }) => {
  if (Number(adminUserId) === Number(targetUserId)) {
    throw new ApiError(403, 'You cannot modify your own account with this action');
  }
};

export const verifyAdmin = async ({ adminId, client = prisma }) => {
  const admin = await client.user.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      imageUrl: true,
      imagePublicId: true,
      passwordHash: true,
    },
  });

  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  return admin;
};
