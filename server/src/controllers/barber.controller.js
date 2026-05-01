import { prisma } from '../config/prismaClient.js';

// Utils
import {
  asyncHandler,
  ApiError,
  ApiResponse,
  getPaginationParams,
  paginationFn,
  formatSlot,
  parseDateUTC,
  getStartOfDayUTC,
  getEndOfDayUTC,
  getLast7DaysUTC,
} from '../utils/index.js';

// Helper Functions
import { VerifyAndUpdatePassword } from '../helpers/ChangePasswordHelper.js';
import { uploadProfileImage } from '../helpers/updateImageHelper.js';
import {
  checkUserAndRole,
  barberVerifyAndStatusCheck,
  generateSlotsForDate,
  findExistingService,
  findExistingSchedule,
  findExistingTimeSlot,
  findExistingBooking,
} from '../helpers/OnlyBarberHelper.js';

/*===========================================================================
                            Main Functions
=============================================================================*/

// [1] Get Barber Profile
export const getBarberProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      bio: true,
      specialty: true,
      location: true,
      status: true,
      averageRating: true,
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          imageUrl: true,
          isActive: true,
        },
      },
    },
  });

  if (!barber) throw new ApiError(404, 'Barber not found');

  const user = {
    barberId: barber.id,
    name: barber.user.name,
    email: barber.user.email,
    phone: barber.user.phone,
    imageUrl: barber.user.imageUrl,
    isActive: barber.user.isActive,

    bio: barber.bio,
    specialty: barber.specialty,
    location: barber.location,

    status: barber.status,
    averageRating: barber.averageRating,
  };

  return res.status(200).json(new ApiResponse(200, user, 'Barber profile fetched successfully'));
});

// [2] Update Barber Profile
export const updateBarberProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { name, phone, bio, specialty, location } = req.body;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!name && !phone && !bio && !specialty && !location)
    throw new ApiError(400, 'Atleast one field is required');

  if (phone && !/^[0-9]{10}$/.test(phone)) throw new ApiError(400, 'Invalid phone number');

  const result = await prisma.$transaction(async (tx) => {
    const updateUser = await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(name?.trim() && { name: name.trim() }),
        ...(phone?.trim() && { phone: phone.trim() }),
      },
      select: {
        name: true,
        phone: true,
        email: true,
        imageUrl: true,
      },
    });

    if (!updateUser) throw new ApiError(500, 'Error in Barber Profile Update in User table ');

    const updateBarber = await tx.barber.update({
      where: {
        userId,
      },
      data: {
        ...(bio?.trim() && { bio: bio.trim() }),
        ...(specialty?.trim() && { specialty: specialty.trim() }),
        ...(location?.trim() && { location: location.trim() }),
      },
      select: {
        bio: true,
        specialty: true,
        location: true,
        profilePhoto: true,
      },
    });

    if (!updateBarber) throw new ApiError(500, 'Error in Barber Profile Update in Barber table ');

    return { updateUser, updateBarber };
  });

  const user = {
    name: result.updateUser.name,
    email: result.updateUser.email,
    phone: result.updateUser.phone,
    imageUrl: result.updateUser.imageUrl,
    bio: result.updateBarber.bio,
    specialty: result.updateBarber.specialty,
    location: result.updateBarber.location,
    profilePhoto: result.updateBarber.profilePhoto,
  };

  return res.status(200).json(new ApiResponse(200, user, 'Barber profile updated successfully'));
});

// [3] Upload Barber Profile Image
export const uploadBarberProfileImage = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const user = await uploadProfileImage({
    userId: barber.userId,
    filePath: req?.file?.path,
    oldImageId: barber.imagePublicId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Barber profile image updated successfully'));
});

