import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { paginationFn } from '../utils/Pagination.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/claudinary.js';

const prisma = new PrismaClient();

// [1] Get Barber Profile
export const getBarberProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

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

  if (!barber) {
    throw new ApiError(404, 'Barber not found');
  }

  const user = {
    id: barber.id,
    name: barber.user.name,
    email: barber.user.email,
    phone: barber.user.phone,
    imageUrl: barber.user.imageUrl,
    isActive: barber.user.isActive,

    bio: barber.bio,
    specialty: barber.specialty,
    location: barber.location,
    profilePhoto: barber.profilePhoto,

    status: barber.status,
    averageRating: barber.averageRating,
  };

  return res.status(200).json(new ApiResponse(200, user, 'Barber profile fetched successfully'));
});

// [2] Update Barber Profile
export const updateBarberProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { name, phone, bio, specialty, location } = req.body;

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!name && !phone && !bio && !specialty && !location) {
    throw new ApiError(400, 'Atleast one field is required');
  }

  if (phone && !/^[0-9]{10}$/.test(phone)) {
    throw new ApiError(400, 'Invalid phone number');
  }

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

    if (!updateUser) {
      throw new ApiError(500, 'Error in Barber Profile Update in User table ');
    }

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

    if (!updateBarber) {
      throw new ApiError(500, 'Error in Barber Profile Update in Barber table ');
    }

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

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!req?.file?.path) {
    throw new ApiError(400, 'Image file is required');
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }

  const uploadedImage = await uploadOnCloudinary(req.file.path);

  if (!uploadedImage?.url || !uploadedImage?.public_id) {
    throw new ApiError(500, 'Image upload failed');
  }

  if (existingUser?.imagePublicId) {
    try {
      await deleteFromCloudinary(existingUser.imagePublicId);
    } catch (err) {
      console.warn('Old image delete failed:', err.message);
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      imageUrl: uploadedImage.url,
      imagePublicId: uploadedImage.public_id,
    },
    select: {
      imageUrl: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Barber profile image updated successfully'));
});

// [4] Create Service
export const createService = asyncHandler(async (req, res) => {
  const { name, description, price, durationMinutes } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!name?.trim() || !description?.trim()) {
    throw new ApiError(400, 'All fields are required');
  }

  if (isNaN(price) || price <= 0) {
    throw new ApiError(400, 'Invalid price');
  }

  if (isNaN(durationMinutes) || durationMinutes <= 0) {
    throw new ApiError(400, 'Invalid duration');
  }

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
  });

  if (!barber) {
    throw new ApiError(404, 'Barber not found');
  }

  if (barber.status !== 'APPROVED') {
    throw new ApiError(403, 'Barber not approved');
  }

  const existingService = await prisma.service.findFirst({
    where: {
      barberId: barber.id,
      name: name.trim(),
    },
  });

  if (existingService) {
    throw new ApiError(400, 'Service already exists');
  }

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

