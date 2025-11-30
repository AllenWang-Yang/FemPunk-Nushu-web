/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ipfs.filebase.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.filebase.io',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: '**.ipfs.dweb.link',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
    ],
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