import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Middleware
import { authMiddleware } from './middleware/auth.middleware.js';
import { roleMiddleware } from './middleware/role.middleware.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

// Routes
import authRouter from './router/auth.route.js';
import userRouter from './router/user.route.js';
import publicRouter from './router/public.route.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('temp'));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/public', publicRouter);
// app.use('/api/v1/barber', authMiddleware, roleMiddleware(['BARBER']), barberRouter);

// Health check
app.get('/', (_, res) => {
  res.send('Website is Running...');
});

// Global error Handler
app.use(errorHandler);

export default app;
