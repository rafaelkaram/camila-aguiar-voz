import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Logo files are served from /public — no remote domains needed
    remotePatterns: [],
  },
};

export default nextConfig;
