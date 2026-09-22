"use client";

import Link from "next/link";
import { useState } from "react";
import { waLink } from "@/lib/site-config";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/equoterapia", label: "Equoterapia" },
  { href: "/condicoes", label: "Condições tratadas" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-tinta/15 text-tinta"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M1 1L17 17M17 1L1 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path
              d="M0 1H18M0 7H18M0 13H18"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        )}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full flex flex-col gap-1 border-t border-tinta/10 bg-white px-6 py-4 font-display text-base font-medium shadow-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-tinta/85 hover:bg-azul-claro"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={waLink("Olá! Gostaria de agendar uma avaliação.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-azul px-5 py-2.5 text-sm font-semibold text-white"
          >
            Agendar avaliação
          </a>
        </nav>
      )}
    </div>
  );
}
