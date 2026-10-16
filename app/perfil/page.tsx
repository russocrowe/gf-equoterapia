import type { Metadata } from "next";
import Link from "next/link";
import PasswordForm from "@/components/profile/PasswordForm";
import ProfileForm from "@/components/profile/ProfileForm";
import { isCurrentUserAdmin, requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Meu perfil",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const user = await requireUser("/perfil");
  const supabase = await createClient();
  const [{ data: profile }, isAdmin] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, phone, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle(),
    isCurrentUserAdmin(),
  ]);

  return (
    <div className="mx-auto max-w-[1320px] px-6 pb-24 pt-12 md:px-12 md:pt-[72px]">
      <p className="eyebrow">Minha conta</p>
      <h1 className="my-6">
        Meu <em>perfil.</em>
      </h1>

      <div className="mt-10 grid gap-16 lg:grid-cols-2">
        <section>
          <h2 className="mb-6 text-[1.7rem]">Dados pessoais</h2>
          <ProfileForm
            userId={user.id}
            email={user.email ?? ""}
            initialName={profile?.full_name ?? ""}
            initialPhone={profile?.phone ?? ""}
            initialAvatarUrl={profile?.avatar_url ?? null}
          />
        </section>

        <div className="flex flex-col gap-16">
          <section id="senha" className="scroll-mt-8">
            <h2 className="mb-6 text-[1.7rem]">Alterar senha</h2>
            <PasswordForm />
          </section>

          <section>
            <h2 className="mb-6 text-[1.7rem]">Acesso</h2>
            <div className="border-t border-rule-strong pt-5">
              <p className="text-sm">
                Perfil de acesso:{" "}
                <strong>{isAdmin ? "Administrador" : "Membro da equipe"}</strong>
              </p>
              {isAdmin ? (
                <>
                  <p className="mt-2 max-w-md text-sm">
                    Você pode editar matérias, informações do centro e imagens
                    do site.
                  </p>
                  <Link href="/admin" className="btn btn-primary mt-5">
                    Editar site <span aria-hidden>↗</span>
                  </Link>
                </>
              ) : (
                <p className="mt-2 max-w-md text-sm">
                  Sua conta ainda não tem permissão para editar o site. Peça a
                  um administrador para liberar o acesso.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
