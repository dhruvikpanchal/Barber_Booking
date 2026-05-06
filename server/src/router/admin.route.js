import { Router } from 'express';
import { upload } from '../middleware/multer.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/role.middleware.js';
import {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  getAllBarbers,
  getBarberById,
  approveBarber,
  suspendBarber,
  reinstateBarber,
  getAllBookings,
  getBookingById,
  getAllReviews,
  adminDeleteReview,
  getAllContactMessages,
  updateContactStatus,
  getAdminDashboard,
  getRevenueReport,
  getAdminProfile,
  updateAdminProfile,
  updateAdminImage,
  updateAdminPassword,
} from '../controllers/admin.controller.js';

const adminRouter = Router();

adminRouter.use(authMiddleware);
adminRouter.use(roleMiddleware(['ADMIN']));

adminRouter.get('/profile', getAdminProfile);
adminRouter.put('/profile', updateAdminProfile);
adminRouter.put('/profile/image', upload.single('image'), updateAdminImage);
adminRouter.put('/change-password', updateAdminPassword);
adminRouter.get('/dashboard', getAdminDashboard);
adminRouter.get('/users', getAllUsers);
adminRouter.get('/users/:userId', getUserById);
adminRouter.patch('/users/:userId/status', toggleUserStatus);

adminRouter.get('/barbers', getAllBarbers);
adminRouter.get('/barbers/:barberId', getBarberById);
adminRouter.post('/barbers/:barberId/approve', approveBarber);
adminRouter.post('/barbers/:barberId/suspend', suspendBarber);
adminRouter.post('/barbers/:barberId/reinstate', reinstateBarber);

adminRouter.get('/bookings', getAllBookings);
adminRouter.get('/bookings/:bookingId', getBookingById);
adminRouter.get('/reviews', getAllReviews);
adminRouter.delete('/reviews/:reviewId', adminDeleteReview);

adminRouter.get('/contact-messages', getAllContactMessages);
adminRouter.patch('/contact-messages/:id', updateContactStatus);

// Need Improvement
adminRouter.get('/reports/revenue', getRevenueReport);

export default adminRouter;
