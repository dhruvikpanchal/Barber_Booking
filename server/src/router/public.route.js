import { Router } from 'express';
import { ContactUs } from '../controllers/public.controller.js';

const publicRouter = Router();

publicRouter.post('/contact', ContactUs);

export default publicRouter;
