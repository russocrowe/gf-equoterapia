import type { Metadata } from "next";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { hasMfa, isCurrentUserAdmin, requireUser } from "@/lib/auth";

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
  const user = await requireUser("/admin");

  if (!(await isCurrentUserAdmin())) {
    return (
      <div className="mx-auto max-w-[1240px] px-6 pb-24 pt-14 md:px-10 md:pt-20">
        <p className="eyebrow">Acesso restrito</p>
        <h1 className="my-6">
          Você ainda não pode <em>editar o site.</em>
        </h1>
        <p className="lead max-w-xl">
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
    <div className="mx-auto grid max-w-[1240px] grid-cols-[minmax(0,1fr)] gap-8 px-6 pb-24 pt-8 md:px-10 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12 lg:pt-12">
      <aside className="lg:self-start">
        <div className="lg:sticky lg:top-40">
          <p className="eyebrow mb-5">Editar site</p>
          <AdminNav />
        </div>
      </aside>
      <div className="min-w-0">
        {!hasMfa(user) && (
          <div
            role="note"
            className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold/50 bg-sand-soft px-5 py-4"
          >
            <p className="max-w-xl text-[14.5px] text-body">
              <b className="text-ink">Proteja sua conta de administrador.</b>{" "}
              Ative a verificação em duas etapas: mesmo que alguém descubra a
              sua senha, não consegue editar o site sem o código do seu
              celular.
            </p>
            <Link
              href="/perfil#seguranca"
              className="btn btn-primary !px-5 !py-2 text-[13.5px]"
            >
              Ativar agora
            </Link>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
