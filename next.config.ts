import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // This will turn off image optimization for all images
  },
};

export default nextConfig;
