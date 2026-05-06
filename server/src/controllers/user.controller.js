import { prisma } from '../config/prismaClient.js';

// Utils
import {
  asyncHandler,
  ApiError,
  ApiResponse,
  getPaginationParams,
  paginationFn,
  parseDateUTC,
  formatSlot,
  combineDateAndTimeUTC,
} from '../utils/index.js';

// Helpers
import { recalculateBarberRating } from '../helpers/ratingHelper.js';
import { VerifyAndUpdatePassword } from '../helpers/ChangePasswordHelper.js';
import { uploadProfileImage } from '../helpers/updateImageHelper.js';
import {
  checkUserAndRole,
  userVerifyAndStatusCheck,
  barberVerifyAndStatusCheck,
  validateRating,
} from '../helpers/OnlyUserHelper.js';

/*===========================================================================
                            Main Functions
=============================================================================*/

// [1] User Profile Fetch
export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  checkUserAndRole({ userId: userId, userRole: req.user?.role });

  const existingUser = await userVerifyAndStatusCheck({ userId: userId });

  const user = await prisma.user.findUnique({
    where: { id: existingUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      imageUrl: true,
      role: true,
      isActive: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });

  return res.status(200).json(new ApiResponse(200, user, 'User Profile fetched successfully'));
});

// [2] Update Profile
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, phone } = req.body;

  checkUserAndRole({ userId: userId, userRole: req.user?.role });

  if (!name && !phone) throw new ApiError(400, 'At least one field is required to update');

  const existingUser = await userVerifyAndStatusCheck({ userId: userId });

  const updatedUser = await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      ...(name && { name }),
      ...(phone && { phone }),
    },
    select: {
      id: true,
      name: true,
      phone: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, 'User Profile Updated successfully'));
});

// [3] Change Password
export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  checkUserAndRole({ userId: userId, userRole: req.user?.role });

  const existingUser = await userVerifyAndStatusCheck({ userId: userId });

  const user = await VerifyAndUpdatePassword({
    userId: existingUser.id,
    oldPassword: oldPassword,
    newPassword: newPassword,
    existingPasswordHash: existingUser.passwordHash,
  });

  return res.status(200).json(new ApiResponse(200, user, 'Password changed successfully'));
});

// [4]  Upload User Profile Image
export const uploadUserProfileImage = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  checkUserAndRole({ userId: userId, userRole: req.user?.role });

  const existingUser = await userVerifyAndStatusCheck({ userId: userId });

  const user = await uploadProfileImage({
    userId: existingUser.id,
    filePath: req?.file?.path,
    oldImageId: existingUser?.imagePublicId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User profile image updated successfully'));
});

// [5] Get Available Time Slots
export const getAvailableTimeSlots = asyncHandler(async (req, res) => {
  const barberId = Number(req?.params?.id);
  const userId = req?.user?.id;
  const { page, limit, skip } = getPaginationParams({
    page: req?.query?.page,
    limit: req?.query?.limit,
  });

  checkUserAndRole({ userId: userId, userRole: req.user?.role });

  if (!barberId) throw new ApiError(400, 'Barber ID is required');

  const date = req?.query?.date;

  if (!date) throw new ApiError(400, 'Date is required');

  await userVerifyAndStatusCheck({ userId: userId });

  const existingBarber = await barberVerifyAndStatusCheck({ barberId: barberId });

  const parsedDate = parseDateUTC({ dateStr: date });

  const timeSlots = await prisma.timeSlot.findMany({
    where: {
      barberId: existingBarber.id,
      slotDate: parsedDate,
      status: 'AVAILABLE',
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
    },
    orderBy: { startTime: 'asc' },
    skip,
    take: limit,
  });

  const total = await prisma.timeSlot.count({
    where: {
      barberId: Number(barberId),
      slotDate: parsedDate,
      status: 'AVAILABLE',
    },
  });

  const pagination = paginationFn({ total: total, limit: limit, page: page });

  const formattedSlots = timeSlots.map((slot) => formatSlot({ slot }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { formattedSlots, pagination },
        formattedSlots.length
          ? 'Available time slots fetched successfully'
          : 'No time slots available for this date',
      ),
    );
});

