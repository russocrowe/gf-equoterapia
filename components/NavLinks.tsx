"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath, navLinks } from "@/lib/nav";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Principal"
      className="hidden items-center gap-5 text-sm 2xl:gap-7 lg:flex"
    >
      {navLinks.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`border-b pb-[5px] transition-colors ${
              active
                ? "border-navy"
                : "border-transparent hover:border-rule-strong"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
