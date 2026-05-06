import { prisma } from '../config/prismaClient.js';
import {
  asyncHandler,
  ApiError,
  ApiResponse,
  getPaginationParams,
  paginationFn,
  parseDateUTC,
  getStartOfDayUTC,
  getEndOfDayUTC,
  formatSlot,
  sendEmail,
} from '../utils/index.js';

// Helpers Functions
import { recalculateBarberRating } from '../helpers/ratingHelper.js';
import { parseAndValidateId } from '../helpers/validater.js';
import { buildBarberListWhere } from '../helpers/barberListHelper.js';
import { uploadProfileImage } from '../helpers/updateImageHelper.js';
import { VerifyAndUpdatePassword } from '../helpers/ChangePasswordHelper.js';
import {
  USER_PUBLIC_SELECT,
  bookingListInclude,
  parseBoolQuery,
  monthKeyUTC,
  mailgenBarberNotice,
  assertAdminNotSelf,
  verifyAdmin,
} from '../helpers/OnlyAdminHelper.js';

/*===========================================================================
                            Main Functions
=============================================================================*/

// [1] getAllUsers
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams({
    page: req.query?.page,
    limit: req.query?.limit,
  });

  const role = req.query?.role;
  const isActive = parseBoolQuery(req.query?.isActive);
  const search = req.query?.search?.trim();

  const conditions = [
    { role: { not: 'ADMIN' } },
    ...(role && ['USER', 'BARBER'].includes(role) ? [{ role }] : []),
    ...(isActive !== undefined ? [{ isActive }] : []),
    ...(search
      ? [
          {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
        ]
      : []),
  ];

  const where = conditions.length ? { AND: conditions } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  const pagination = paginationFn({ total, page, limit });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { users, pagination },
        users.length ? 'Users fetched successfully' : 'No users found',
      ),
    );
});

// [2] getUserById
export const getUserById = asyncHandler(async (req, res) => {
  const userId = parseAndValidateId({ value: req.params?.userId, name: 'user Id' });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...USER_PUBLIC_SELECT,
      _count: {
        select: { bookings: true },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { _count, ...rest } = user;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...rest,
        bookingCount: _count.bookings,
      },
      'User fetched successfully',
    ),
  );
});

// [3] toggleUserStatus
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const adminId = req.user?.id;
  const userId = parseAndValidateId({ value: req.params?.userId, name: 'user Id' });
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    throw new ApiError(400, 'isActive boolean is required');
  }

  assertAdminNotSelf({ adminUserId: adminId, targetUserId: userId });

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!existing) {
    throw new ApiError(404, 'User not found');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(new ApiResponse(200, updated, 'User status updated successfully'));
});

// [4] getAllBarbers
export const getAllBarbers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams({
    page: req.query?.page,
    limit: req.query?.limit,
  });

  const status = req.query?.status;

  if (status && !['PENDING', 'APPROVED', 'SUSPENDED'].includes(status)) {
    throw new ApiError(400, 'Invalid status filter');
  }

  const whereCause = buildBarberListWhere({ status });

  const [barbers, total] = await Promise.all([
    prisma.barber.findMany({
      where: whereCause,
      select: {
        id: true,
        status: true,
        averageRating: true,
        createdAt: true,
        location: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.barber.count({ where: whereCause }),
  ]);

  const pagination = paginationFn({ total, page, limit });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { barbers, pagination },
        barbers.length ? 'Barbers fetched successfully' : 'No barbers found',
      ),
    );
});

