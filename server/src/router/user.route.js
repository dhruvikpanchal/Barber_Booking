import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getBarberList,
  getBarberDetails,
  getAvailableTimeSlots,
  createBooking,
  cancelBooking,
  getMyBookings,
  addReview,
} from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/role.middleware.js';

const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.use(roleMiddleware(['USER']));

userRouter.get('/profile', getProfile);
userRouter.put('/profile', upload.single('image'), updateProfile);
userRouter.get('/barber', getBarberList);
userRouter.get('/barber/:id', getBarberDetails);
userRouter.get('/barber/:id/slots', getAvailableTimeSlots);
userRouter.post('/booking', createBooking);
userRouter.delete('/booking/:id', cancelBooking);
userRouter.get('/booking', getMyBookings);
userRouter.post('/booking/:id/review', addReview);

export default userRouter;
