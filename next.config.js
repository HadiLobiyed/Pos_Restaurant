/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
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