// [4] Change Password
export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { oldPassword, newPassword } = req.body;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  const existingBarber = await barberVerifyAndStatusCheck({ userId: userId });

  const user = await VerifyAndUpdatePassword({
    userId: existingBarber.userId,
    oldPassword: oldPassword,
    newPassword: newPassword,
    existingPasswordHash: existingBarber.passwordHash,
  });

  return res.status(200).json(new ApiResponse(200, user, 'Password changed successfully'));
});

// [5] Create Service
export const createService = asyncHandler(async (req, res) => {
  const { name, description, price, durationMinutes } = req.body;
  const userId = req.user?.id;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!name?.trim() || !description?.trim()) throw new ApiError(400, 'All fields are required');

  if (isNaN(price) || price <= 0) throw new ApiError(400, 'Invalid price');

  if (isNaN(durationMinutes) || durationMinutes <= 0) throw new ApiError(400, 'Invalid duration');

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const existingService = await prisma.service.findFirst({
    where: {
      barberId: barber.id,
      name: name.trim(),
    },
  });

  if (existingService) throw new ApiError(400, 'Service already exists');

  const service = await prisma.service.create({
    data: {
      barberId: barber.id,
      name: name?.trim(),
      description: description?.trim(),
      price: Number(price),
      durationMinutes: Number(durationMinutes),
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      durationMinutes: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(201).json(new ApiResponse(201, service, 'Service added successfully'));
});

// [6] Update Service
export const updateService = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const serviceId = Number(req.params?.id);
  const { name, description, price, durationMinutes } = req.body;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!serviceId || isNaN(serviceId)) throw new ApiError(400, 'Invalid service Id');

  if (!name && !description && price == null && durationMinutes == null)
    throw new ApiError(400, 'At least one field is required');

  const parsedPrice = price != null ? Number(price) : undefined;
  const parsedDuration = durationMinutes != null ? Number(durationMinutes) : undefined;

  if (parsedPrice !== undefined && (isNaN(parsedPrice) || parsedPrice <= 0))
    throw new ApiError(400, 'Invalid price');

  if (parsedDuration !== undefined && (isNaN(parsedDuration) || parsedDuration <= 0))
    throw new ApiError(400, 'Invalid duration');

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const existingService = await findExistingService({
    serviceId: serviceId,
    barberId: barber.id,
    client: prisma,
  });

  const service = await prisma.service.update({
    where: {
      id: existingService.id,
    },
    data: {
      ...(name?.trim() && { name: name.trim() }),
      ...(description?.trim() && { description: description.trim() }),
      ...(parsedPrice !== undefined && { price: parsedPrice }),
      ...(parsedDuration !== undefined && { durationMinutes: parsedDuration }),
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      durationMinutes: true,
      isActive: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(new ApiResponse(200, service, 'Service updated successfully'));
});

// [7] Toggle Service
export const toggleServiceStatus = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const serviceId = Number(req.params?.id);
  const { status } = req.body;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!serviceId || isNaN(serviceId)) throw new ApiError(400, 'Invalid service Id');

  if (status === null || status === undefined) throw new ApiError(400, 'Status is required');

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const existingService = await findExistingService({
    serviceId: serviceId,
    barberId: barber.id,
    client: prisma,
  });

  const service = await prisma.service.update({
    where: { id: existingService.id },
    data: { isActive: status },
    select: {
      id: true,
      name: true,
      isActive: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(new ApiResponse(200, service, 'Service status updated successfully'));
});

// [8] Delete Service
export const deleteService = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const serviceId = Number(req.params?.id);

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!serviceId || isNaN(serviceId)) throw new ApiError(400, 'Invalid service Id');

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const existingService = await findExistingService({
    serviceId: serviceId,
    barberId: barber.id,
    client: prisma,
  });

  const activeBookings = await prisma.booking.count({
    where: {
      serviceId: existingService.id,
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
    },
  });

  if (activeBookings > 0) throw new ApiError(400, 'Cannot delete service with active bookings');

  const service = await prisma.service.delete({
    where: {
      id: serviceId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return res.status(200).json(new ApiResponse(200, service, 'Service deleted successfully'));
});

// [9] Get Services
export const getServices = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { page, limit, skip } = getPaginationParams({
    page: req.query?.page,
    limit: req.query?.limit,
  });

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const services = await prisma.service.findMany({
    where: {
      barberId: barber.id,
    },
    select: {
      id: true,
      name: true,
      price: true,
      durationMinutes: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
    skip: skip,
    take: limit,
  });

  const total = await prisma.service.count({ where: { barberId: barber.id } });

  const pagination = paginationFn({ total: total, page: page, limit: limit });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { services, pagination },
        services.length ? 'Services fetched successfully' : 'No services found',
      ),
    );
});

