/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ipfs.filebase.io'],
  },
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