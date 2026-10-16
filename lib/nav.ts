export const navLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/equoterapia", label: "Equoterapia" },
  { href: "/condicoes", label: "Condições tratadas" },
  { href: "/blog", label: "Matérias" },
  { href: "/contato", label: "Contato" },
];

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