// [10] Create Schedule
export const createSchedule = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { dayOfWeek, startTime, endTime, isDayOff } = req.body;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (dayOfWeek == null || !startTime || !endTime || typeof isDayOff !== 'boolean')
    throw new ApiError(400, 'All fields are required');

  if (dayOfWeek < 0 || dayOfWeek > 6) throw new ApiError(400, 'Invalid dayOfWeek (0-6)');

  if (startTime >= endTime) throw new ApiError(400, 'Start time must be before end time');

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const existingSchedule = await prisma.schedule.findFirst({
    where: { barberId: barber.id, dayOfWeek },
  });

  if (existingSchedule) throw new ApiError(400, 'Schedule already exists for this day');

  const schedule = await prisma.schedule.create({
    data: {
      barberId: barber.id,
      dayOfWeek,
      startTime: new Date(`1970-01-01T${startTime}Z`),
      endTime: new Date(`1970-01-01T${endTime}Z`),
      isDayOff,
    },
    select: {
      id: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      isDayOff: true,
    },
  });

  return res.status(201).json(new ApiResponse(201, schedule, 'Schedule set successfully'));
});

// [11] Update Schedule
export const updateSchedule = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const scheduleId = Number(req.params?.id);
  const { dayOfWeek, startTime, endTime, isDayOff } = req.body;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!scheduleId || isNaN(scheduleId)) throw new ApiError(400, 'Invalid schedule Id');

  if (
    dayOfWeek === undefined &&
    startTime === undefined &&
    endTime === undefined &&
    isDayOff === undefined
  ) {
    throw new ApiError(400, 'At least one field is required');
  }

  if (dayOfWeek !== undefined && (dayOfWeek < 0 || dayOfWeek > 6)) {
    throw new ApiError(400, 'Invalid dayOfWeek (0-6)');
  }

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const existingSchedule = await findExistingSchedule({
    scheduleId: scheduleId,
    barberId: barber.id,
    client: prisma,
  });

  if (dayOfWeek !== undefined) {
    const duplicate = await prisma.schedule.findFirst({
      where: {
        barberId: barber.id,
        dayOfWeek,
        NOT: { id: scheduleId },
      },
    });

    if (duplicate) {
      throw new ApiError(400, 'Schedule already exists for this day');
    }
  }

  const finalStartTime = startTime
    ? new Date(`1970-01-01T${startTime}Z`)
    : existingSchedule.startTime;

  const finalEndTime = endTime ? new Date(`1970-01-01T${endTime}Z`) : existingSchedule.endTime;

  if (finalStartTime >= finalEndTime) {
    throw new ApiError(400, 'Start time must be before end time');
  }

  // Update schedule
  const schedule = await prisma.schedule.update({
    where: { id: scheduleId },
    data: {
      ...(dayOfWeek !== undefined && { dayOfWeek }),
      ...(startTime && { startTime: finalStartTime }),
      ...(endTime && { endTime: finalEndTime }),
      ...(isDayOff !== undefined && { isDayOff }),
    },
    select: {
      id: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      isDayOff: true,
    },
  });

  return res.status(200).json(new ApiResponse(200, schedule, 'Schedule updated successfully'));
});