// [5] Update Service
export const updateService = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const serviceId = Number(req.params?.id);
  const { name, description, price, durationMinutes } = req.body;

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!serviceId || isNaN(serviceId)) {
    throw new ApiError(400, 'Invalid service Id');
  }

  if (!name && !description && price == null && durationMinutes == null) {
    throw new ApiError(400, 'At least one field is required');
  }

  const parsedPrice = price != null ? Number(price) : undefined;
  const parsedDuration = durationMinutes != null ? Number(durationMinutes) : undefined;

  if (parsedPrice !== undefined && (isNaN(parsedPrice) || parsedPrice <= 0)) {
    throw new ApiError(400, 'Invalid price');
  }

  if (parsedDuration !== undefined && (isNaN(parsedDuration) || parsedDuration <= 0)) {
    throw new ApiError(400, 'Invalid duration');
  }

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
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

  const existingService = await prisma.service.findFirst({
    where: {
      id: serviceId,
      barberId: barber.id,
    },
  });

  if (!existingService) {
    throw new ApiError(404, 'Service not found');
  }

  const service = await prisma.service.update({
    where: {
      id: serviceId,
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

// [6] Toggle Service
export const toggleServiceStatus = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const serviceId = Number(req.params?.id);
  const { status } = req.body;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!serviceId || isNaN(serviceId)) {
    throw new ApiError(400, 'Invalid service Id');
  }

  if (status === null || status === undefined) {
    throw new ApiError(400, 'Status is required');
  }

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
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

  const existingService = await prisma.service.findFirst({
    where: {
      id: serviceId,
      barberId: barber.id,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!existingService) {
    throw new ApiError(404, 'Service not found');
  }

  const service = await prisma.service.update({
    where: {
      id: serviceId,
    },
    data: {
      isActive: status,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(new ApiResponse(200, service, 'Service status updated successfully'));
});

// [7] Delete Service
export const deleteService = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const serviceId = Number(req.params?.id);

  if (!userId) {
    throw new ApiError(401, 'Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!serviceId || isNaN(serviceId)) {
    throw new ApiError(400, 'Invalid service Id');
  }

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
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

  const existingService = await prisma.service.findFirst({
    where: {
      id: serviceId,
      barberId: barber.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!existingService) {
    throw new ApiError(404, 'Service not found');
  }

  const activeBookings = await prisma.booking.count({
    where: {
      serviceId: serviceId,
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
    },
  });

  if (activeBookings > 0) {
    throw new ApiError(400, 'Cannot delete service with active bookings');
  }

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

// [8] Get Services
export const getServices = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const page = Math.max(1, Number(req?.query?.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req?.query?.limit) || 10));

  const skip = (page - 1) * limit;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
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

  if (!services.length) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { services: [], pagination: paginationFn(0, page, limit) },
          'No services found',
        ),
      );
  }

  const pagination = paginationFn(total, page, limit);

  return res
    .status(200)
    .json(new ApiResponse(200, { services, pagination }, 'Services fetched successfully'));
});

// [9] Create Schedule
export const createSchedule = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { dayOfWeek, startTime, endTime, isDayOff } = req.body;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (dayOfWeek == null || !startTime || !endTime || typeof isDayOff !== 'boolean') {
    throw new ApiError(400, 'All fields are required');
  }

  if (dayOfWeek < 0 || dayOfWeek > 6) {
    throw new ApiError(400, 'Invalid dayOfWeek (0-6)');
  }

  if (new Date(`1970-01-01T${startTime}`) >= new Date(`1970-01-01T${endTime}`)) {
    throw new ApiError(400, 'Start time must be before end time');
  }

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
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

  const existingSchedule = await prisma.schedule.findFirst({
    where: {
      barberId: barber.id,
      dayOfWeek,
    },
    select: {
      id: true,
    },
  });

  if (existingSchedule) {
    throw new ApiError(400, 'Schedule already exists for this day');
  }

  const schedule = await prisma.schedule.create({
    data: {
      barberId: barber.id,
      dayOfWeek,
      startTime: new Date(`1970-01-01T${startTime}`),
      endTime: new Date(`1970-01-01T${endTime}`),
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

// [10] Update Schedule
export const updateSchedule = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const scheduleId = Number(req.params?.id);
  const { dayOfWeek, startTime, endTime, isDayOff } = req.body;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!scheduleId || isNaN(scheduleId)) {
    throw new ApiError(400, 'Invalid schedule Id');
  }

  if (dayOfWeek == null && !startTime && !endTime && typeof isDayOff !== 'boolean') {
    throw new ApiError(400, 'At least one field is required');
  }

  if (dayOfWeek != null && (dayOfWeek < 0 || dayOfWeek > 6)) {
    throw new ApiError(400, 'Invalid dayOfWeek (0-6)');
  }

  if (startTime && endTime) {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    if (start >= end) {
      throw new ApiError(400, 'Start time must be before end time');
    }
  }

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
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

  const existingSchedule = await prisma.schedule.findFirst({
    where: {
      id: scheduleId,
      barberId: barber.id,
    },
    select: {
      id: true,
    },
  });

  if (!existingSchedule) {
    throw new ApiError(400, 'Schedule not found for this day');
  }

  const schedule = await prisma.schedule.update({
    where: {
      id: scheduleId,
    },
    data: {
      ...(dayOfWeek != null && { dayOfWeek }),
      ...(startTime && { startTime: new Date(`1970-01-01T${startTime}`) }),
      ...(endTime && { endTime: new Date(`1970-01-01T${endTime}`) }),
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

  return res.status(200).json(new ApiResponse(200, schedule, 'Schedule Updated successfully'));
});

// [11] Delete Schedule
export const deleteSchedule = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const scheduleId = Number(req.params?.id);

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!scheduleId || isNaN(scheduleId)) {
    throw new ApiError(400, 'Invalid schedule Id');
  }

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
  });

  if (!barber) {
    throw new ApiError(404, 'Barber not found');
  }

  const existingSchedule = await prisma.schedule.findUnique({
    where: {
      id: scheduleId,
      barberId: barber.id,
    },
  });

  if (!existingSchedule) {
    throw new ApiError(400, 'Schedule not found for this day');
  }

  const schedule = await prisma.schedule.delete({
    where: {
      id: scheduleId,
      barberId: barber.id,
    },
  });

  return res.status(200).json(new ApiResponse(200, schedule, 'Schedule deleted successfully'));
});

