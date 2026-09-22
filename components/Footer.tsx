import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="bg-azul-escuro text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 font-display text-sm font-semibold">
              GF
            </span>
            <span className="font-display text-base font-semibold italic">
              Centro de Equoterapia GF
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/70">
            Equoterapia com equipe multiprofissional, em um ambiente
            acolhedor, para crianças, jovens e adultos.
          </p>
        </div>

        <div>
          <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-white/50">
            Institucional
          </h3>
          <nav className="mt-4 flex flex-col gap-2 text-sm text-white/80">
            <Link href="/sobre" className="hover:text-white">
              Sobre o centro
            </Link>
            <Link href="/sobre#equipe" className="hover:text-white">
              Equipe
            </Link>
            <Link href="/sobre#estrutura" className="hover:text-white">
              Estrutura e cavalos
            </Link>
            <Link href="/#faq" className="hover:text-white">
              Perguntas frequentes
            </Link>
            <Link href="/contato" className="hover:text-white">
              Contato
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-white/50">
            Conteúdo
          </h3>
          <nav className="mt-4 flex flex-col gap-2 text-sm text-white/80">
            <Link href="/equoterapia" className="hover:text-white">
              O que é equoterapia?
            </Link>
            <Link href="/condicoes" className="hover:text-white">
              Condições tratadas
            </Link>
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-white/50">
            Contato
          </h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-white/80">
            <span>
              {siteConfig.address}
              <br />
              {siteConfig.city}
            </span>
            <span>WhatsApp {siteConfig.whatsappDisplay}</span>
            <span>{siteConfig.email}</span>
            <span>{siteConfig.instagramHandle}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Centro de Equoterapia GF · CNPJ{" "}
            {siteConfig.cnpj}
          </span>
          <div className="flex gap-4">
            <Link href="/politica-de-privacidade" className="hover:text-white">
              Política de privacidade
            </Link>
            <Link href="/termos-de-uso" className="hover:text-white">
              Termos de uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
