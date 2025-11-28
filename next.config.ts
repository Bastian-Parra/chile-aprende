import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "C:\\Users\\basti\\desktop\\dev\\projects\\chile-aprende",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "twfebreuxttgjfydquft.supabase.co",
        pathname: "/storage/**",
      }
    ]
  }
};

export default nextConfig;