// [12] Get Schedules
export const getSchedules = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const page = Number(req?.query?.page) || 1;
  const limit = Number(req?.query?.limit) || 10;

  const skip = (page - 1) * limit;

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
  });

  if (!barber) {
    throw new ApiError(404, 'Barber not found');
  }

  const schedules = await prisma.schedule.findMany({
    where: {
      barberId: barber.id,
    },
    orderBy: { startTime: 'asc' },
    skip: skip,
    take: limit,
  });

  const total = await prisma.schedule.count({ where: { barberId: barber.id } });
  const pagination = paginationFn(total, page, limit);

  return res
    .status(200)
    .json(new ApiResponse(200, { schedules, pagination }, 'Schedules fetched successfully'));
});

// [13] Creat Time Slot
export const createTimeSlot = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { date } = req.body;

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!date) {
    throw new ApiError(400, 'Date is required');
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) {
    throw new ApiError(400, 'Invalid date');
  }

  const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
  });

  if (!barber) {
    throw new ApiError(404, 'Barber not found');
  }

  const existingTimeSlot = await prisma.timeSlot.findUnique({
    where: {
      barberId: barber.id,
      slotDate: parsedDate,
      startTime: startOfDay,
      endTime: endOfDay,
    },
  });

  if (existingTimeSlot) {
    throw new ApiError(400, 'Time slot already exists');
  }

  const result = await prisma.timeSlot.create({
    data: {
      barberId: barber.id,
      slotDate: date,
      startTime: startOfDay,
      endTime: endOfDay,
      status: 'AVAILABLE',
    },
  });

  if (!result) {
    throw new ApiError(500, 'Failed to create time slot');
  }

  return res.status(200).json(new ApiResponse(200, result, 'Time slot created successfully'));
});

// [14] Creat Bulk Time Slots
export const createBulkTimeSlots = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { dates } = req.body;

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!dates || !Array.isArray(dates) || dates.length === 0) {
    throw new ApiError(400, 'Dates is required');
  }

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
  });

  if (!barber) {
    throw new ApiError(404, 'Barber not found');
  }

  const result = await prisma.timeSlot.createMany({
    data: dates.map((date) => ({
      barberId: barber.id,
      slotDate: date,
      startTime: new Date(date),
      endTime: new Date(date),
      status: 'AVAILABLE',
    })),
  });

  if (!result) {
    throw new ApiError(500, 'Failed to create time slots');
  }

  return res.status(200).json(new ApiResponse(200, result, 'Time slots created successfully'));
});

