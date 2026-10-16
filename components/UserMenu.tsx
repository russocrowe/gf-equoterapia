"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { displayName, useAuth } from "@/components/AuthProvider";

export function Avatar({
  url,
  name,
  size = 32,
}: {
  url: string | null | undefined;
  name: string;
  size?: number;
}) {
  if (url) {
    return (
      <Image
        src={url}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex items-center justify-center rounded-full bg-navy font-display text-xs font-bold uppercase text-white"
      style={{ width: size, height: size }}
    >
      {name.trim().charAt(0) || "?"}
    </span>
  );
}

const itemClass =
  "block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-mist";

export default function UserMenu() {
  const { loading, user, profile, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Reserva o espaço enquanto carrega, para o cabeçalho não "pular".
  if (loading) {
    return <span aria-hidden className="hidden h-10 w-[72px] lg:block" />;
  }

  if (!user) {
    return (
      <Link
        href="/entrar"
        className="hidden items-center gap-2 border-b border-transparent pb-[5px] text-sm hover:border-rule-strong lg:inline-flex"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M4 20c0-4 3.6-6 8-6s8 2 8 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        Entrar
      </Link>
    );
  }

  const name = displayName(user, profile);
  const firstName = name.split(" ")[0];

  return (
    <div ref={containerRef} className="relative hidden lg:block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Menu da conta de ${name}`}
        className="flex items-center gap-2 rounded-full border border-rule-strong py-1 pl-1 pr-3 text-sm hover:border-navy"
      >
        <Avatar url={profile?.avatar_url} name={name} />
        <span className="hidden max-w-[110px] truncate 2xl:inline">{firstName}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M2 4.5L6 8.5L10 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-rule-strong bg-paper p-2 shadow-lg"
        >
          <p className="truncate px-3 py-2 text-xs">{user.email}</p>
          <div className="my-1 border-t border-rule" />
          <Link
            role="menuitem"
            href="/perfil"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            Meu perfil
          </Link>
          <Link
            role="menuitem"
            href="/perfil#senha"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            Alterar senha
          </Link>
          {isAdmin && (
            <Link
              role="menuitem"
              href="/admin"
              onClick={() => setOpen(false)}
              className={`${itemClass} font-medium`}
            >
              Editar site
            </Link>
          )}
          <div className="my-1 border-t border-rule" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              void signOut();
            }}
            className={itemClass}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
