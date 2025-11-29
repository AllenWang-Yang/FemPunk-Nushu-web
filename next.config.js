/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://fempunk-nushu-service.onrender.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;