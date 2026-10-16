import type { Metadata } from "next";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { isCurrentUserAdmin, requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Editar site",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser("/admin");

  if (!(await isCurrentUserAdmin())) {
    return (
      <div className="mx-auto max-w-[1320px] px-6 pb-24 pt-12 md:px-12 md:pt-[72px]">
        <p className="eyebrow">Acesso restrito</p>
        <h1 className="my-6">
          Você ainda não pode <em>editar o site.</em>
        </h1>
        <p className="max-w-xl text-[15px]">
          Sua conta está ativa, mas não tem permissão de administrador. Peça a
          quem cuida do site para liberar o acesso.
        </p>
        <Link href="/perfil" className="btn btn-outline mt-8">
          Ir para meu perfil
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1320px] gap-10 px-6 pb-24 pt-10 md:px-12 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside>
        <p className="eyebrow mb-5">Editar site</p>
        <AdminNav />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
