import Brand from "@/components/Brand";
import MobileNav from "@/components/MobileNav";
import NavLinks from "@/components/NavLinks";
import UserMenu from "@/components/UserMenu";
import { getCenterInfo } from "@/lib/public-data";
import { waLink } from "@/lib/site-config";

export default async function Header() {
  const center = await getCenterInfo();
  const whatsappHref = waLink(center, "Olá! Gostaria de agendar uma avaliação.");

  return (
    <header className="relative border-b border-rule border-t-4 border-t-forest bg-paper">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-6 py-2.5 md:px-12">
        <div className="hidden lg:block">
          <Brand size={132} />
        </div>
        <div className="lg:hidden">
          <Brand size={92} />
        </div>

        <NavLinks />

        <div className="flex items-center gap-4">
          <UserMenu />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary hidden whitespace-nowrap xl:inline-flex"
          >
            Agendar avaliação
          </a>
          <MobileNav whatsappHref={whatsappHref} />
        </div>
      </div>
    </header>
  );
}
