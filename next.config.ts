import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
