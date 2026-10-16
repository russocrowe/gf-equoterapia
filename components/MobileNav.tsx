"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { displayName, useAuth } from "@/components/AuthProvider";
import { Avatar } from "@/components/UserMenu";
import { isActivePath, navLinks } from "@/lib/nav";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { loading, user, profile, isAdmin, signOut } = useAuth();

  const close = () => setOpen(false);
  const name = displayName(user, profile);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-rule-strong text-ink"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M1 1L17 17M17 1L1 17"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path
              d="M0 1H18M0 7H18M0 13H18"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        )}
      </button>

      {open && (
        <nav
          aria-label="Menu"
          className="absolute inset-x-0 top-full z-40 flex max-h-[calc(100vh-5rem)] flex-col gap-1 overflow-y-auto border-b border-rule bg-paper px-6 py-4 shadow-sm"
        >
          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-2 py-2.5 text-[15px] ${
                  active ? "bg-mist font-medium" : "hover:bg-mist"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="my-2 border-t border-rule" />

          {!loading && !user && (
            <Link
              href="/entrar"
              onClick={close}
              className="rounded-md px-2 py-2.5 text-[15px] hover:bg-mist"
            >
              Entrar
            </Link>
          )}

          {!loading && user && (
            <>
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar url={profile?.avatar_url} name={name} size={36} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{name}</p>
                  <p className="truncate text-xs">{user.email}</p>
                </div>
              </div>
              <Link
                href="/perfil"
                onClick={close}
                className="rounded-md px-2 py-2.5 text-[15px] hover:bg-mist"
              >
                Meu perfil
              </Link>
              <Link
                href="/perfil#senha"
                onClick={close}
                className="rounded-md px-2 py-2.5 text-[15px] hover:bg-mist"
              >
                Alterar senha
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={close}
                  className="rounded-md px-2 py-2.5 text-[15px] font-medium hover:bg-mist"
                >
                  Editar site
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  close();
                  void signOut();
                }}
                className="rounded-md px-2 py-2.5 text-left text-[15px] hover:bg-mist"
              >
                Sair
              </button>
            </>
          )}
        </nav>
      )}
    </div>
  );
}
