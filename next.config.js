/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['res.cloudinary.com', 'www.camelliarts.com', 'cdn.brandfetch.io']
  }
}

module.exports = nextConfig