// [12] Delete Schedule
export const deleteSchedule = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const scheduleId = Number(req.params?.id);

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!scheduleId || isNaN(scheduleId)) {
    throw new ApiError(400, 'Invalid schedule Id');
  }

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const existingSchedule = await findExistingSchedule({
    scheduleId: scheduleId,
    barberId: barber.id,
    client: prisma,
  });

  const schedule = await prisma.schedule.delete({
    where: {
      id: existingSchedule.id,
    },
    select: {
      id: true,
      dayOfWeek: true,
    },
  });

  return res.status(200).json(new ApiResponse(200, schedule, 'Schedule deleted successfully'));
});

// [13] Get Schedules
export const getSchedules = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { page, limit, skip } = getPaginationParams({
    page: req.query?.page,
    limit: req.query?.limit,
  });

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const schedules = await prisma.schedule.findMany({
    where: {
      barberId: barber.id,
    },
    orderBy: { startTime: 'asc' },
    skip: skip,
    take: limit,
  });

  const total = await prisma.schedule.count({ where: { barberId: barber.id } });
  const pagination = paginationFn({ total: total, page: page, limit: limit });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { schedules, pagination },
        schedules.length ? 'Schedules fetched successfully' : 'No schedules found',
      ),
    );
});

// [14] Create Time Slot
export const createTimeSlot = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { date } = req.body;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!date) {
    throw new ApiError(400, 'Date is required');
  }

  const parsedDate = parseDateUTC({ dateStr: date });

  const dayOfWeek = parsedDate.getUTCDay();

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const schedule = await prisma.schedule.findFirst({
    where: {
      barberId: barber.id,
      dayOfWeek,
    },
  });

  if (!schedule) {
    throw new ApiError(400, 'No schedule found for this day');
  }

  if (schedule.isDayOff) {
    throw new ApiError(400, 'Barber is off on this day');
  }

  const existingCount = await prisma.timeSlot.count({
    where: {
      barberId: barber.id,
      slotDate: parsedDate,
    },
  });

  if (existingCount > 0) {
    throw new ApiError(400, 'Time slots already generated for this date');
  }

  const slots = generateSlotsForDate({ barberId: barber.id, date: parsedDate, schedule: schedule });

  if (!slots || slots.length === 0) {
    throw new ApiError(400, 'No slots generated');
  }

  const result = await prisma.timeSlot.createMany({
    data: slots,
    skipDuplicates: true,
  });

  return res.status(201).json(new ApiResponse(201, result, 'Time slots created successfully'));
});

// [15] Creat Bulk Time Slots
export const createBulkTimeSlots = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { dates } = req.body;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!dates || !Array.isArray(dates) || dates.length === 0) {
    throw new ApiError(400, 'Dates are required');
  }

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  let allSlots = [];
  let skippedDates = [];

  for (const dateStr of dates) {
    const parsedDate = parseDateUTC({ dateStr: dateStr });

    const dayOfWeek = parsedDate.getUTCDay();

    const schedule = await prisma.schedule.findFirst({
      where: {
        barberId: barber.id,
        dayOfWeek,
      },
    });

    if (!schedule) {
      skippedDates.push({ date: dateStr, reason: 'No schedule' });
      continue;
    }

    if (schedule.isDayOff) {
      skippedDates.push({ date: dateStr, reason: 'Day off' });
      continue;
    }

    const existingCount = await prisma.timeSlot.count({
      where: {
        barberId: barber.id,
        slotDate: parsedDate,
      },
    });

    if (existingCount > 0) {
      skippedDates.push({ date: dateStr, reason: 'Already exists' });
      continue;
    }

    const slots = generateSlotsForDate({
      barberId: barber.id,
      date: parsedDate,
      schedule: schedule,
    });

    if (slots.length) {
      allSlots.push(...slots);
    } else {
      skippedDates.push({ date: dateStr, reason: 'No slots generated' });
    }
  }

  if (allSlots.length === 0) {
    throw new ApiError(400, 'No valid slots to create');
  }

  const result = await prisma.timeSlot.createMany({
    data: allSlots,
    skipDuplicates: true,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        totalCreated: result.count,
        totalRequested: dates.length,
        skippedDates,
      },
      'Bulk time slots created successfully',
    ),
  );
});

