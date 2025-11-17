import type { NextConfig } from "next";

module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: process.env.NODE_ENV === 'development' ? ['*'] : [],
};

export default nextConfig;
