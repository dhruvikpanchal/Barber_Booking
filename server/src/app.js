import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static('temp'));

// routes

export default app;
