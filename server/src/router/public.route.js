import { Router } from 'express';
import {
  ContactUs,
  getBarberList,
  getBarberDetails,
  getPublicAvailableSlots,
} from '../controllers/public.controller.js';

const publicRouter = Router();

publicRouter.post('/contact', ContactUs);
publicRouter.get('/barber', getBarberList);
publicRouter.get('/barber/available-slots', getPublicAvailableSlots);
publicRouter.get('/barber/:id', getBarberDetails);

export default publicRouter;
