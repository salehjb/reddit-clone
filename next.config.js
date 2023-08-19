/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com", "uploadthing.com"],
  },
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
