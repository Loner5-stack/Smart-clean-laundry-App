import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 💡 Tell Next.js to trust connections from this specific IP
  allowedDevOrigins: ["192.168.100.61"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jdrbjsjelilbbsimzijy.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
