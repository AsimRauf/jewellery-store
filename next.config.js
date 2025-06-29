/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    // Only show ESLint errors, not warnings, during build
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['res.cloudinary.com', 'www.camelliarts.com', 'cdn.brandfetch.io']
  }
}

module.exports = nextConfig