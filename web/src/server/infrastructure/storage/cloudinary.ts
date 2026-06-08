import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { appConfig, env } from "@/server/config";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UploadResult = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
};

export async function uploadImage(
  source: string | Buffer,
  folder: string = appConfig.cloudinary.defaultFolder,
  options: Record<string, unknown> = {},
): Promise<UploadResult> {
  const result: UploadApiResponse = await new Promise((resolve, reject) => {
    const callback = (error: unknown, uploadResult: UploadApiResponse | undefined) => {
      if (error) return reject(error);
      resolve(uploadResult!);
    };

    if (typeof source === "string") {
      cloudinary.uploader.upload(source, { folder, ...options }, callback);
    } else {
      cloudinary.uploader.upload_stream({ folder, ...options }, callback).end(source);
    }
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getOptimisedUrl(
  publicId: string,
  opts: { width?: number; height?: number; quality?: number } = {},
): string {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: opts.quality ?? "auto",
    width: opts.width,
    height: opts.height,
    crop: opts.width || opts.height ? "fill" : undefined,
  });
}
