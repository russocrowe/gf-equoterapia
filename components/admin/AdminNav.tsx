"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const icon = {
  home: (
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />
  ),
  page: (
    <>
      <path d="M6 3h8l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  news: (
    <>
      <path d="M4 5h13a1 1 0 0 1 1 1v13H6a2 2 0 0 1-2-2V5Z" />
      <path d="M18 9h2v8a2 2 0 0 1-2 2M8 9h6M8 13h6" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="m21 16-5-5-9 9" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
};

function Icon({ name }: { name: keyof typeof icon }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      {icon[name]}
    </svg>
  );
}

type Item = {
  href: string;
  label: string;
  icon: keyof typeof icon;
  exact?: boolean;
  badge?: string;
};

const groups: { title?: string; items: Item[] }[] = [
  { items: [{ href: "/admin", label: "Visão geral", icon: "home", exact: true }] },
  {
    title: "Editar páginas",
    items: [
      { href: "/?editar=1", label: "Início", icon: "page", badge: "visual" },
      { href: "/sobre?editar=1", label: "Sobre nós", icon: "page", badge: "visual" },
      {
        href: "/equoterapia?editar=1",
        label: "Equoterapia",
        icon: "page",
        badge: "visual",
      },
    ],
  },
  {
    title: "Conteúdo",
    items: [
      { href: "/admin/materias", label: "Matérias", icon: "news" },
      { href: "/admin/imagens", label: "Imagens do site", icon: "image" },
    ],
  },
  {
    title: "Configurações",
    items: [{ href: "/admin/centro", label: "Informações do centro", icon: "pin" }],
  },
];

function NavItem({
  item,
  active,
  children,
}: {
  item: Item;
  active: boolean;
  children?: ReactNode;
}) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-[14.5px] font-medium transition-colors ${
        active
          ? "bg-navy text-white shadow-sm"
          : "text-body hover:bg-sage-soft hover:text-ink"
      }`}
    >
      <Icon name={item.icon} />
      <span>{item.label}</span>
      {children}
    </Link>
  );
}

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Editar site"
      className="-mx-6 flex gap-1 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0"
    >
      {groups.map((group, i) => (
        <div
          key={i}
          className="flex shrink-0 gap-1 lg:flex-col"
          role={group.title ? "group" : undefined}
          aria-label={group.title}
        >
          {group.title && (
            <p className="hidden px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-muted lg:block">
              {group.title}
            </p>
          )}
          {group.items.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : !item.href.includes("?") &&
                (pathname === item.href || pathname.startsWith(`${item.href}/`));
            return (
              <NavItem key={item.href} item={item} active={active}>
                {item.badge && (
                  <span className="ml-auto hidden rounded-full bg-gold/25 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-gold-ink lg:inline">
                    {item.badge}
                  </span>
                )}
              </NavItem>
            );
          })}
        </div>
      ))}

      <Link
        href="/"
        className="flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-[14.5px] font-medium text-muted hover:text-ink lg:mt-1 lg:border-t lg:border-rule lg:pt-4"
      >
        Ver site <span aria-hidden>↗</span>
      </Link>
    </nav>
  );
}
