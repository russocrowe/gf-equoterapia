import type { Metadata } from "next";
import { logout } from "@/app/auth/actions";
import MfaChallenge from "@/components/auth/MfaChallenge";
import { safeNext } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Verificação em duas etapas",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function VerificarPage({ searchParams }: Props) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-24 pt-14 md:px-10 md:pt-20">
      <div className="max-w-md">
        <p className="eyebrow">Verificação em duas etapas</p>
        <h1 className="my-6">
          Confirme que <em>é você.</em>
        </h1>
        <p className="lead">
          Abra o aplicativo autenticador no seu celular e digite o código de 6
          dígitos que aparece para o <b>Centro de Equoterapia GF</b>. Ele muda
          a cada 30 segundos.
        </p>

        <MfaChallenge next={safeNext(next)} />

        <form action={logout} className="mt-8">
          <button type="submit" className="link-arrow">
            Sair e entrar com outra conta
          </button>
        </form>
      </div>
    </div>
  );
}
