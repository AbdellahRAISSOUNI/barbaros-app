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
  // Disable image optimization warnings
  images: {
    unoptimized: true,
  },
  // Disable strict mode for now
  reactStrictMode: false,
  // Don't use static export as it doesn't support API routes
  // output: 'export',
};

export default nextConfig; 