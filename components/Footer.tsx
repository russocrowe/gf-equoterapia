import Link from "next/link";
import Brand from "@/components/Brand";
import { getCenterInfo } from "@/lib/public-data";
import { instagramHandle } from "@/lib/site-config";

const columnTitle =
  "mb-4 text-xs font-bold uppercase tracking-[2px] text-gold";
const footerLink =
  "text-[13px] text-white/85 underline-offset-4 hover:text-white hover:underline";

export default async function Footer() {
  const center = await getCenterInfo();
  const instagram = instagramHandle(center);

  return (
    <footer className="on-dark bg-forest-deep text-white">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-6 pb-8 pt-14 sm:grid-cols-2 md:px-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Brand size={110} tone="dark" />
          <p className="tagline mt-5 text-[1.6rem] leading-none">
            Cuidando de Vidas
          </p>
          <p className="mt-3 max-w-[16rem] text-[13px] text-white/80">
            Cuidado, segurança e acolhimento a cada passo.
          </p>
        </div>

        <nav aria-label="Institucional" className="flex flex-col gap-2">
          <h3 className={columnTitle}>Institucional</h3>
          <Link href="/" className={footerLink}>
            Início
          </Link>
          <Link href="/sobre" className={footerLink}>
            Sobre nós
          </Link>
          <Link href="/sobre#equipe" className={footerLink}>
            Equipe
          </Link>
          <Link href="/sobre#estrutura" className={footerLink}>
            Estrutura e cavalos
          </Link>
          <Link href="/contato" className={footerLink}>
            Contato
          </Link>
        </nav>

        <nav aria-label="Conteúdo" className="flex flex-col gap-2">
          <h3 className={columnTitle}>Conteúdo</h3>
          <Link href="/equoterapia" className={footerLink}>
            Equoterapia
          </Link>
          <Link href="/condicoes" className={footerLink}>
            Condições tratadas
          </Link>
          <Link href="/blog" className={footerLink}>
            Matérias
          </Link>
          <Link href="/#faq" className={footerLink}>
            Perguntas frequentes
          </Link>
        </nav>

        <div className="flex flex-col gap-2 text-[13px] text-white/85">
          <h3 className={columnTitle}>Contato</h3>
          {(center.address || center.city) && (
            <span>
              {center.address}
              {center.address && center.city && <br />}
              {center.city}
            </span>
          )}
          {center.whatsapp && <span>WhatsApp {center.whatsapp}</span>}
          {center.email && <span>{center.email}</span>}
          {instagram && <span>{instagram}</span>}
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-6 py-5 text-[13px] text-white/75 sm:flex-row sm:items-center sm:justify-between md:px-12">
          <span>
            © {new Date().getFullYear()} Centro de Equoterapia GF
            {center.cnpj && ` · CNPJ ${center.cnpj}`}
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <Link href="/politica-de-privacidade" className="hover:text-white hover:underline">
              Política de privacidade
            </Link>
            <Link href="/termos-de-uso" className="hover:text-white hover:underline">
              Termos de uso
            </Link>
            <Link href="/entrar" className="hover:text-white hover:underline">
              Área da equipe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
