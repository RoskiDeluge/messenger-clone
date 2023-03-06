/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['aleph42.s3.amazonaws.com', 'platform-lookaside.fbsbx.com']
  },
  experimental: {
    appDir: true
  }
}
