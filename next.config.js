/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  webpack: (config) => {
    // Fix for @react-pdf/renderer in Next.js
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
