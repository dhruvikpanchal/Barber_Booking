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
publicRouter.get('/barber/:id', getBarberDetails);
publicRouter.get('/barber/available-slots', getPublicAvailableSlots);

export default publicRouter;