// [15] Get Time Slots
export const getTimeSlots = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { date } = req.body;
  const page = Number(req?.query?.page) || 1;
  const limit = Number(req?.query?.limit) || 10;

  const skip = (page - 1) * limit;

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (!date) {
    throw new ApiError(400, 'Date is required');
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) {
    throw new ApiError(400, 'Invalid date');
  }

  const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
  });

  if (!barber) {
    throw new ApiError(404, 'Barber not found');
  }

  const result = await prisma.timeSlot.findUnique({
    where: {
      barberId: barber.id,
      slotDate: parsedDate,
      startTime: startOfDay,
      endTime: endOfDay,
    },
    orderBy: { startTime: 'asc' },
    skip: skip,
    take: limit,
  });

  const total = await prisma.timeSlot.count({
    where: {
      barberId: barber.id,
      slotDate: parsedDate,
      startTime: startOfDay,
      endTime: endOfDay,
    },
  });

  const pagination = paginationFn(total, page, limit);

  if (!result) {
    throw new ApiError(500, 'Failed to get time slot');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { result, pagination }, 'Time slot fetched successfully'));
});

// [16] Update Time Slot
export const updateTimeSlot = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const slotId = Number(req.params?.id);
  const { date } = req.body;

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!date) {
    throw new ApiError(400, 'Date is required');
  }

  if (!slotId || isNaN(slotId)) {
    throw new ApiError(400, 'Invalid slot Id');
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) {
    throw new ApiError(400, 'Invalid date');
  }

  const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
  });

  if (!barber) {
    throw new ApiError(404, 'Barber not found');
  }

  const existingTimeSlot = await prisma.timeSlot.findUnique({
    where: {
      id: slotId,
    },
  });

  if (!existingTimeSlot) {
    throw new ApiError(400, 'Time slot not found');
  }

  const result = await prisma.timeSlot.update({
    where: {
      id: slotId,
      barberId: barber.id,
    },
    data: {
      ...(slotDate ? { slotDate: parsedDate } : {}),
      ...(startTime ? { startTime: startOfDay } : {}),
      ...(endTime ? { endTime: endOfDay } : {}),
    },
  });

  if (!result) {
    throw new ApiError(500, 'Failed to update time slot');
  }

  return res.status(200).json(new ApiResponse(200, result, 'Time slot updated successfully'));
});

// [17] Delete Time Slot
export const deleteTimeSlot = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const slotId = Number(req.params?.id);

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!slotId || isNaN(slotId)) {
    throw new ApiError(400, 'Invalid slot Id');
  }

  const barber = await prisma.barber.findUnique({
    where: {
      userId,
    },
  });

  if (!barber) {
    throw new ApiError(404, 'Barber not found');
  }

  const existingTimeSlot = await prisma.timeSlot.findUnique({
    where: {
      id: slotId,
      barberId: barber.id,
    },
  });

  if (!existingTimeSlot) {
    throw new ApiError(400, 'Time slot not found');
  }

  const result = await prisma.timeSlot.delete({
    where: {
      id: slotId,
      barberId: barber.id,
    },
  });

  if (!result) {
    throw new ApiError(500, 'Failed to delete time slot');
  }

  return res.status(200).json(new ApiResponse(200, result, 'Time slot deleted successfully'));
});

// [18] Get Bookings
export const getBookings = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const page = Number(req?.query?.page) || 1;
  const limit = Number(req?.query?.limit) || 10;

  const skip = (page - 1) * limit;

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId,
    },
    orderBy: { createdAt: 'desc' },
    skip: skip,
    take: limit,
  });

  const total = await prisma.booking.count({ where: { userId } });
  const pagination = paginationFn(total, page, limit);

  if (!bookings) {
    throw new ApiError(404, 'No bookings found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { bookings, pagination }, 'Bookings list fetched successfully'));
});

