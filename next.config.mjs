/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Suppress hydration warnings in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    unoptimized: true,
    domains: [
      'znmrwfqycwlnrefksdaq.supabase.co',
      'supabase.co',
      'supabase.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Removed output: 'export' and related config to allow middleware
  // output: 'export',
  // trailingSlash: true,
  // distDir: 'out',
}

export default nextConfig
