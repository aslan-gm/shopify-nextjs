/** @type {import('next').NextConfig} */
import sassOptions from './config/style.js'

const nextConfig = {
  images: {
    domains: ['cdn.shopify.com'],
  },
  reactStrictMode: true,
  sassOptions,
}

export default nextConfig
