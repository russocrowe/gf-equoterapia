import type { NextConfig } from "next";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl.trim()).hostname : null;

// Cabeçalhos de segurança em todas as páginas. A política de conteúdo cobre o
// que não atrapalha o Next: impede o site de ser embutido em outro (clique
// disfarçado), de ter <base>/<object> injetados e de enviar formulários para
// fora. Os demais são os padrões recomendados para sites públicos.
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
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
    // Endereço oficial: sem www e sem o endereço provisório da Vercel.
    const canonical = "https://equoterapiagf.com.br";
    const oldHosts = [
      "www.equoterapiagf.com.br",
      "gf-equoterapia.vercel.app",
    ];

    return [
      ...oldHosts.map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: `${canonical}/:path*`,
        permanent: true,
      })),
      { source: "/blog", destination: "/equoterapia", permanent: false },
      { source: "/condicoes", destination: "/", permanent: false },
      { source: "/contato", destination: "/", permanent: false },
      { source: "/politica-de-privacidade", destination: "/", permanent: false },
      { source: "/termos-de-uso", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
