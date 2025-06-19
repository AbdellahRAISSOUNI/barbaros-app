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
  // Disable server actions for now to avoid compatibility issues
  experimental: {},
  // Enable static optimization where possible
  output: 'standalone',
  // Disable image optimization warnings
  images: {
    unoptimized: true,
  },
  // Disable strict mode for now
  reactStrictMode: false,
};

export default nextConfig; 