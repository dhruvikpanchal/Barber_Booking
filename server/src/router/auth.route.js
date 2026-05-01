import {
  RegisterUser,
  LoginUser,
  ForgotPassword,
  VerifyOTP,
  ResendOTP,
  ResetPassword,
  LogoutUser,
  RefreshToken,
} from '../controllers/auth.controller.js';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/register', RegisterUser);
authRouter.post('/login', LoginUser);
authRouter.post('/forgot-password', ForgotPassword);
authRouter.post('/verify-otp', VerifyOTP);
authRouter.post('/resend-otp', ResendOTP);
authRouter.post('/reset-password', ResetPassword);
authRouter.post('/refresh-token', RefreshToken);
authRouter.post('/logout', LogoutUser);

export default authRouter;
