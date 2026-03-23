import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rvdynugybryfluwihkmj.supabase.co",
      },
    ],
  },
};

export default nextConfig;