// [5] getBarberById
export const getBarberById = asyncHandler(async (req, res) => {
  const barberId = parseAndValidateId({ value: req.params?.barberId, name: 'barber Id' });

  const barber = await prisma.barber.findUnique({
    where: { id: barberId },
    select: {
      id: true,
      bio: true,
      specialty: true,
      location: true,
      profilePhoto: true,
      status: true,
      averageRating: true,
      isAvailable: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          imageUrl: true,
          isActive: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          services: true,
          bookings: true,
        },
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 100,
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
      },
    },
  });

  if (!barber) {
    throw new ApiError(404, 'Barber not found');
  }

  const { _count, ...rest } = barber;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...rest,
        servicesCount: _count.services,
        bookingsCount: _count.bookings,
      },
      'Barber fetched successfully',
    ),
  );
});

// [6] approveBarber
export const approveBarber = asyncHandler(async (req, res) => {
  const barberId = parseAndValidateId({ value: req.params?.barberId, name: 'barber Id' });

  const existing = await prisma.barber.findUnique({
    where: { id: barberId },
    select: {
      id: true,
      status: true,
      user: {
        select: { name: true, email: true },
      },
    },
  });

  if (!existing) {
    throw new ApiError(404, 'Barber not found');
  }

  if (existing.status !== 'PENDING') {
    throw new ApiError(400, 'Only barbers with PENDING status can be approved');
  }

  const barber = await prisma.barber.update({
    where: { id: barberId },
    data: { status: 'APPROVED' },
    select: {
      id: true,
      status: true,
      updatedAt: true,
      user: {
        select: { name: true, email: true },
      },
    },
  });

  if (existing.user?.email) {
    await sendEmail({
      email: existing.user.email,
      subject: 'Your barber profile has been approved',
      mailgenContent: mailgenBarberNotice({
        name: existing.user.name,
        intro:
          'Congratulations! Your barber profile has been approved. You can now sign in and use the barber dashboard.',
      }),
    });
  }

  return res.status(200).json(new ApiResponse(200, barber, 'Barber approved successfully'));
});

// [7] suspendBarber
export const suspendBarber = asyncHandler(async (req, res) => {
  const barberId = parseAndValidateId({ value: req.params?.barberId, name: 'barber Id' });

  const { reason } = req.body;

  if (!reason?.trim()) {
    throw new ApiError(400, 'reason is required');
  }

  if (!reason?.trim()) {
    throw new ApiError(400, 'reason is required');
  }

  const existing = await prisma.barber.findUnique({
    where: { id: barberId },
    select: {
      id: true,
      status: true,
      user: {
        select: { name: true, email: true },
      },
    },
  });

  if (!existing) {
    throw new ApiError(404, 'Barber not found');
  }

  if (existing.status === 'SUSPENDED') {
    throw new ApiError(400, 'Barber is already suspended');
  }

  const barber = await prisma.barber.update({
    where: { id: barberId },
    data: { status: 'SUSPENDED', isAvailable: false },
    select: {
      id: true,
      status: true,
      isAvailable: true,
      updatedAt: true,
      user: {
        select: { name: true, email: true },
      },
    },
  });

  if (existing.user?.email) {
    await sendEmail({
      email: existing.user.email,
      subject: 'Your barber account has been suspended',
      mailgenContent: mailgenBarberNotice({
        name: existing.user.name,
        intro: `Your barber profile has been suspended. Reason: ${reason.trim()}`,
      }),
    });
  }

  return res.status(200).json(new ApiResponse(200, barber, 'Barber suspended successfully'));
});

// [8] reinstateBarber
export const reinstateBarber = asyncHandler(async (req, res) => {
  const barberId = parseAndValidateId({ value: req.params?.barberId, name: 'barber Id' });

  const existing = await prisma.barber.findUnique({
    where: { id: barberId },
    select: {
      id: true,
      status: true,
      user: {
        select: { name: true, email: true },
      },
    },
  });

  if (!existing) {
    throw new ApiError(404, 'Barber not found');
  }

  if (existing.status !== 'SUSPENDED') {
    throw new ApiError(400, 'Only suspended barbers can be reinstated');
  }

  const barber = await prisma.barber.update({
    where: { id: barberId },
    data: { status: 'APPROVED' },
    select: {
      id: true,
      status: true,
      updatedAt: true,
      user: {
        select: { name: true, email: true },
      },
    },
  });

  if (existing.user?.email) {
    await sendEmail({
      email: existing.user.email,
      subject: 'Your barber profile has been reinstated',
      mailgenContent: mailgenBarberNotice({
        name: existing.user.name,
        intro:
          'Your barber profile has been reinstated and set to APPROVED. You can access the barber dashboard again.',
      }),
    });
  }

  return res.status(200).json(new ApiResponse(200, barber, 'Barber reinstated successfully'));
});

