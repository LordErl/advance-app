/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removida a flag appDir que é obsoleta no Next.js 14+
  reactStrictMode: true,
  swcMinify: true,
  // Configuração para permitir imagens de domínios externos (como Supabase Storage)
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'images.unsplash.com',
      'randomuser.me',
      'kvekwxctslcoddwlvwhe.supabase.co',
    ],
  },
  // Configuração para o Supabase Storage
  async rewrites() {
    return [
      {
        source: '/storage/:path*',
        destination: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;