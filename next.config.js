/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    swcMinify: true,
      webpack: (config) => {
        config.resolve.alias = {
          ...config.resolve.alias,
          '@': path.resolve(__dirname, 'src'),
  },
}

module.exports = nextConfig