// [9] getAllBookings
export const getAllBookings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams({
    page: req.query?.page,
    limit: req.query?.limit,
  });

  const status = req.query?.status;
  const bookingType = req.query?.bookingType;
  const barberId = req.query?.barberId ? Number(req.query.barberId) : undefined;
  const userId = req.query?.userId ? Number(req.query.userId) : undefined;
  const dateFrom = req.query?.dateFrom;
  const dateTo = req.query?.dateTo;

  if (status && !['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
    throw new ApiError(400, 'Invalid booking status filter');
  }

  if (bookingType && !['ONLINE', 'WALKIN'].includes(bookingType)) {
    throw new ApiError(400, 'Invalid booking type filter');
  }

  const bookedAtFilter = {};
  if (dateFrom) {
    const from = getStartOfDayUTC({ date: parseDateUTC({ dateStr: dateFrom }) });
    bookedAtFilter.gte = from;
  }
  if (dateTo) {
    const to = getEndOfDayUTC({ date: parseDateUTC({ dateStr: dateTo }) });
    bookedAtFilter.lte = to;
  }

  const where = {
    ...(status && { status }),
    ...(bookingType && { bookingType }),
    ...(barberId && !Number.isNaN(barberId) && { barberId }),
    ...(userId && !Number.isNaN(userId) && { userId }),
    ...(Object.keys(bookedAtFilter).length > 0 && { bookedAt: bookedAtFilter }),
  };

  const [rows, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      select: {
        id: true,
        bookingType: true,
        walkInName: true,
        bookedAt: true,
        status: true,
        notes: true,
        cancelReason: true,
        createdAt: true,
        ...bookingListInclude,
      },
      orderBy: { bookedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  const bookings = rows.map((b) => ({
    ...b,
    slot: b.slot ? formatSlot({ slot: b.slot }) : null,
  }));

  const pagination = paginationFn({ total, page, limit });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { bookings, pagination },
        bookings.length ? 'Bookings fetched successfully' : 'No bookings found',
      ),
    );
});

// [10] getBookingById
export const getBookingById = asyncHandler(async (req, res) => {
  const bookingId = parseAndValidateId({ value: req.params?.bookingId, name: 'booking Id' });

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      bookingType: true,
      walkInName: true,
      bookedAt: true,
      status: true,
      notes: true,
      cancelReason: true,
      createdAt: true,
      updatedAt: true,
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
          status: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          description: true,
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
      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      },
    },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  const payload = {
    ...booking,
    slot: booking.slot ? formatSlot({ slot: booking.slot }) : null,
  };

  return res.status(200).json(new ApiResponse(200, payload, 'Booking fetched successfully'));
});

