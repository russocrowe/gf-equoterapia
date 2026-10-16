import Link from "next/link";
import Brand from "@/components/Brand";
import T from "@/components/editor/T";
import { getCenterInfo } from "@/lib/public-data";
import { filledValue as filled, instagramHandle } from "@/lib/site-config";
import { navLinks } from "@/lib/nav";

export default async function Footer() {
  const center = await getCenterInfo();
  const contact = [
    [filled(center.address), filled(center.city)].filter(Boolean).join(" · "),
    filled(center.whatsapp) && `WhatsApp ${filled(center.whatsapp)}`,
    filled(center.email),
    filled(center.instagram) && instagramHandle(center),
  ].filter(Boolean);

  return (
    <footer className="on-dark bg-forest-deep text-white">
      <div className="mx-auto grid max-w-[1320px] items-start gap-10 px-6 pb-8 pt-12 md:px-12 lg:grid-cols-[1.3fr_1fr_1fr_auto]">
        <div>
          <Brand size={110} tone="dark" />
          <T k="footer.slogan" as="p" className="tagline mt-5 text-[1.7rem] leading-none" />
          <T k="footer.tagline" as="p" className="mt-3 max-w-[18rem] text-[14px] text-white/80" />
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

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-[1320px] px-6 py-5 text-[13px] text-white/75 md:px-12">
          © {new Date().getFullYear()} Centro de Equoterapia GF
          {filled(center.cnpj) && ` · CNPJ ${filled(center.cnpj)}`}
        </div>
      </div>
    </footer>
  );
}