// [6] Create Booking
export const createBooking = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { barberId, serviceId, slotId } = req.body;

  checkUserAndRole({ userId: userId, userRole: req.user?.role });

  if (!barberId || !serviceId || !slotId)
    throw new ApiError(400, 'barberId, serviceId and slotId are required');

  const existingUser = await userVerifyAndStatusCheck({ userId: userId });
  const existingBarber = await barberVerifyAndStatusCheck({ barberId: barberId });

  const booking = await prisma.$transaction(async (tx) => {
    const slot = await tx.timeSlot.findUnique({
      where: { id: Number(slotId) },
      select: {
        id: true,
        status: true,
        barberId: true,
        slotDate: true,
        startTime: true,
      },
    });

    if (!slot || slot.status !== 'AVAILABLE') throw new ApiError(400, 'Slot not available');

    if (slot.barberId !== Number(existingBarber.id))
      throw new ApiError(400, 'Slot does not belong to this barber');

    const slotDateTime = combineDateAndTimeUTC({
      date: slot.slotDate,
      time: slot.startTime,
    });

    if (slotDateTime <= new Date()) throw new ApiError(400, 'Cannot book past slot');

    const service = await tx.service.findFirst({
      where: {
        id: Number(serviceId),
        barberId: existingBarber.id,
        isActive: true,
      },
    });

    if (!service) throw new ApiError(400, 'Invalid service');

    await tx.timeSlot.updateMany({
      where: { id: Number(slotId), status: 'AVAILABLE' },
      data: { status: 'ONLINE_BOOKED' },
    });

    const existingBooking = await tx.booking.findUnique({
      where: { slotId: Number(slotId) },
    });

    if (existingBooking) {
      throw new ApiError(400, 'Slot already booked');
    }

    const newBooking = await tx.booking.create({
      data: {
        userId: existingUser.id,
        barberId: existingBarber.id,
        serviceId: Number(serviceId),
        slotId: Number(slotId),
        bookingType: 'ONLINE',
        bookedAt: new Date(),
        status: 'PENDING',
      },
      include: {
        service: true,
        slot: true,
      },
    });

    return newBooking;
  });

  return res.status(201).json(new ApiResponse(201, booking, 'Booking created successfully'));
});

// [7] Cancel Booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const bookingId = Number(req.params?.id);

  checkUserAndRole({ userId: userId, userRole: req.user?.role });

  if (!bookingId) throw new ApiError(400, 'Valid Booking ID is required');

  const existingUser = await userVerifyAndStatusCheck({ userId: userId });

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        userId: true,
        slotId: true,
        status: true,
      },
    });

    if (!booking) throw new ApiError(404, 'Booking not found');

    if (booking.userId !== existingUser.id)
      throw new ApiError(403, 'You are not allowed to cancel this booking');

    if (booking.status === 'CANCELLED') return { booking, alreadyCancel: true };

    if (booking.status === 'COMPLETED')
      throw new ApiError(400, 'Completed booking cannot be cancelled');

    const slot = await tx.timeSlot.findUnique({
      where: { id: booking.slotId },
      select: { slotDate: true, startTime: true },
    });

    if (slot) {
      const slotDateTime = combineDateAndTimeUTC({
        date: slot.slotDate,
        time: slot.startTime,
      });

      if (!slotDateTime) throw new ApiError(400, 'Cannot validate booking slot');

      if (slotDateTime <= new Date()) throw new ApiError(400, 'Cannot cancel past bookings');
    }

    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancelReason: 'USER_CANCELLED',
      },
    });

    await tx.timeSlot.update({
      where: { id: booking.slotId },
      data: { status: 'AVAILABLE' },
    });

    return { booking: updatedBooking, alreadyCancel: false };
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.booking,
        result.alreadyCancel ? 'Booking already cancelled' : 'Booking cancelled successfully',
      ),
    );
});

