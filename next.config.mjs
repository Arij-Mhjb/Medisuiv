/** @type {import('next').NextConfig} */
const repoName = 'smart-home-dashboard';

const isStaticExport = process.env.STATIC_EXPORT === 'true';
const apiUrl = process.env.API_URL || 'http://localhost:8080';
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  ...(isStaticExport ? {
    output: 'export',
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
  } : {
    output: 'standalone',
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/api/:path*`,
        },
      ];
    },
  }),
};

export default nextConfig;
