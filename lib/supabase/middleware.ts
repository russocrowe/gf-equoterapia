import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/safe-redirect";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se a sessão acabou de ser renovada, os cookies novos precisam acompanhar
  // qualquer redirecionamento; senão a renovação se perde e a pessoa é
  // deslogada na requisição seguinte.
  const redirectTo = (url: URL) => {
    const redirect = NextResponse.redirect(url);
    for (const cookie of response.headers.getSetCookie()) {
      redirect.headers.append("set-cookie", cookie);
    }
    return redirect;
  };

  const { pathname, search } = request.nextUrl;

  // Endereço antigo do login.
  if (pathname === "/admin/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.search = "";
    return redirectTo(url);
  }

  const needsLogin =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/perfil") ||
    pathname === "/entrar/verificar";

  if (needsLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return redirectTo(url);
  }

  // Verificação em duas etapas: quem ativou precisa digitar o código nesta
  // sessão antes de entrar no painel ou no perfil.
  if (user) {
    const hasMfa = Boolean(
      user.factors?.some((f) => f.factor_type === "totp" && f.status === "verified"),
    );
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const enrolled = hasMfa || aal?.nextLevel === "aal2";
    const mfaPending = Boolean(aal) && enrolled && aal?.currentLevel !== "aal2";

    if (mfaPending && (pathname.startsWith("/admin") || pathname.startsWith("/perfil"))) {
      const url = request.nextUrl.clone();
      url.pathname = "/entrar/verificar";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return redirectTo(url);
    }

    // Nada a verificar: a tela do código não tem o que fazer aqui.
    if (pathname === "/entrar/verificar" && !mfaPending) {
      const next = safeNext(request.nextUrl.searchParams.get("next"));
      const url = request.nextUrl.clone();
      url.pathname = next.split("?")[0];
      url.search = next.includes("?") ? `?${next.split("?").slice(1).join("?")}` : "";
      return redirectTo(url);
    }
  }

  if (pathname === "/entrar" && user) {
    const next = safeNext(request.nextUrl.searchParams.get("next"));
    const url = request.nextUrl.clone();
    url.pathname = next.split("?")[0];
    url.search = next.includes("?") ? `?${next.split("?").slice(1).join("?")}` : "";
    return redirectTo(url);
  }

  return response;
}
