import type { NextConfig } from "next";
import path from "path/win32";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
      {
        protocol: "https",
        hostname: "graph.facebook.com",
      },
    ],
    unoptimized: true,
  },
    turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
