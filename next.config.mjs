// @ts-check
/** @type {import('next').NextConfig} */

// next.config.mjs
import withPWA from 'next-pwa';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['inkspire-studio.vercel.app'],
  },
  reactStrictMode: true,
};

// Configuración de PWA
const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
};

// Exportar la configuración con PWA
export default withPWA(pwaConfig)(nextConfig);