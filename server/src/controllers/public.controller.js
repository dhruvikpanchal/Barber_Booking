import { prisma } from '../config/prismaClient.js';

// Utils
import {
  asyncHandler,
  ApiError,
  ApiResponse,
  getPaginationParams,
  paginationFn,
  parseDateUTC,
  getStartOfDayUTC,
  getEndOfDayUTC,
} from '../utils/index.js';

// helper function
import { buildBarberListWhere } from '../helpers/barberListHelper.js';

/*===========================================================================
                            Main Functions
=============================================================================*/

// [1] Contact Us
export const ContactUs = asyncHandler(async (req, res) => {
  const { name, email, phone, service_need, message } = req.body;

  if (!name || !email || !phone || !service_need || !message)
    throw new ApiError(400, 'All fields are required');

  const contact = await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone,
      service_need,
      message,
      status: 'PENDING',
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { message: 'Contact form submitted successfully' }));
});

// [2] Get Barber List
export const getBarberList = asyncHandler(async (req, res) => {
  const { search, location } = req.query;
  const { page, limit, skip } = getPaginationParams({
    page: req?.query?.page,
    limit: req?.query?.limit,
  });

  const whereCause = buildBarberListWhere({
    search,
    location,
    status: 'APPROVED',
    isAvailable: true,
  });

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

  const pagination = paginationFn({ total: total, page: page, limit: limit });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { barbers, pagination },
        barbers.length ? 'Barber List fetched successfully' : 'No barbers found',
      ),
    );
});

// [3] Get Barber Details
export const getBarberDetails = asyncHandler(async (req, res) => {
  const barberId = Number(req.params.id);

  if (!barberId) throw new ApiError(400, 'Id is required');

  const row = await prisma.barber.findUnique({
    where: { id: barberId },
    select: {
      id: true,
      status: true,
      bio: true,
      averageRating: true,
      user: {
        select: {
          name: true,
          imageUrl: true,
          phone: true,
          email: true,
        },
      },
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
      services: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          description: true,
          durationMinutes: true,
          price: true,
        },
      },
    },
  });

  if (!row) throw new ApiError(404, 'Barber not found');

  if (row.status !== 'APPROVED') throw new ApiError(403, 'Barber is not approved');

  if (!row.user) throw new ApiError(404, 'Barber not found');

  const barber = {
    name: row.user.name,
    imageUrl: row.user.imageUrl,
    phone: row.user.phone,
    email: row.user.email,
    barber: {
      id: row.id,
      bio: row.bio,
      averageRating: row.averageRating,
      reviews: row.reviews,
      services: row.services,
    },
  };

  return res.status(200).json(new ApiResponse(200, barber, 'Barber Details fetched successfully'));
});

// [4] Get Available Slots (Public)
export const getPublicAvailableSlots = asyncHandler(async (req, res) => {
  const barberId = Number(req.query?.barberId);
  const date = req.query?.date;
  const { page, limit, skip } = getPaginationParams({
    page: req?.query?.page,
    limit: req?.query?.limit,
  });

  if (!barberId) throw new ApiError(400, 'BarberId is required');

  if (!date) throw new ApiError(400, 'Date is required');

  const parsedDate = parseDateUTC({ dateStr: date });

  const startOfDay = getStartOfDayUTC({ date: parsedDate });
  const endOfDay = getEndOfDayUTC({ date: parsedDate });

  const barber = await prisma.barber.findUnique({
    where: { id: barberId },
    select: { id: true, status: true },
  });

  if (!barber || barber.status !== 'APPROVED') throw new ApiError(404, 'Barber not available');

  const [result, total] = await Promise.all([
    prisma.timeSlot.findMany({
      where: {
        barberId: barberId,
        status: 'AVAILABLE',
        slotDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { startTime: 'asc' },
      skip,
      take: limit,
      select: {
        id: true,
        slotDate: true,
        startTime: true,
        endTime: true,
        status: true,
      },
    }),

    prisma.timeSlot.count({
      where: {
        barberId: barberId,
        status: 'AVAILABLE',
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
        result.length ? 'Available slots fetched successfully' : 'No available slots',
      ),
    );
});
