import { prisma } from '../config/prismaClient.js';
import { ApiError, formatSlot } from '../utils/index.js';

// Check req.user.id and req.user.role from req.user
export const checkUserAndRole = ({ userId, userRole }) => {
  if (!userId) {
    throw new ApiError(401, 'Unauthorized User');
  }

  if (userRole !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }
};

// barber verify and status check
export const barberVerifyAndStatusCheck = async ({ userId }) => {
  const barberRowData = await prisma.barber.findUnique({
    where: { userId },
    select: {
      id: true,
      status: true,
      user: {
        select: {
          id: true,
          isActive: true,
          imagePublicId: true,
          imageUrl: true,
          passwordHash: true,
        },
      },
    },
  });

  if (!barberRowData) {
    throw new ApiError(404, 'Barber not found');
  }

  if (!barberRowData.user?.isActive) {
    throw new ApiError(403, 'User account is inactive');
  }

  if (barberRowData.status !== 'APPROVED') {
    throw new ApiError(403, 'Barber not approved');
  }

  const barber = {
    id: barberRowData?.id,
    status: barberRowData?.status,
    userId: barberRowData?.user?.id,
    isActive: barberRowData?.user?.isActive,
    imagePublicId: barberRowData?.user?.imagePublicId,
    imageUrl: barberRowData?.user?.imageUrl,
    passwordHash: barberRowData?.user?.passwordHash,
  };

  return barber;
};

// helper functions for api [14] & [15]
export function generateSlotsForDate({ barberId, date, schedule }) {
  const slots = [];
  const SLOT_DURATION = 30;

  const start = new Date(schedule.startTime);
  const end = new Date(schedule.endTime);

  const startHour = start.getUTCHours();
  const startMin = start.getUTCMinutes();
  const endHour = end.getUTCHours();
  const endMin = end.getUTCMinutes();

  const baseDate = new Date(date);

  let current = new Date(
    Date.UTC(
      baseDate.getUTCFullYear(),
      baseDate.getUTCMonth(),
      baseDate.getUTCDate(),
      startHour,
      startMin,
      0,
      0,
    ),
  );

  const endTime = new Date(
    Date.UTC(
      baseDate.getUTCFullYear(),
      baseDate.getUTCMonth(),
      baseDate.getUTCDate(),
      endHour,
      endMin,
      0,
      0,
    ),
  );

  if (current >= endTime) {
    return [];
  }

  while (current < endTime) {
    const next = new Date(current.getTime() + SLOT_DURATION * 60000);

    slots.push({
      barberId,
      slotDate: new Date(
        Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate()),
      ),
      startTime: new Date(current),
      endTime: new Date(next),
      status: 'AVAILABLE',
    });

    current = next;
  }

  if (!slots.length) {
    throw new ApiError(400, 'No slots generated from helper function');
  }

  return slots;
}

// helper function for api [6] , [7] and [8]
export const findExistingService = async ({ serviceId, barberId, client = prisma }) => {
  const existingService = await client.service.findFirst({
    where: { id: serviceId, barberId },
    select: { id: true, name: true, isActive: true },
  });

  if (!existingService) throw new ApiError(404, 'Service not found');

  return existingService;
};

// helper function for api [11] and [12]
export const findExistingSchedule = async ({ scheduleId, barberId, client = prisma }) => {
  const existingSchedule = await client.schedule.findFirst({
    where: {
      id: scheduleId,
      barberId: barberId,
    },
  });

  if (!existingSchedule) {
    throw new ApiError(404, 'Schedule not found');
  }

  return existingSchedule;
};

// helper function for api [17] and [18]
export const findExistingTimeSlot = async ({ slotId, barberId, client = prisma }) => {
  const existingTimeSlot = await client.timeSlot.findFirst({
    where: {
      id: slotId,
      barberId: barberId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existingTimeSlot) {
    throw new ApiError(404, 'Time slot not found');
  }

  return existingTimeSlot;
};

// helper function for api [19] and [21]
export const formatBookingResponse = ({ booking }) => ({
  ...booking,
  slot: booking.slot ? formatSlot({ slot: booking.slot }) : null,
});

// helper function for api [20] and [22]
export const findExistingBooking = async ({ bookingId, barberId, client = prisma }) => {
  const existingBooking = await client.booking.findFirst({
    where: {
      id: bookingId,
      barberId: barberId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existingBooking) {
    throw new ApiError(404, 'Booking not found');
  }

  return existingBooking;
};

// helper function for api [27]
export const earningsPeriodKeyUTC = ({ date, groupBy }) => {
  const d = new Date(date);
  if (groupBy === 'month') {
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  }
  const dow = d.getUTCDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() + mondayOffset);
  monday.setUTCHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
};
