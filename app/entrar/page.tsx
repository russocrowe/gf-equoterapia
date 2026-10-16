import type { Metadata } from "next";
import { login } from "@/app/auth/actions";
import { safeNext } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function EntrarPage({ searchParams }: Props) {
  const { error, next } = await searchParams;

  return (
    <div className="mx-auto max-w-[1320px] px-6 pb-24 pt-12 md:px-12 md:pt-[72px]">
      <div className="max-w-md">
        <p className="eyebrow">Área da equipe</p>
        <h1 className="my-6">
          Entrar na <em>sua conta.</em>
        </h1>
        <p className="text-[15px]">
          Acesse seu perfil e a área de edição do site. O acesso é restrito à
          equipe do Centro de Equoterapia GF.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}

        <form action={login} className="mt-8 flex flex-col gap-5">
          <input type="hidden" name="next" value={safeNext(next)} />
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            E-mail
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="field"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Senha
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="field"
            />
          </label>
          <button type="submit" className="btn btn-primary justify-center">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
