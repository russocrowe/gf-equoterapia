import { login } from "@/app/admin/actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="font-display text-2xl font-semibold">
        Painel administrativo
      </h1>
      <p className="mt-2 text-sm text-muted">
        Entre com sua conta para gerenciar os artigos do blog.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form action={login} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          E-mail
          <input
            type="email"
            name="email"
            required
            className="rounded-lg border border-ink/20 bg-paper px-3 py-2 text-sm outline-none focus:border-green"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Senha
          <input
            type="password"
            name="password"
            required
            className="rounded-lg border border-ink/20 bg-paper px-3 py-2 text-sm outline-none focus:border-green"
          />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-full bg-green px-6 py-3 font-display text-sm font-semibold text-paper transition-opacity hover:opacity-90"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
