// [8] Delete Booking from User controller
export const deleteBooking = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const bookingId = Number(req.params.bookingId);

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (!bookingId || isNaN(bookingId)) {
    throw new ApiError(400, 'Valid booking ID is required');
  }

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: {
        bookingSlots: {
          select: { slotId: true },
        },
      },
    });

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ApiError(403, 'You are not allowed to delete this booking');
    }

    if (booking.status !== 'CANCELLED') {
      throw new ApiError(400, 'Only cancelled bookings can be deleted');
    }

    const slotIds = booking.bookingSlots.map((s) => s.slotId);

    if (slotIds.length > 0) {
      await tx.timeSlot.updateMany({
        where: {
          id: { in: slotIds },
          status: { in: ['ONLINE_BOOKED', 'WALKIN'] },
        },
        data: {
          status: 'AVAILABLE',
        },
      });
    }

    await tx.bookingSlot.deleteMany({
      where: { bookingId },
    });

    const deletedBooking = await tx.booking.delete({
      where: { id: bookingId },
    });

    return deletedBooking;
  });

  return res.status(200).json(new ApiResponse(200, result, 'Booking deleted successfully'));
});
