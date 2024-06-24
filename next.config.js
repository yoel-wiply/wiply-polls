/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "pollswiply.fra1.cdn.digitaloceanspaces.com",
        protocol: "https",
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Disable code splitting by setting optimization.splitChunks to false
    if (!isServer) {
      config.optimization.splitChunks = {
        cacheGroups: {
          default: false,
          vendors: false,
        },
      };
      config.optimization.runtimeChunk = false;
    }
    // Optionally, you may want to set other webpack optimizations
    // For example, to minimize the output bundle:
    config.optimization.minimize = true;

    return config;
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=7200, stale-while-revalidate=59',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
