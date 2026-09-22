import type { Metadata } from "next";
import { Manrope, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GF Equoterapia — Cuidado que aproxima",
    template: "%s | GF Equoterapia",
  },
  description:
    "Entre o carinho, a natureza e a presença do cavalo, um espaço para acolher cada criança e respeitar seu tempo.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "GF Equoterapia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-paper text-ink font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "GF Equoterapia",
              description:
                "Espaço de equoterapia dedicado ao acolhimento, vínculo e respeito ao tempo de cada criança.",
              url: siteUrl,
            }),
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
