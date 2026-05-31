/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  webpack: (config, { dev }) => {
    // Windows: avoid flaky filesystem cache errors (EPERM/ENOENT) in dev.
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
