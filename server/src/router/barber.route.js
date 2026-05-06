import { Router } from 'express';
import { upload } from '../middleware/multer.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/role.middleware.js';
import {
  getBarberProfile,
  updateBarberProfile,
  uploadBarberProfileImage,
  changePassword,
  createService,
  updateService,
  toggleServiceStatus,
  deleteService,
  getServices,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedules,
  createTimeSlot,
  createBulkTimeSlots,
  getTimeSlots,
  updateTimeSlot,
  deleteTimeSlot,
  getBookings,
  updateBookingStatus,
  getBookingById,
  deleteBooking,
  toggleAvailability,
  getDashboardStats,
  getAllReviews,
  createWalkInBooking,
  getEarningsSummary,
} from '../controllers/barber.controller.js';

const barberRouter = Router();

barberRouter.use(authMiddleware);
barberRouter.use(roleMiddleware(['BARBER']));

barberRouter.get('/profile', getBarberProfile);
barberRouter.put('/profile', updateBarberProfile);
barberRouter.post('/profile/image', upload.single('image'), uploadBarberProfileImage);
barberRouter.post('/change-password', changePassword);
barberRouter.post('/services', createService);
barberRouter.put('/services/:id', updateService);
barberRouter.put('/services/:id/status', toggleServiceStatus);
barberRouter.delete('/services/:id', deleteService);
barberRouter.get('/services', getServices);
barberRouter.post('/schedules', createSchedule);
barberRouter.put('/schedules/:id', updateSchedule);
barberRouter.delete('/schedules/:id', deleteSchedule);
barberRouter.get('/schedules', getSchedules);
barberRouter.post('/slots', createTimeSlot);
barberRouter.post('/slots/bulk', createBulkTimeSlots);
barberRouter.get('/slots', getTimeSlots);
barberRouter.put('/slots/:id', updateTimeSlot);
barberRouter.delete('/slots/:id', deleteTimeSlot);
barberRouter.get('/bookings', getBookings);
barberRouter.put('/bookings/:id/status', updateBookingStatus);
barberRouter.get('/bookings/:id', getBookingById);
barberRouter.delete('/bookings/:id', deleteBooking);
barberRouter.put('/availability', toggleAvailability);
barberRouter.get('/dashboard', getDashboardStats);
barberRouter.get('/reviews', getAllReviews);
barberRouter.post('/bookings/walk-in', createWalkInBooking);
barberRouter.get('/earnings/summary', getEarningsSummary);

export default barberRouter;
