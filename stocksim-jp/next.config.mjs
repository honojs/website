import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['yahoo-finance2'],
  outputFileTracingRoot: path.join(__dirname, '../'),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.yahoo.com' },
      { protocol: 'https', hostname: '**.finnhub.io' },
      { protocol: 'https', hostname: 'finnhub.io' },
    ],
  },
}

export default nextConfig
