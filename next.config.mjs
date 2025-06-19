/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during build for now
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during build for now
    ignoreBuildErrors: true,
  },
  // Disable experimental features
  experimental: {},
  // Use the default output
  // Disable image optimization warnings
  images: {
    unoptimized: true,
  },
  // Disable strict mode for now
  reactStrictMode: false,
};

export default nextConfig; 