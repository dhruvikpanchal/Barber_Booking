import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async ({ localFilePath }) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: 'User_Images',
    });

    return {
      url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    return null;
  } finally {
    try {
      if (localFilePath) {
        await fs.unlink(localFilePath);
        console.log('Temp file deleted:', localFilePath);
      }
    } catch (err) {
      console.error('File delete failed:', err.message);
    }
  }
};

const deleteFromCloudinary = async ({ publicId }) => {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
