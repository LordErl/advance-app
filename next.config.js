/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // A opção appDir foi removida pois agora é padrão no Next.js 14+
  // Configuração para permitir imagens de domínios externos (como Supabase Storage)
  images: {
    domains: ['kvekwxctslcoddwlvwhe.supabase.co'],
  },
};

module.exports = nextConfig;