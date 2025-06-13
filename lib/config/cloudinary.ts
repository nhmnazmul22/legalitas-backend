import { v2 as cloudinary, ConfigOptions } from "cloudinary";

const config: ConfigOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
};

cloudinary.config(config);

export default cloudinary;