// [19] Update Booking Status
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const bookingId = Number(req.params?.id);
  const { status } = req.body;

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!bookingId || isNaN(bookingId)) {
    throw new ApiError(400, 'Invalid booking Id');
  }

  if (!status) {
    throw new ApiError(400, 'Status is required');
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
      barberId: userId,
    },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  const result = await prisma.booking.update({
    where: {
      id: bookingId,
      barberId: userId,
    },
    data: {
      status,
    },
  });

  if (!result) {
    throw new ApiError(500, 'Failed to update booking status');
  }

  return res.status(200).json(new ApiResponse(200, result, 'Booking status updated successfully'));
});

// [20] Get Booking by Id
export const getBookingById = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const bookingId = Number(req.params?.id);

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (!bookingId || isNaN(bookingId)) {
    throw new ApiError(400, 'Invalid booking Id');
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
      barberId: userId,
    },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  return res.status(200).json(new ApiResponse(200, booking, 'Booking fetched successfully'));
});

// [21] Delete Booking
export const deleteeBooking = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const bookingId = Number(req.params?.id);

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!bookingId || isNaN(bookingId)) {
    throw new ApiError(400, 'Invalid booking Id');
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
      barberId: userId,
    },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.status !== 'PENDING' || booking.status !== 'CONFIRMED') {
    throw new ApiError(400, `Booking can't be cancelled . First Cancelled the booking`);
  }

  const result = await prisma.booking.delete({
    where: {
      id: bookingId,
      barberId: barberId,
    },
  });

  if (!result) {
    throw new ApiError(500, 'Failed to delete booking');
  }

  return res.status(200).json(new ApiResponse(200, result, 'Booking deleted successfully'));
});

// [22] Toggle Availability
export const toggleAvailability = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status } = req.body;

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  if (!status) {
    throw new ApiError(400, 'Status is required');
  }

  const result = await prisma.barber.update({
    where: {
      userId: userId,
    },
    data: {
      status,
    },
  });

  if (!result) {
    throw new ApiError(500, 'Failed to toggle availability');
  }

  return res.status(200).json(new ApiResponse(200, result, 'Availability toggled successfully'));
});

// [23] Get Dashboard Stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  if (req.user.role !== 'BARBER') {
    throw new ApiError(403, 'Access denied');
  }

  const ratings = await prisma.booking.groupBy({
    by: ['rating'],
    _count: {
      rating: true,
    },
    _avg: {
      rating: true,
    },
    where: {
      barberId: userId,
      rating: {
        not: null,
      },
    },
  });

  const bookings = await prisma.booking.groupBy({
    by: ['status'],
    _count: {
      id: true,
    },
    where: {
      barberId: userId,
    },
  });

  const services = await prisma.booking.groupBy({
    by: ['serviceId'],
    _count: {
      id: true,
    },
    where: {
      barberId: userId,
    },
  });

  const result = {
    ...(ratings.length > 0 ? { ratings } : 'No rating found'),
    ...(bookings.length > 0 ? { bookings } : 'No booking found'),
    ...(services.length > 0 ? { services } : 'No service found'),
  };

  return res.status(200).json(new ApiResponse(200, result, 'Dashboard stats fetched successfully'));
});

// [24] Get All Reviews
export const getAllReviews = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const page = Number(req?.query?.page) || 1;
  const limit = Number(req?.query?.limit) || 10;

  const skip = (page - 1) * limit;

  if (!userId) {
    throw new ApiError(401, ' Unauthorized User');
  }

  const reviews = await prisma.review.findMany({
    where: {
      barberId: userId,
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
    },
    orderBy: { createdAt: 'desc' },
    skip: skip,
    take: limit,
  });

  const total = await prisma.review.count({ where: { barberId: userId } });
  const pagination = paginationFn(total, page, limit);

  if (!reviews) {
    throw new ApiError(404, 'No reviews found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { reviews, pagination }, 'Reviews list fetched successfully'));
});
