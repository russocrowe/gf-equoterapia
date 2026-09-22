import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import { waLink } from "@/lib/site-config";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/equoterapia", label: "Equoterapia" },
  { href: "/condicoes", label: "Condições tratadas" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  return (
    <header className="relative border-b border-tinta/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-azul/40 font-display text-sm font-semibold text-azul">
            GF
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base font-semibold italic">
              Centro de Equoterapia GF
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 font-display text-sm font-medium lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-tinta/80 transition-colors hover:text-azul"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={waLink("Olá! Gostaria de agendar uma avaliação.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-azul px-5 py-2.5 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 lg:inline-flex"
          >
            Agendar avaliação
          </a>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
