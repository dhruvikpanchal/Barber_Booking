import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const prisma = new PrismaClient();

// [1] Contact Us
export const ContactUs = asyncHandler(async (req, res) => {
  const { name, email, phone, service_need, message } = req.body;

  if (!name || !email || !phone || !service_need || !message) {
    throw new ApiError(400, 'All fields are required');
  }

  const contact = await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone,
      service_need,
      message,
      status: 'PENDING',
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { message: 'Contact form submitted successfully' }));
});
