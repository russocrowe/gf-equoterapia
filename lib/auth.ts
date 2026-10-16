import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Camada de acesso (DAL): a autorização fica junto dos dados, não só no proxy.

export const getSessionUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const isCurrentUserAdmin = cache(async (): Promise<boolean> => {
  const user = await getSessionUser();
  if (!user) return false;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
});

export async function requireUser(nextPath = "/perfil") {
  const user = await getSessionUser();
  if (!user) redirect(`/entrar?next=${encodeURIComponent(nextPath)}`);
  return user;
}

// Para páginas do painel: manda quem não é admin de volta ao perfil.
// (Layouts não rodam de novo na navegação do cliente; por isso cada página confere.)
export async function requireAdminPage(nextPath = "/admin") {
  const user = await requireUser(nextPath);
  if (!(await isCurrentUserAdmin())) redirect("/perfil");
  return user;
}

// Para Server Actions e rotas do painel: lança erro se não for admin.
export async function assertAdmin() {
  const user = await getSessionUser();
  if (!user || !(await isCurrentUserAdmin())) {
    throw new Error("Você não tem permissão para fazer isso.");
  }
  return user;
}
