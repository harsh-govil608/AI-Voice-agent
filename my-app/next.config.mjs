/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  webpack: (config, { dev, isServer }) => {
    // Fix for Jest worker issues
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    
    // Disable cache in development to prevent worker issues
    if (dev) {
      config.cache = false;
    }

    return config;
  },
  // Reduce memory usage
  experimental: {
    workerThreads: false,
    cpus: 1
  }
};

export default nextConfig;
