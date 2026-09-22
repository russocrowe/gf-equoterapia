import Link from "next/link";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/30 font-display text-sm font-semibold">
            GF
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-semibold">
              GF Equoterapia
            </span>
            <span className="text-[11px] uppercase tracking-wide text-muted">
              Cuidado que aproxima
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 font-display text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink/80 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
