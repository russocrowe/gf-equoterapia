import type { NextConfig } from "next";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl.trim()).hostname : null;

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  // O site público tem só Início, Sobre nós e Equoterapia. As páginas de
  // condições, matérias e contato continuam no código, mas redirecionam;
  // para trazê-las de volta, apague estes redirecionamentos e reponha os
  // links em lib/nav.ts, no rodapé e no sitemap.
  async redirects() {
    return [
      { source: "/condicoes", destination: "/equoterapia", permanent: false },
      { source: "/contato", destination: "/", permanent: false },
      { source: "/blog", destination: "/", permanent: false },
      { source: "/blog/:slug*", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
