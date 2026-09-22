import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} — Equoterapia em ${siteConfig.city}`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Equoterapia com equipe multiprofissional, em um ambiente acolhedor, para crianças, jovens e adultos.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: siteConfig.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${sourceSans.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-areia text-tinta font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              name: siteConfig.name,
              description:
                "Centro de equoterapia com equipe multiprofissional, dedicado ao desenvolvimento e bem-estar de crianças, jovens e adultos.",
              url: siteUrl,
              address: {
                "@type": "PostalAddress",
                streetAddress: siteConfig.address,
                addressLocality: siteConfig.city,
              },
              telephone: siteConfig.whatsappDisplay,
              email: siteConfig.email,
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
