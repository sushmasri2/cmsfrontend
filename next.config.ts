import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.exper.com',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'admin.exper.com',
      'github.com',
      'avatars.githubusercontent.com',
      'ui-avatars.com',
      'lh3.googleusercontent.com',
      'lh4.googleusercontent.com',
      'lh5.googleusercontent.com',
      'lh6.googleusercontent.com'
    ], // Fallback for older Next.js versions
  },
  async headers() {
    // Get API URLs from environment
    let apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    apiUrl = apiUrl.replace('/api', ''); // Remove /api if present

    const courseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_COURSE || '';

    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Allow scripts from these sources
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://static.cloudflareinsights.com",
              // Allow styles from these sources
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
              // Allow images from these sources (including any HTTPS domain for partner logos)
              "img-src 'self' data: https: https://*.googleusercontent.com https://github.com https://avatars.githubusercontent.com https://ui-avatars.com https://admin.exper.com",
              // Allow fonts from these sources
              "font-src 'self' https://fonts.gstatic.com",
              // Allow frames from these sources - important for Google auth
              "frame-src 'self' https://accounts.google.com",
              // Allow sites that can embed this app in frames
              "frame-ancestors 'self' https://accounts.google.com",
              // Allow connections to these sources - include both API URLs
              `connect-src 'self' https://oauth2.googleapis.com ${apiUrl}${courseApiUrl ? ` ${courseApiUrl}` : ''}`
            ].join('; ')
          }
        ]
      }
    ];
  }
};

export default nextConfig;