import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/admin/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-paper">
      <div className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-display text-sm font-semibold">
            GF Equoterapia · Admin
          </Link>
          {user && (
            <div className="flex items-center gap-4 text-sm text-muted">
              <span>{user.email}</span>
              <form action={logout}>
                <button
                  type="submit"
                  className="font-display font-medium text-ink underline decoration-lime decoration-2 underline-offset-4"
                >
                  Sair
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
