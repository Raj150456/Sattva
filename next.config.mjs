/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,  // ✅ Enable Next.js image optimization
  },
}

export default nextConfig
