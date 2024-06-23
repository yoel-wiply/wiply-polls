/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [{hostname: "pollswiply.fra1.cdn.digitaloceanspaces.com", protocol: "https"}]
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
};

module.exports = nextConfig;
