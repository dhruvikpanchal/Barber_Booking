import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { paginationFn } from '../utils/Pagination.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/claudinary.js';

const prisma = new PrismaClient();

// [1] User Profile Fetch
export const getProfile = asyncHandler(async (req, res) => {
  const id = req.user.id;

  if (!id) {
    throw new ApiError(400, 'Id is required');
  }

  const user = await prisma.user.findUnique({ where: { id: id } });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { passwordHash, ...safeUserData } = user;

  return res
    .status(200)
    .json(new ApiResponse(200, safeUserData, 'User Profile fetched successfully'));
});

// [2] Update Profile
export const updateProfile = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const { name, phone, image } = req.body;

  if (!id) {
    throw new ApiError(400, 'Id is required');
  }

  if (!name && !phone) {
    throw new ApiError(400, 'At least one field is required to update');
  }

  const existingUser = await prisma.user.findUnique({ where: { id: id } });

  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }

  let uploadedImage = null;

  if (req.file?.path) {
    uploadedImage = await uploadOnCloudinary(req.file.path);

    if (!uploadedImage) {
      throw new ApiError(500, 'Image upload failed');
    }

    if (existingUser?.imagePublicId) {
      await deleteFromCloudinary(existingUser.imagePublicId);
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(image && { image }),
      imageUrl: uploadedImage.url,
      imagePublicId: uploadedImage.public_id,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      imageUrl: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, 'User Profile Updated successfully'));
});

// [3] Get Barber List
export const getBarberList = asyncHandler(async (req, res) => {
  const { search, location } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const skip = (page - 1) * limit;

  const whereCause = {
    status: 'APPROVED',
    isAvailable: true,
    ...(location && { location: { contains: location, mode: 'insensitive' } }),
    ...(search && {
      user: {
        name: { contains: search, mode: 'insensitive' },
      },
    }),
  };

  const barbers = await prisma.barber.findMany({
    where: whereCause,
    select: {
      id: true,
      bio: true,
      averageRating: true,
      location: true,
      user: {
        select: { name: true },
      },
    },
    orderBy: { averageRating: 'desc' },
    skip: skip,
    take: limit,
  });

  const total = await prisma.barber.count({ where: whereCause });

  const pagination = paginationFn(total, page, limit);

  return res
    .status(200)
    .json(new ApiResponse(200, { barbers, pagination }, 'Barber List fetched successfully'));
});

// [4] Get Barber Details
export const getBarberDetails = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (!id) {
    throw new ApiError(400, 'Id is required');
  }

  const barber = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      name: true,
      imageUrl: true,
      phone: true,
      email: true,

      barber: {
        select: {
          id: true,
          bio: true,
          averageRating: true,

          // ✅ Reviews
          reviews: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
              user: {
                select: {
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },

          // ✅ Services (junction table)
          services: {
            select: {
              id: true,
              name: true,
              description: true,
              durationMinutes: true,
              price: true,
            },
          },
        },
      },
    },
  });

  if (!barber) {
    throw new ApiError(404, 'Barber not found');
  }

  return res.status(200).json(new ApiResponse(200, barber, 'Barber Details fetched successfully'));
});

// [5] Get Available Time Slots
export const getAvailableTimeSlots = asyncHandler(async (req, res) => {
  const barberId = req.params.id;

  if (!barberId) {
    throw new ApiError(400, 'Barber ID is required');
  }

  const date = req.query.date;

  if (!date) {
    throw new ApiError(400, 'Date is required');
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) {
    throw new ApiError(400, 'Invalid date format');
  }

  const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

  const timeSlots = await prisma.timeSlot.findMany({
    where: {
      barberId: Number(barberId),
      slotDate: { gte: startOfDay, lte: endOfDay },
      status: 'AVAILABLE',
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
    },
    orderBy: { startTime: 'asc' },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        timeSlots,
        timeSlots.length
          ? 'Available time slots fetched successfully'
          : 'No time slots available for this date',
      ),
    );
});

