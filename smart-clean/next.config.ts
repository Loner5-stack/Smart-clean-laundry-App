import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 💡 Tell Next.js to trust connections from this specific IP
  allowedDevOrigins: ["192.168.100.61"],
};

export default nextConfig;
