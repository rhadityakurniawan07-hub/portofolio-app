/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/database'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  turbopack: {
    root: import.meta.dirname + '/../..',
  },
}

export default nextConfig