// [6] Create Booking
export const createBooking = asyncHandler(async (req, res) => {
  const { barberId, serviceId, slotId } = req.body;
  const userId = req.user.id;

  if (!barberId || !serviceId || !slotId) {
    throw new ApiError(400, 'All fields are required');
  }

  if (!userId) {
    throw new ApiError(401, 'User not authenticated');
  }

  const booking = await prisma.$transaction(async (tx) => {
    const slot = await tx.timeSlot.findUnique({
      where: {
        id: Number(slotId),
      },
    });

    if (!slot || slot.status !== 'AVAILABLE')
      throw new ApiError(400, 'Slot is not available or invalid');

    const service = await tx.barberService.findFirst({
      where: {
        barberId: Number(barberId),
        serviceId: Number(serviceId),
      },
    });

    if (!service) throw new ApiError(400, 'Service not found or not offered by this barber');

    const newBooking = await tx.booking.create({
      data: {
        userId,
        barberId,
        serviceId,
        slotId,
        bookingType: 'ONLINE',
        bookedAt: new Date(),
        status: 'CONFIRMED',
      },
      select: {
        id: true,
        status: true,
        barberId: true,
        serviceId: true,
        slotId: true,
        bookedAt: true,
        bookingType: true,
      },
    });

    await tx.timeSlot.update({
      where: {
        id: Number(slotId),
      },
      data: {
        status: 'BOOKED',
      },
    });

    return newBooking;
  });

  return res.status(201).json(new ApiResponse(201, booking, 'Booking created successfully'));
});

// [7] Cancel Booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    throw new ApiError(400, 'Booking ID is required');
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Get booking
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // 2. Ownership check
    if (booking.userId !== userId) {
      throw new ApiError(403, 'Unauthorized to cancel this booking');
    }

    // 3. Status validation
    if (booking.status === 'CANCELLED') {
      throw new ApiError(400, 'Booking already cancelled');
    }

    if (booking.status === 'COMPLETED') {
      throw new ApiError(400, 'Completed booking cannot be cancelled');
    }

    // 4. Cancel booking
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    // 5. Release slot
    await tx.timeSlot.update({
      where: { id: booking.slotId },
      data: { status: 'AVAILABLE' },
    });

    return updatedBooking;
  });

  return res.status(200).json(new ApiResponse(200, result, 'Booking cancelled successfully'));
});

// [8] Get User's Bookings
export const getMyBookings = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const skip = (page - 1) * limit;

  if (!userId) {
    throw new ApiError(400, 'User is required');
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: userId,
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
              image: true,
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
    where: { userId },
  });

  const pagination = paginationFn(total, page, limit);

  return res
    .status(200)
    .json(new ApiResponse(200, { bookings, pagination }, 'User bookings fetched successfully'));
});

// [9] Add Review
export const addReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;
  const userId = req.user.id;

  if (!bookingId || !rating || !comment) {
    throw new ApiError(400, 'All fields are required');
  }

  if (!userId) {
    throw new ApiError(400, 'User is required');
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ApiError(403, 'Not authorized to review this booking');
    }

    if (booking.status !== 'COMPLETED') {
      throw new ApiError(400, 'You can only review completed bookings');
    }

    const existingReview = await tx.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      throw new ApiError(400, 'Review already exists for this booking');
    }

    const review = await tx.review.create({
      data: {
        bookingId,
        userId,
        barberId: booking.barberId,
        rating,
        comment,
      },
    });

    const stats = await tx.review.aggregate({
      where: { barberId: booking.barberId },
      _avg: { rating: true },
    });

    await tx.barber.update({
      where: { id: booking.barberId },
      data: {
        averageRating: stats._avg.rating || 0,
      },
    });

    return review;
  });

  return res.status(201).json(new ApiResponse(201, result, 'Review added successfully'));
});
