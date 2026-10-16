"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { href: "/admin", label: "Visão geral", exact: true },
  { href: "/admin/materias", label: "Matérias" },
  { href: "/admin/centro", label: "Informações do centro" },
  { href: "/admin/imagens", label: "Imagens do site" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Editar site"
      className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0"
    >
      {sections.map((section) => {
        const active = section.exact
          ? pathname === section.href
          : pathname === section.href || pathname.startsWith(`${section.href}/`);
        return (
          <Link
            key={section.href}
            href={section.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
              active ? "bg-navy text-white" : "hover:bg-mist"
            }`}
          >
            {section.label}
          </Link>
        );
      })}
      <Link
        href="/"
        className="shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm hover:bg-mist lg:mt-4 lg:border-t lg:border-rule lg:pt-4"
      >
        Ver site ↗
      </Link>
    </nav>
  );
}
