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
  experimental: {
    // Enable server actions as an object
    serverActions: {
      allowedOrigins: ["localhost:3000", "barbaros-app.vercel.app"],
    },
  },
};

export default nextConfig; 