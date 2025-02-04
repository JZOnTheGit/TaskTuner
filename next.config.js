/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'judyfihihtcmbmwzdyof.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    domains: ['judyfihihtcmbmwzdyof.supabase.co'],
  },
  transpilePackages: ['react-big-calendar'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
}

module.exports = nextConfig 