// [8] Get User's Bookings
export const getMyBookings = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page, limit, skip } = getPaginationParams({
    page: req?.query?.page,
    limit: req?.query?.limit,
  });

  checkUserAndRole({ userId: userId, userRole: req.user?.role });

  const existingUser = await userVerifyAndStatusCheck({ userId: userId });

  const bookings = await prisma.booking.findMany({
    where: {
      userId: existingUser.id,
    },
    select: {
      id: true,
      status: true,
      bookedAt: true,

      service: {
        select: {
          id: true,
          name: true,
          description: true,
          durationMinutes: true,
          price: true,
        },
      },

      barber: {
        select: {
          id: true,
          user: {
            select: {
              name: true,
              imageUrl: true,
              phone: true,
              email: true,
            },
          },
        },
      },

      slot: {
        select: {
          id: true,
          slotDate: true,
          startTime: true,
          endTime: true,
        },
      },
    },
    orderBy: { bookedAt: 'desc' },
    skip: skip,
    take: limit,
  });

  const total = await prisma.booking.count({
    where: { userId: existingUser.id },
  });

  const pagination = paginationFn({ total: total, page: page, limit: limit });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { bookings, pagination },
        bookings.length ? 'User bookings fetched successfully' : 'No bookings found',
      ),
    );
});

// [9] Add Review
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const bookingId = Number(req.params?.id);
  const userId = req.user.id;

  if (!bookingId || !rating || !comment) throw new ApiError(400, 'All fields are required');

  const finalRating = validateRating({ rating: rating });

  checkUserAndRole({ userId: userId, userRole: req.user?.role });

  const existingUser = await userVerifyAndStatusCheck({ userId: userId });

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new ApiError(404, 'Booking not found');

    if (booking.userId !== existingUser.id)
      throw new ApiError(403, 'Not authorized to review this booking');

    if (booking.status !== 'COMPLETED')
      throw new ApiError(400, 'You can only review completed bookings');

    const existingReview = await tx.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) throw new ApiError(400, 'Review already exists for this booking');

    const review = await tx.review.create({
      data: {
        bookingId,
        userId: existingUser.id,
        barberId: booking.barberId,
        rating: finalRating,
        comment,
      },
    });

    await recalculateBarberRating({ barberId: booking?.barberId, tx: tx });

    return review;
  });

  return res.status(201).json(new ApiResponse(201, result, 'Review added successfully'));
});

// [10] Update Review
export const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const bookingId = Number(req.params?.id);
  const userId = req.user.id;

  if (!bookingId || !rating || !comment) throw new ApiError(400, 'All fields are required');

  const finalRating = validateRating({ rating: rating });

  checkUserAndRole({ userId: userId, userRole: req.user?.role });

  const existingUser = await userVerifyAndStatusCheck({ userId: userId });

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new ApiError(404, 'Booking not found');

    if (booking.userId !== existingUser.id)
      throw new ApiError(403, 'Not authorized to review this booking');

    if (booking.status !== 'COMPLETED')
      throw new ApiError(400, 'You can only update review for completed bookings');

    const existingReview = await tx.review.findUnique({
      where: { bookingId },
    });

    if (!existingReview) throw new ApiError(400, 'Review does not exist for this booking');

    const review = await tx.review.update({
      where: { bookingId },
      data: {
        rating: finalRating,
        comment,
      },
    });

    await recalculateBarberRating({ barberId: booking?.barberId, tx: tx });

    return review;
  });

  return res.status(200).json(new ApiResponse(200, result, 'Review updated successfully'));
});

// [11] Delete Review
export const deleteReview = asyncHandler(async (req, res) => {
  const bookingId = Number(req.params?.id);
  const userId = req.user.id;

  checkUserAndRole({ userId: userId, userRole: req.user?.role });

  if (!bookingId || isNaN(bookingId)) throw new ApiError(400, 'Invalid booking ID');

  const existingUser = await userVerifyAndStatusCheck({ userId: userId });

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new ApiError(404, 'Booking not found');

    if (booking.userId !== existingUser.id)
      throw new ApiError(403, 'Not authorized to review this booking');

    const existingReview = await tx.review.findUnique({
      where: { bookingId },
    });

    if (!existingReview) throw new ApiError(400, 'Review does not exist for this booking');

    const review = await tx.review.delete({
      where: { bookingId },
    });

    await recalculateBarberRating({ barberId: booking?.barberId, tx: tx });

    return review;
  });

  return res.status(200).json(new ApiResponse(200, result, 'Review delete successfully'));
});
