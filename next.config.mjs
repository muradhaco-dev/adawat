/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Enable Brotli & Gzip compression for all text assets (CSS, JS, JSON, HTML)
  compress: true,

  // 2. SWC minification for ultra-optimized JavaScript bundles
  swcMinify: true,

  // 3. Remove Next.js powered-by header to reduce HTTP response overhead
  poweredByHeader: false,

  // 4. Production compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // 5. Optimize tree-shaking for heavy libraries
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'pdf-lib',
      'jspdf',
      'html2canvas',
      '@supabase/supabase-js',
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
