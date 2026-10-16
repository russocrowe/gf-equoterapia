export const navLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/equoterapia", label: "Equoterapia" },
];

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  // As matérias (/blog/...) fazem parte da seção Equoterapia.
  if (href === "/equoterapia" && pathname.startsWith("/blog")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}
