import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Menjaga aplikasi lebih stabil
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