// [16] Get Time Slots
export const getTimeSlots = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const date = req.query?.date;
  const { page, limit, skip } = getPaginationParams({
    page: req.query?.page,
    limit: req.query?.limit,
  });

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!date) {
    throw new ApiError(400, 'Date is required');
  }

  const parsedDate = parseDateUTC({ dateStr: date });

  const startOfDay = getStartOfDayUTC({ date: parsedDate });
  const endOfDay = getEndOfDayUTC({ date: parsedDate });

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const [result, total] = await Promise.all([
    prisma.timeSlot.findMany({
      where: {
        barberId: barber.id,
        slotDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { startTime: 'asc' },
      skip: skip,
      take: limit,
      select: {
        id: true,
        slotDate: true,
        startTime: true,
        endTime: true,
        status: true,
        barberId: true,
      },
    }),

    prisma.timeSlot.count({
      where: {
        barberId: barber.id,
        slotDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),
  ]);

  const pagination = paginationFn({ total: total, page: page, limit: limit });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { result, pagination },
        result.length ? 'Time slots fetched successfully' : 'No time slots found',
      ),
    );
});

// [17] Update Time Slot
export const updateTimeSlot = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const slotId = Number(req.params?.id);
  const { date, status } = req.body;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!slotId || isNaN(slotId)) {
    throw new ApiError(400, 'Invalid slot Id');
  }

  if (date === undefined && status === undefined) {
    throw new ApiError(400, 'At least one field is required');
  }

  const validStatus = ['AVAILABLE', 'BLOCKED', 'ONLINE_BOOKED', 'WALKIN'];
  if (status !== undefined && !validStatus.includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const existingTimeSlot = await findExistingTimeSlot({
    slotId: slotId,
    barberId: barber.id,
    client: prisma,
  });

  // Prevent update if booked
  if (existingTimeSlot.status === 'ONLINE_BOOKED' || existingTimeSlot.status === 'WALKIN') {
    throw new ApiError(400, 'Booked slot cannot be modified');
  }

  let updatedData = {};

  if (date !== undefined) {
    const parsedDate = parseDateUTC({ dateStr: date });

    const today = new Date();
    const todayUTC = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
    );

    if (parsedDate < todayUTC) {
      throw new ApiError(400, 'Cannot move slot to past date');
    }

    updatedData.slotDate = parsedDate;
  }

  if (status !== undefined) {
    updatedData.status = status;
  }

  const result = await prisma.timeSlot.update({
    where: { id: slotId },
    data: updatedData,
    select: {
      id: true,
      slotDate: true,
      startTime: true,
      endTime: true,
      status: true,
    },
  });

  return res.status(200).json(new ApiResponse(200, result, 'Time slot updated successfully'));
});

// [18] Delete Time Slot
export const deleteTimeSlot = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const slotId = Number(req.params?.id);

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!slotId || isNaN(slotId)) {
    throw new ApiError(400, 'Invalid slot Id');
  }

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const existingTimeSlot = await findExistingTimeSlot({
    slotId: slotId,
    barberId: barber.id,
    client: prisma,
  });

  if (existingTimeSlot.status !== 'AVAILABLE' && existingTimeSlot.status !== 'BLOCKED') {
    throw new ApiError(400, 'Cannot delete booked or walk-in slot');
  }

  const result = await prisma.timeSlot.delete({
    where: {
      id: slotId,
    },
    select: {
      id: true,
    },
  });

  if (!result) {
    throw new ApiError(500, 'Failed to delete time slot');
  }

  return res.status(200).json(new ApiResponse(200, result, 'Time slot deleted successfully'));
});

