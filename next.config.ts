import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /** public 폴더 이미지 — next/image 사용 시 허용 경로 명시 (Next 16) */
    localPatterns: [{ pathname: "/images/**", search: "" }],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rvdynugybryfluwihkmj.supabase.co",
      },
    ],
  },
};

export default nextConfig;