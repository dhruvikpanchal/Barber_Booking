import { prisma } from '../config/prismaClient.js';

export const recalculateBarberRating = async ({ barberId, tx = prisma }) => {
  const stats = await tx.review.aggregate({
    where: { barberId },
    _avg: { rating: true },
  });

  await tx.barber.update({
    where: { id: barberId },
    data: { averageRating: stats._avg.rating || 0 },
  });
};
