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
  // O site público tem só Início, Sobre nós e Equoterapia (a lista de
  // matérias; cada matéria abre em /blog/<slug>). As demais páginas continuam
  // no código, mas redirecionam; para trazê-las de volta, apague a linha
  // correspondente e reponha o link em lib/nav.ts.
  async redirects() {
    return [
      { source: "/blog", destination: "/equoterapia", permanent: false },
      { source: "/condicoes", destination: "/", permanent: false },
      { source: "/contato", destination: "/", permanent: false },
      { source: "/politica-de-privacidade", destination: "/", permanent: false },
      { source: "/termos-de-uso", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
