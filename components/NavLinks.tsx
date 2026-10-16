"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath, navLinks } from "@/lib/nav";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Principal"
      className="hidden items-center gap-7 text-[15px] font-medium lg:flex"
    >
      {navLinks.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`border-b-2 pb-[5px] transition-colors ${
              active
                ? "border-gold text-ink"
                : "border-transparent text-body hover:border-rule-strong hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
