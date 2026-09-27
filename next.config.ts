import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      swr: path.resolve(process.cwd(), "node_modules/swr/dist/index/index.js"),
    };
    return config;
  },
};

export default nextConfig;
