import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.DEV_ORIGIN ? [process.env.DEV_ORIGIN] : [],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wysaqvfpvwoylsgcxnli.supabase.co",
      },
    ],
  },
};

export default nextConfig;
