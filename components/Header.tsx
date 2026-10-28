import Brand from "@/components/Brand";
import MobileNav from "@/components/MobileNav";
import NavLinks from "@/components/NavLinks";
import UserMenu from "@/components/UserMenu";

export default function Header() {
  return (
    <header className="relative border-b border-rule bg-paper/90 backdrop-blur-md">
      <div className="stripe" aria-hidden />
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-6 py-2.5 md:px-12">
        <div className="hidden lg:block">
          <Brand size={112} />
        </div>
        <div className="lg:hidden">
          <Brand size={84} />
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
