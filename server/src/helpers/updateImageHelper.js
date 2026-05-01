import { uploadOnCloudinary, deleteFromCloudinary, ApiError } from '../utils/index.js';
import { prisma } from '../config/prismaClient.js';

export const uploadProfileImage = async ({ userId, filePath, oldImageId }) => {
  if (!filePath) {
    throw new ApiError(400, 'Image file is required');
  }

  const uploadedImage = await uploadOnCloudinary({
    localFilePath: filePath,
  });

  if (!uploadedImage?.url || !uploadedImage?.public_id) {
    throw new ApiError(500, 'Image upload failed');
  }

  if (oldImageId) {
    try {
      await deleteFromCloudinary({ publicId: oldImageId });
    } catch (error) {
      console.warn('Previous image deletion failed:', error.message);
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      imageUrl: uploadedImage.url,
      imagePublicId: uploadedImage.public_id,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      imagePublicId: true,
    },
  });

  return user;
};
