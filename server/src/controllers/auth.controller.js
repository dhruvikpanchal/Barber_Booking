import { prisma } from '../config/prismaClient.js';
import bcrypt from 'bcrypt';

// Utils
import {
  asyncHandler,
  ApiError,
  ApiResponse,
  generateToken,
  forgotPasswordOTPContent,
  sendEmail,
  verifyToken,
} from '../utils/index.js';

/*===========================================================================
                            Main Functions
=============================================================================*/

// [1] Register User
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
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new ApiError(400, 'User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim(),
      passwordHash: hashedPassword,
      role: safeRole,
      provider: 'EMAIL',
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      imageUrl: true,
      role: true,
      isActive: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });

  if (safeRole === 'BARBER') {
    await prisma.barber.create({
      data: {
        userId: user.id,
        status: 'PENDING',
      },
    });
  }

  const token = generateToken({ id: user.id, role: user.role });

  const responseData = { user, token };

  res.status(201).json(new ApiResponse(201, responseData, 'User registered successfully'));
});

// [2] login User
export const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim() },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      imageUrl: true,
      passwordHash: true,
      role: true,
      isActive: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user?.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account is not active');
  }

  const { passwordHash, ...safeUser } = user;

  const token = generateToken({ id: user.id, role: user.role });

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
      email: email.trim(),
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
    mailgenContent: forgotPasswordOTPContent({ username: user.name, otp: otp }),
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
      email: email.trim(),
    },
  });

  if (!user || user.resetPasswordOtp !== otp || new Date(user.resetPasswordExpires) < new Date()) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  return res.status(200).json(new ApiResponse(200, { message: 'OTP verified successfully' }));
});

// [5] Resend OTP
export const ResendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email.trim(),
    },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      isEmailVerified: true,
      resetPasswordOtp: true,
      resetPasswordExpires: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.resetPasswordExpires) {
    const now = new Date();
    const remainingTime = new Date(user.resetPasswordExpires) - now;

    if (remainingTime > 8 * 60 * 1000) {
      throw new ApiError(429, 'Please wait before requesting a new OTP');
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

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
    mailgenContent: forgotPasswordOTPContent({ username: user.name, otp: otp }),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { message: 'OTP Resend To your Email Successfully' }));
});

// [6] Reset Password
export const ResetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, otp } = req.body;

  if (!email || !newPassword || !otp) {
    throw new ApiError(400, 'Email, OTP and new password are required');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email.trim(),
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!user || user.resetPasswordOtp !== otp || new Date(user.resetPasswordExpires) < new Date()) {
    throw new ApiError(400, 'Invalid or expired OTP');
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

// [7] Logout User
export const LogoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  return res.status(200).json(new ApiResponse(200, { message: 'User logged out successfully' }));
});

// [8] Refresh Token
export const RefreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, 'Unauthorized');
  }

  const decodedToken = await verifyToken({ token: refreshToken });

  const user = await prisma.user.findUnique({
    where: {
      id: decodedToken.id,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const token = generateToken({ id: user.id, role: user.role });

  const responseData = { user, token };

  return res.status(200).json(new ApiResponse(200, responseData, 'Token refreshed successfully'));
});

// [9] Google Register or Login
// export const GoogleRegisterOrLogin = asyncHandler(async (req, res) => {});
