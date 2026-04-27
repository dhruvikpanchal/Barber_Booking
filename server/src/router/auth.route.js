import {
  RegisterUser,
  LoginUser,
  ForgotPassword,
  VerifyOTP,
  ResetPassword,
  LogoutUser,
} from '../controllers/auth.controller.js';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/register', RegisterUser);
authRouter.post('/login', LoginUser);
authRouter.post('/forgot-password', ForgotPassword);
authRouter.post('/verify-otp', VerifyOTP);
authRouter.post('/reset-password', ResetPassword);
authRouter.post('/logout', LogoutUser);

export default authRouter;
