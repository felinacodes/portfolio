import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: true,
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
