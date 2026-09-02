import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // pdf-parse uses native Node dependencies (@napi-rs/canvas) that
  // Turbopack cannot bundle into ESM chunks. Keep them external so
  // Vercel loads them natively at runtime.
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],

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

  async headers() {
    return [
      {
        source: "/textures/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;