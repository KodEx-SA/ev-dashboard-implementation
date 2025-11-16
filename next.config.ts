import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: process.env.NODE_ENV === 'development' ? ['*'] : [],
};

export default nextConfig;
