import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const remotePatterns = supabaseUrl
  ? [
      new URL("/storage/v1/object/public/hero-banners/**", supabaseUrl),
      new URL("/storage/v1/object/public/news-images/**", supabaseUrl),
      new URL("/storage/v1/object/public/event-images/**", supabaseUrl),
    ]
  : [];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
  images: { remotePatterns },
};

export default nextConfig;
