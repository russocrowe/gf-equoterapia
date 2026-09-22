import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-green text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/40 font-display text-sm font-semibold">
              GF
            </span>
            <span className="font-display text-base font-semibold">
              GF Equoterapia
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-paper/80">
            Cada pessoa, uma história. Cada encontro, um cuidado.
          </p>
        </div>
        <nav className="flex gap-6 font-display text-sm">
          <Link href="/" className="text-paper/80 hover:text-paper">
            Início
          </Link>
          <Link href="/sobre" className="text-paper/80 hover:text-paper">
            Sobre nós
          </Link>
          <Link href="/blog" className="text-paper/80 hover:text-paper">
            Blog
          </Link>
        </nav>
      </div>
      <div className="border-t border-paper/10 px-6 py-4 text-center text-xs text-paper/60">
        © {new Date().getFullYear()} GF Equoterapia
      </div>
    </footer>
  );
}
