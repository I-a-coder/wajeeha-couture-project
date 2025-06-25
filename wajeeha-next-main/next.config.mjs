import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wajeehacouture.com",
        port: "",
        pathname: "/assets/**",
      },
    ],
  },
  // Enable React Strict Mode for better error handling
  reactStrictMode: true,
};

// Dev platform setup for development environment
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
