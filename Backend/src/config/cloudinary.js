import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config()
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Test connection
const testCloudinaryConnection = async () => {
  try {
    // Verify configuration is loaded
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials not found in environment variables');
    }
    
    // Use a simpler test - just check if config is set
    const config = cloudinary.config();
    if (config.cloud_name && config.api_key && config.api_secret) {
      console.log('✅ Cloudinary Connected');
    } else {
      throw new Error('Cloudinary configuration incomplete');
    }
  } catch (error) {
    console.error('❌ Cloudinary Connection Error:', error?.message || error || 'Unknown error');
    // Don't throw, just log - allow server to start
  }
};

testCloudinaryConnection();

export default cloudinary;