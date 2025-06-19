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
  // Fix for client-reference-manifest.js error
  experimental: {
    serverComponentsExternalPackages: [],
    optimizePackageImports: []
  },
  // Disable image optimization warnings
  images: {
    unoptimized: true,
  },
  // Disable strict mode for now
  reactStrictMode: false,
  // Use the older output format
  output: 'export',
};

export default nextConfig; 