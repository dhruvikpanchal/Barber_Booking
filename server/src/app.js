import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Middleware
import { errorHandler } from './middleware/errorHandler.middleware.js';

// Routes
import publicRouter from './router/public.route.js';
import authRouter from './router/auth.route.js';
import userRouter from './router/user.route.js';
import barberRouter from './router/barber.route.js';
import adminRouter from './router/admin.route.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public/temp'));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

// Routes
app.use('/api/v1/public', publicRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/barber', barberRouter);
app.use('/api/v1/admin', adminRouter);

// Health check
app.get('/', (_, res) => {
  res.send('Website is Running...');
});

// Global error Handler
app.use(errorHandler);

export default app;
