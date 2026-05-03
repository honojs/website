/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['yahoo-finance2'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.yahoo.com' },
      { protocol: 'https', hostname: '**.finnhub.io' },
      { protocol: 'https', hostname: 'finnhub.io' },
    ],
  },
}

export default nextConfig
