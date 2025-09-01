/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  // Configuração para permitir imagens de domínios externos (como Supabase Storage)
  images: {
    domains: ['kvekwxctslcoddwlvwhe.supabase.co'],
  },
};

module.exports = nextConfig;