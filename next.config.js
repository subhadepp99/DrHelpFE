/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove any experimental app directory settings
  images: {
    domains: ["localhost", "your-backend-domain.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