// [19] Get Bookings
export const getBookings = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { page, limit, skip } = getPaginationParams({
    page: req.query?.page,
    limit: req.query?.limit,
  });

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where: {
        barberId: barber.id,
      },
      orderBy: { bookedAt: 'desc' },
      skip: skip,
      take: limit,
      select: {
        id: true,
        bookedAt: true,
        status: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            imageUrl: true,
          },
        },

        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },

        slot: {
          select: {
            slotDate: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    }),

    prisma.booking.count({ where: { barberId: barber.id } }),
  ]);

  const pagination = paginationFn({ total: total, page: page, limit: limit });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { bookings, pagination },
        bookings.length ? 'Bookings list fetched successfully' : 'No bookings found',
      ),
    );
});

// [20] Update Booking Status
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const bookingId = Number(req.params?.id);
  const { status } = req.body;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!bookingId || isNaN(bookingId)) {
    throw new ApiError(400, 'Invalid booking Id');
  }

  if (!status) {
    throw new ApiError(400, 'Status is required');
  }

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const booking = await findExistingBooking({
    bookingId: bookingId,
    barberId: barber.id,
    client: prisma,
  });

  const allowedStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
    throw new ApiError(400, 'Cannot update finalized booking');
  }

  if (booking.status === status) {
    return res.status(200).json(new ApiResponse(200, booking, 'Booking already in this status'));
  }

  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status,
    },
    select: {
      id: true,
      status: true,
      updatedAt: true,
    },
  });

  if (!result) {
    throw new ApiError(500, 'Failed to update booking status');
  }

  return res.status(200).json(new ApiResponse(200, result, 'Booking status updated successfully'));
});

// [21] Get Booking by Id
export const getBookingById = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const bookingId = Number(req.params?.id);

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!bookingId || isNaN(bookingId)) {
    throw new ApiError(400, 'Invalid booking Id');
  }

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      barberId: barber.id,
    },
    select: {
      id: true,
      bookedAt: true,
      status: true,
      notes: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          imageUrl: true,
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
          slotDate: true,
          startTime: true,
          endTime: true,
          status: true,
        },
      },
    },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking?.slot) {
    booking.slot = formatSlot({ slot: booking.slot });
  }

  return res.status(200).json(new ApiResponse(200, booking, 'Booking fetched successfully'));
});

// [22] Delete Booking
export const deleteBooking = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const bookingId = Number(req.params?.id);

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (!bookingId || isNaN(bookingId)) {
    throw new ApiError(400, 'Invalid booking Id');
  }

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const booking = await findExistingBooking({
    bookingId: bookingId,
    barberId: barber.id,
    client: prisma,
  });

  if (booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED') {
    throw new ApiError(400, 'Only CANCELLED or COMPLETED bookings can be deleted');
  }

  const result = await prisma.booking.delete({
    where: {
      id: booking.id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!result) {
    throw new ApiError(500, 'Failed to delete booking');
  }

  return res.status(200).json(new ApiResponse(200, result, 'Booking deleted successfully'));
});

// [23] Toggle Availability
export const toggleAvailability = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status } = req.body;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  if (typeof status !== 'boolean') {
    throw new ApiError(400, 'Status must be true or false');
  }

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const result = await prisma.barber.update({
    where: {
      id: barber.id,
    },
    data: {
      isAvailable: status,
    },
    select: {
      id: true,
      isAvailable: true,
      status: true,
      updatedAt: true,
    },
  });

  if (!result) {
    throw new ApiError(500, 'Failed to toggle availability');
  }

  return res.status(200).json(new ApiResponse(200, result, 'Availability toggled successfully'));
});

