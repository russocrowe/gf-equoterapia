import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Camada de acesso (DAL): a autorização fica junto dos dados, não só no proxy.

export const getSessionUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

// A conta tem verificação em duas etapas (aplicativo autenticador) ativa?
export function hasMfa(user: Pick<User, "factors"> | null | undefined) {
  return Boolean(
    user?.factors?.some((f) => f.factor_type === "totp" && f.status === "verified"),
  );
}

// A conta ativou a verificação, mas esta sessão ainda não digitou o código?
// Se falhar ao ler o nível da sessão, não bloqueia aqui: o banco também recusa
// (is_admin() exige o código de quem ativou a verificação).
export const needsMfaStep = cache(async (): Promise<boolean> => {
  const user = await getSessionUser();
  if (!user) return false;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error || !data) return false;
  // Duas fontes: os fatores do usuário (frescos) e o "próximo nível" da sessão.
  const enrolled = hasMfa(user) || data.nextLevel === "aal2";
  return enrolled && data.currentLevel !== "aal2";
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
  if (await needsMfaStep()) {
    redirect(`/entrar/verificar?next=${encodeURIComponent(nextPath)}`);
  }
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
  if (await needsMfaStep()) {
    throw new Error("Confirme o código de verificação em duas etapas para continuar.");
  }
  return user;
}