// [11] getAllReviews
export const getAllReviews = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams({
    page: req.query?.page,
    limit: req.query?.limit,
  });

  const minRating = Number(req.query?.minRating);
  const maxRating = Number(req.query?.maxRating);

  const barberId = req.query?.barberId ? Number(req.query.barberId) : undefined;

  if (
    (minRating !== undefined && (Number.isNaN(minRating) || minRating < 1 || minRating > 5)) ||
    (maxRating !== undefined && (Number.isNaN(maxRating) || maxRating < 1 || maxRating > 5))
  ) {
    throw new ApiError(400, 'Invalid rating filter');
  }

  if (minRating !== undefined && maxRating !== undefined && minRating > maxRating) {
    throw new ApiError(400, 'minRating cannot be greater than maxRating');
  }

  const where = {
    ...(barberId !== undefined && !Number.isNaN(barberId) ? { barberId } : {}),
    ...(minRating !== undefined || maxRating !== undefined
      ? {
          rating: {
            ...(minRating !== undefined && { gte: minRating }),
            ...(maxRating !== undefined && { lte: maxRating }),
          },
        }
      : {}),
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        bookingId: true,
        user: {
          select: {
            name: true,
          },
        },
        barber: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({ where }),
  ]);

  const formatted = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    bookingId: r.bookingId,
    userName: r.user?.name ?? null,
    barberName: r.barber?.user?.name ?? null,
  }));

  const pagination = paginationFn({ total, page, limit });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { reviews: formatted, pagination },
        formatted.length ? 'Reviews fetched successfully' : 'No reviews found',
      ),
    );
});

// [12] adminDeleteReview
export const adminDeleteReview = asyncHandler(async (req, res) => {
  const reviewId = parseAndValidateId({ value: req.params?.reviewId, name: 'review Id' });

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true, barberId: true },
  });

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  const barberId = review.barberId;

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({
      where: { id: reviewId },
    });
    await recalculateBarberRating({ barberId, tx });
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { id: reviewId, barberId }, 'Review deleted successfully'));
});

// [13] getAllContactMessages
export const getAllContactMessages = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams({
    page: req.query?.page,
    limit: req.query?.limit,
  });

  const status = req.query?.status;

  if (status && !['PENDING', 'RESOLVED'].includes(status)) {
    throw new ApiError(400, 'Invalid status filter');
  }

  const where = status ? { status } : {};

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        service_need: true,
        message: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  const pagination = paginationFn({ total, page, limit });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { messages, pagination },
        messages.length ? 'Contact messages fetched successfully' : 'No messages found',
      ),
    );
});

// [14] updateContactStatus
export const updateContactStatus = asyncHandler(async (req, res) => {
  const id = parseAndValidateId({ value: req.params?.id, name: 'message id' });

  const { status } = req.body;

  if (!status || !['PENDING', 'RESOLVED'].includes(status)) {
    throw new ApiError(400, 'status must be PENDING or RESOLVED');
  }

  const existing = await prisma.contactMessage.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw new ApiError(404, 'Contact message not found');
  }

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      status: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return res.status(200).json(new ApiResponse(200, updated, 'Contact status updated successfully'));
});

// [15] getAdminDashboard
export const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    barbersByStatus,
    bookingsByStatus,
    totalReviews,
    avgPlatformRating,
    pendingApprovals,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.barber.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    prisma.booking.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    prisma.review.count(),
    prisma.review.aggregate({
      _avg: { rating: true },
    }),
    prisma.barber.count({
      where: { status: 'PENDING' },
    }),
  ]);

  const barbersGrouped = { PENDING: 0, APPROVED: 0, SUSPENDED: 0 };
  for (const row of barbersByStatus) {
    barbersGrouped[row.status] = row._count._all;
  }

  const bookingsGrouped = { PENDING: 0, CONFIRMED: 0, CANCELLED: 0, COMPLETED: 0 };
  for (const row of bookingsByStatus) {
    bookingsGrouped[row.status] = row._count._all;
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        totalBarbersByStatus: barbersGrouped,
        totalBookingsByStatus: bookingsGrouped,
        totalReviews,
        avgPlatformRating: avgPlatformRating._avg.rating ?? 0,
        pendingApprovals: pendingApprovals,
      },
      'Dashboard stats fetched successfully',
    ),
  );
});

