import Link from "next/link";
import Brand from "@/components/Brand";
import T from "@/components/editor/T";
import { InstagramIcon } from "@/components/icons";
import { getCenterInfo } from "@/lib/public-data";
import {
  filledValue as filled,
  instagramHandle,
  instagramUrl,
} from "@/lib/site-config";
import { navLinks } from "@/lib/nav";

export default async function Footer() {
  const center = await getCenterInfo();
  const contact = [
    [filled(center.address), filled(center.city)].filter(Boolean).join(" · "),
    filled(center.whatsapp) && `WhatsApp ${filled(center.whatsapp)}`,
    filled(center.email),
  ].filter(Boolean);
  const instagram = filled(center.instagram) ? center : null;

  return (
    <footer className="on-dark bg-forest-deep text-white">
      <div className="stripe" aria-hidden />
      <div className="mx-auto grid max-w-[1320px] items-start gap-10 px-6 pb-8 pt-12 md:px-12 lg:grid-cols-[1.3fr_1fr_1fr_auto]">
        <div>
          <Brand size={110} tone="dark" />
          <T k="footer.slogan" as="p" className="tagline mt-5 text-[1.7rem] leading-none" />
          <T k="footer.tagline" as="p" className="mt-3 max-w-[18rem] text-[14px] text-white/80" />
          {instagram && (
            <a
              href={instagramUrl(instagram)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${instagramHandle(instagram)} (abre em outra aba)`}
              className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-white/25 py-2 pl-3 pr-4 font-display text-[13px] font-semibold text-white transition-colors hover:border-gold hover:text-gold"
            >
              <InstagramIcon className="h-5 w-5" />
              {instagramHandle(instagram)}
            </a>
          )}
        </div>

        <nav aria-label="Rodapé" className="flex flex-col gap-2 lg:items-start">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-white/85 underline-offset-4 hover:text-white hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-[13px] text-white/85">
          {contact.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>

        <Link
          href="/entrar"
          className="text-[13px] text-white/85 underline-offset-4 hover:text-white hover:underline lg:text-right"
        >
          Área da equipe
        </Link>
      </div>

      {/* Filiações e parcerias */}
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-8 gap-y-5 px-6 py-7 md:px-12">
          <T
            k="footer.partners"
            as="p"
            className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-gold"
          />
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl bg-white p-3 shadow-[0_14px_26px_-18px_rgb(0_0_0/0.7)]">
              {/* Sem next/image: as logos vão como estão, sem recompressão */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/parceiros/ande-brasil.webp"
                alt="ANDE-Brasil, Associação Nacional de Equoterapia"
                width={410}
                height={608}
                loading="lazy"
                decoding="async"
                className="h-[104px] w-auto"
              />
            </div>
            <div className="rounded-2xl bg-white p-3 shadow-[0_14px_26px_-18px_rgb(0_0_0/0.7)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/parceiros/equo-abqm.webp"
                alt="Equo ABQM, Quarto de Milha"
                width={881}
                height={398}
                loading="lazy"
                decoding="async"
                className="h-[104px] w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-[1320px] px-6 py-5 text-[13px] text-white/75 md:px-12">
          © {new Date().getFullYear()} Centro de Equoterapia GF
          {filled(center.cnpj) && ` · CNPJ ${filled(center.cnpj)}`}
        </div>
      </div>
    </footer>
  );
}
