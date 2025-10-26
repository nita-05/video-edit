/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI || '',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  },
}

module.exports = nextConfig