// [24] Get Dashboard Stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });
  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const today = new Date();

  const startOfDay = getStartOfDayUTC({ date: today });
  const endOfDay = getEndOfDayUTC({ date: today });

  const last7Days = getLast7DaysUTC({ inputDate: today });

  const [
    todayBookings,
    todayCompleted,
    todayCancelled,

    ratingStats,
    ratingDistribution,

    topServices,

    totalSlots,
    bookedSlots,

    trendBookings,

    totalCustomers,
    repeatCustomers,
  ] = await Promise.all([
    prisma.booking.count({
      where: {
        barberId: barber.id,
        bookedAt: { gte: startOfDay, lte: endOfDay },
      },
    }),

    prisma.booking.count({
      where: {
        barberId: barber.id,
        status: 'COMPLETED',
        bookedAt: { gte: startOfDay, lte: endOfDay },
      },
    }),

    prisma.booking.count({
      where: {
        barberId: barber.id,
        status: 'CANCELLED',
        bookedAt: { gte: startOfDay, lte: endOfDay },
      },
    }),

    prisma.review.aggregate({
      where: { barberId: barber.id },
      _avg: { rating: true },
      _count: { rating: true },
    }),

    prisma.review.groupBy({
      by: ['rating'],
      _count: { rating: true },
      where: { barberId: barber.id },
    }),

    prisma.booking.groupBy({
      by: ['serviceId'],
      _count: { id: true },
      where: { barberId: barber.id },
      orderBy: {
        _count: { id: 'desc' },
      },
      take: 5,
    }),

    prisma.timeSlot.count({
      where: { barberId: barber.id },
    }),

    prisma.timeSlot.count({
      where: {
        barberId: barber.id,
        status: {
          in: ['ONLINE_BOOKED', 'WALKIN'],
        },
      },
    }),

    prisma.booking.groupBy({
      by: ['bookedAt'],
      _count: { id: true },
      where: {
        barberId: barber.id,
        bookedAt: { gte: last7Days },
      },
      orderBy: { bookedAt: 'asc' },
    }),

    prisma.booking.groupBy({
      by: ['userId'],
      _count: { id: true },
      where: { barberId: barber.id },
    }),

    prisma.booking.groupBy({
      by: ['userId'],
      _count: { id: true },
      where: { barberId: barber.id },
      having: {
        id: { _count: { gt: 1 } },
      },
    }),
  ]);

  const ratingsFormatted = {
    average: ratingStats._avg.rating || 0,
    totalReviews: ratingStats._count.rating || 0,
    distribution: ratingDistribution.reduce((acc, r) => {
      acc[r.rating] = r._count.rating;
      return acc;
    }, {}),
  };

  const slotUtilization = {
    totalSlots,
    bookedSlots,
    availableSlots: totalSlots - bookedSlots,
    utilizationRate: totalSlots > 0 ? ((bookedSlots / totalSlots) * 100).toFixed(1) + '%' : '0%',
  };

  const customerInsights = {
    totalCustomers: totalCustomers.length,
    repeatCustomers: repeatCustomers.length,
  };

  const result = {
    overview: {
      todayBookings,
      todayCompleted,
      todayCancelled,
    },

    ratings: ratingsFormatted,

    topServices,

    slots: slotUtilization,

    trends: trendBookings,

    customers: customerInsights,
  };

  return res.status(200).json(new ApiResponse(200, result, 'Dashboard stats fetched successfully'));
});

// [25] Get All Reviews
export const getAllReviews = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { page, limit, skip } = getPaginationParams({
    page: req.query?.page,
    limit: req.query?.limit,
  });

  checkUserAndRole({ userId: req.user?.id, userRole: req.user?.role });

  const barber = await barberVerifyAndStatusCheck({ userId: userId });

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: {
        barberId: barber.id,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,

        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },

        booking: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),

    prisma.review.count({
      where: { barberId: barber.id },
    }),
  ]);

  const pagination = paginationFn({ total: total, page: page, limit: limit });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { reviews, pagination },
        reviews.length ? 'Reviews list fetched successfully' : 'No reviews found',
      ),
    );
});
