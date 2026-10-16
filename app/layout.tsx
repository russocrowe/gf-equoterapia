import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import EditBar from "@/components/editor/EditBar";
import { EditorProvider } from "@/components/editor/EditorProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCenterInfo } from "@/lib/public-data";
import { SITE_NAME, filledValue } from "@/lib/site-config";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

// Só para o slogan "Cuidando de Vidas", como na camisa do uniforme.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
});

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).trim();

export async function generateMetadata(): Promise<Metadata> {
  const center = await getCenterInfo();
  const city = filledValue(center.city);
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: city
        ? `${SITE_NAME} — Equoterapia em ${city}`
        : `${SITE_NAME} — Equoterapia`,
      template: `%s | ${SITE_NAME}`,
    },
    description:
      "Equoterapia que respeita cada pessoa, seu tempo e seu desenvolvimento. Equipe multiprofissional, cavalos preparados e um ambiente acolhedor.",
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: SITE_NAME,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const center = await getCenterInfo();

  return (
    <html lang="pt-BR" className={`${manrope.variable} ${dmSans.variable} ${cormorant.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper font-sans text-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              name: SITE_NAME,
              description:
                "Centro de equoterapia com equipe multiprofissional, dedicado ao desenvolvimento e bem-estar de crianças, jovens e adultos.",
              url: siteUrl,
              logo: `${siteUrl}/logo-gf-transparent.png`,
              address: {
                "@type": "PostalAddress",
                streetAddress: filledValue(center.address) || undefined,
                addressLocality: filledValue(center.city) || undefined,
              },
              telephone: filledValue(center.whatsapp) || undefined,
              email: filledValue(center.email) || undefined,
            }),
          }}
        />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Ir para o conteúdo
        </a>
        <AuthProvider>
          <EditorProvider>
            {/* A barra do administrador e o cabeçalho ficam juntos no topo */}
            <div className="sticky top-0 z-50">
              <EditBar />
              <Header />
            </div>
            <main id="conteudo" className="flex-1">
              {children}
            </main>
            <Footer />
          </EditorProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