// [16] getRevenueReport
export const getRevenueReport = asyncHandler(async (req, res) => {
  const dateFrom = req.query?.dateFrom;
  const dateTo = req.query?.dateTo;
  const barberId = req.query?.barberId
    ? parseAndValidateId({ value: req.query.barberId, name: 'barber id' })
    : undefined;

  const updatedAt = {};

  if (dateFrom) {
    updatedAt.gte = getStartOfDayUTC({ date: parseDateUTC({ dateStr: dateFrom }) });
  }
  if (dateTo) {
    updatedAt.lte = getEndOfDayUTC({ date: parseDateUTC({ dateStr: dateTo }) });
  }

  if (!dateFrom && !dateTo) {
    // no date filter — full history of completed bookings
  }

  const bookings = await prisma.booking.findMany({
    where: {
      status: 'COMPLETED',
      ...(barberId !== undefined && !Number.isNaN(barberId) ? { barberId } : {}),
      ...(Object.keys(updatedAt).length ? { updatedAt } : {}),
    },
    select: {
      id: true,
      updatedAt: true,
      barberId: true,
      service: {
        select: { price: true },
      },
    },
  });

  const byMonth = new Map();

  for (const b of bookings) {
    const key = monthKeyUTC(b.updatedAt);
    const prev = byMonth.get(key) || { month: key, revenue: 0, bookingCount: 0 };
    prev.revenue += Number(b.service.price);
    prev.bookingCount += 1;
    byMonth.set(key, prev);
  }

  const months = Array.from(byMonth.values()).sort((a, b) => a.month.localeCompare(b.month));

  const grandTotal = months.reduce((s, m) => s + m.revenue, 0);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        months,
        grandTotal,
        completedCount: bookings.length,
        filters: {
          dateFrom: dateFrom ?? null,
          dateTo: dateTo ?? null,
          barberId: barberId ?? null,
        },
      },
      'Revenue report generated successfully',
    ),
  );
});

// [17] getAdminProfile
export const getAdminProfile = asyncHandler(async (req, res) => {
  const adminId = parseAndValidateId({ value: req.user?.id, name: 'admin id' });

  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      imageUrl: true,
      imagePublicId: true,
      role: true,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, admin, admin ? 'Admin profile fetched successfully' : 'No admin found'),
    );
});

// [18] updateAdminProfile
export const updateAdminProfile = asyncHandler(async (req, res) => {
  const adminId = parseAndValidateId({ value: req.user?.id, name: 'admin id' });

  const { name, phone } = req.body;

  const updated = await prisma.user.update({
    where: { id: adminId },
    data: {
      name: String(name).trim(),
      phone: String(phone).trim(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      imageUrl: true,
      imagePublicId: true,
      role: true,
    },
  });

  if (!updated) {
    throw new ApiError(404, 'Failed to update admin profile');
  }

  return res.status(200).json(new ApiResponse(200, updated, 'Admin profile updated successfully'));
});

// [19] updateAdminImage
export const updateAdminImage = asyncHandler(async (req, res) => {
  const adminId = parseAndValidateId({ value: req.user?.id, name: 'admin id' });

  const file = req.file?.path;

  if (!file) {
    throw new ApiError(400, 'Image file is required');
  }

  const admin = await verifyAdmin({ adminId: adminId });

  const uploaded = await uploadProfileImage({
    userId: admin.id,
    filePath: file,
    oldImageId: admin.imagePublicId,
  });

  return res.status(200).json(new ApiResponse(200, uploaded, 'Admin profile updated successfully'));
});

// [20] updateAdminPassword
export const updateAdminPassword = asyncHandler(async (req, res) => {
  const adminId = parseAndValidateId({ value: req.user?.id, name: 'admin id' });

  const { oldPassword, newPassword } = req.body;

  const admin = await verifyAdmin({ adminId: adminId });

  const user = await VerifyAndUpdatePassword({
    userId: admin.id,
    oldPassword: oldPassword,
    newPassword: newPassword,
    existingPasswordHash: admin.passwordHash,
  });

  return res.status(200).json(new ApiResponse(200, user, 'Admin profile updated successfully'));
});
