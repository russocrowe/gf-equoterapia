import Brand from "@/components/Brand";
import MobileNav from "@/components/MobileNav";
import NavLinks from "@/components/NavLinks";
import UserMenu from "@/components/UserMenu";

export default function Header() {
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
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
