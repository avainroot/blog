/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  assetPrefix: '/blog-static',
  reactStrictMode: true,
  swcMinify: true,
  env: {
    PUBLIC_URL: '/blog-static'
  },
  images: {
    domains: [
      'localhost',
    ],
    path: '/blog-static/_next/image'
  },
  async rewrites() {
    return [
      {
       source: `/blog-static/_next/data/:path*`,
       destination: '/_next/data/:path*'
      },
      {
       source: `/blog-static/_next/image`,
       destination: '/_next/image'
      },
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    config.module.rules.push({
      test: /\.mp3$/,
      loader: 'file-loader'
    })
    return config
  },
}

module.exports = nextConfig
