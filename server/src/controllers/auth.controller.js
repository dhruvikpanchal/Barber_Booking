import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { generateToken } from '../utils/jwt.js';
import { forgotPasswordOTPContent, sendEmail } from '../utils/mailtrap.js';

const prisma = new PrismaClient();

// [1] Register user
export const RegisterUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const safeRole = role === 'BARBER' ? 'BARBER' : 'USER';

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError(400, 'User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hashedPassword,
      role: safeRole,
      provider: 'EMAIL',
      isActive: true,
    },
  });

  if (safeRole === 'BARBER') {
    await prisma.barber.create({
      data: {
        userId: user.id,
      },
    });
  }

  const { passwordHash, ...safeUser } = user;

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  const responseData = { user: safeUser, token };

  res.status(201).json(new ApiResponse(201, responseData, 'User registered successfully'));
});

// [2] login User
export const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  });

  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid password');
  }

  if (!existingUser.isActive) {
    throw new ApiError(403, 'Your account is not active');
  }

  const { passwordHash, ...safeUser } = existingUser;

  const token = generateToken({
    id: existingUser.id,
    role: existingUser.role,
  });

  const responseData = { user: safeUser, token };

  res.status(200).json(new ApiResponse(200, responseData, 'User logged in successfully'));
});

// [3] Forget Password
export const ForgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min after expire

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      resetPasswordOtp: otp,
      resetPasswordExpires: new Date(expiresAt),
    },
  });

  await sendEmail({
    email: user.email,
    subject: 'Password Reset OTP',
    mailgenContent: forgotPasswordOTPContent(user.name, otp),
  });

  return res.status(200).json(new ApiResponse(200, { message: 'OTP sent to your email' }));
});

// [4] Verify Email
export const VerifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, 'Email and OTP are required');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  });

  if (!user || user.resetPasswordOtp !== otp || user.resetPasswordExpires < Date.now()) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  return res.status(200).json(new ApiResponse(200, { message: 'OTP verified successfully' }));
});

// [5] Reset Password
export const ResetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    throw new ApiError(400, 'Email and new password are required');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      passwordHash: hashedPassword,
      resetPasswordOtp: null,
      resetPasswordExpires: null,
    },
  });

  return res.status(200).json(new ApiResponse(200, { message: 'Password reset successful' }));
});

// [6] Logout User
export const LogoutUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res.status(200).json(new ApiResponse(200, { message: 'User logged out successfully' }));
});

// [7] Google Register or Login
