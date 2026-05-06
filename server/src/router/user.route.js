import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadUserProfileImage,
  getAvailableTimeSlots,
  createBooking,
  cancelBooking,
  getMyBookings,
  addReview,
  updateReview,
  deleteReview,
} from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/role.middleware.js';

const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.use(roleMiddleware(['USER']));

userRouter.get('/profile', getProfile);
userRouter.put('/profile', updateProfile);
userRouter.put('/profile/image', upload.single('image'), uploadUserProfileImage);
userRouter.put('/change-password', changePassword);
userRouter.get('/barber/:id/slots', getAvailableTimeSlots);
userRouter.post('/booking', createBooking);
userRouter.patch('/booking/:id', cancelBooking);
userRouter.get('/booking', getMyBookings);

// I stoped Here
userRouter.post('/booking/:id/review', addReview);
userRouter.put('/booking/:id/review', updateReview);
userRouter.delete('/booking/:id/review', deleteReview);

export default userRouter;
