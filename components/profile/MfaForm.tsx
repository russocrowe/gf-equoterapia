"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Verified = { id: string; created_at: string };
type Enrolling = { factorId: string; qr: string; secret: string };
type Message = { ok: boolean; text: string } | null;

// Ativação da verificação em duas etapas (aplicativo autenticador).
export default function MfaForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState<Verified[]>([]);
  const [enrolling, setEnrolling] = useState<Enrolling | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.mfa.listFactors();
    setVerified((data?.totp ?? []).map((f) => ({ id: f.id, created_at: f.created_at })));
    setLoading(false);
  }, []);

  useEffect(() => {
    // Adiado um instante: lê o estado atual no navegador, depois de montar.
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  async function startEnrollment() {
    setBusy(true);
    setMessage(null);
    const supabase = createClient();

    // Tentativas abandonadas ficam "não verificadas" e travam o nome: limpa.
    const { data: existing } = await supabase.auth.mfa.listFactors();
    for (const factor of existing?.all ?? []) {
      if (factor.status === "unverified") {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }
    }

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: `Autenticador ${new Date().toISOString().slice(0, 16).replace("T", " ")}`,
      issuer: "Centro de Equoterapia GF",
    });
    setBusy(false);

    if (error || !data) {
      setMessage({
        ok: false,
        text: "Não foi possível iniciar a ativação agora. Tente de novo em instantes.",
      });
      return;
    }
    setEnrolling({
      factorId: data.id,
      qr: data.totp.qr_code,
      secret: data.totp.secret,
    });
    setCode("");
  }

  async function confirmEnrollment(event: React.FormEvent) {
    event.preventDefault();
    if (!enrolling || code.length !== 6) return;
    setBusy(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: enrolling.factorId,
      code,
    });
    setBusy(false);

    if (error) {
      setCode("");
      setMessage({
        ok: false,
        text: "Código incorreto ou expirado. Digite o código novo que aparece no aplicativo.",
      });
      return;
    }

    setEnrolling(null);
    setCode("");
    setMessage({
      ok: true,
      text: "Verificação em duas etapas ativada. A partir de agora, o login pede o código do aplicativo.",
    });
    await load();
    router.refresh();
  }

  async function cancelEnrollment() {
    if (!enrolling) return;
    const supabase = createClient();
    await supabase.auth.mfa.unenroll({ factorId: enrolling.factorId });
    setEnrolling(null);
    setCode("");
    setMessage(null);
  }

  async function disable(factorId: string) {
    if (
      !window.confirm(
        "Desativar a verificação em duas etapas? A conta voltará a ser protegida só pela senha.",
      )
    ) {
      return;
    }
    setBusy(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    setBusy(false);

    if (error) {
      setMessage({
        ok: false,
        text: "Não foi possível desativar agora. Saia, entre de novo com o código e tente outra vez.",
      });
      return;
    }
    setMessage({ ok: true, text: "Verificação em duas etapas desativada." });
    await load();
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-muted">Carregando…</p>;
  }

  return (
    <div className="flex max-w-lg flex-col gap-5">
      {verified.length > 0 && !enrolling ? (
        <div className="card flex flex-col gap-4 p-6">
          <p className="flex items-center gap-2.5 text-[15px] font-semibold text-forest">
            <span
              aria-hidden
              className="flex h-6 w-6 items-center justify-center rounded-full bg-forest text-white"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6.2 5 8.6l4.5-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Ativada
          </p>
          <p className="text-[14.5px] text-muted">
            O login pede a senha e também o código de 6 dígitos do aplicativo.
            Se perder o celular, quem administra o projeto no Supabase pode
            remover a verificação para você entrar e ativar de novo.
          </p>
          {verified.map((factor) => (
            <div
              key={factor.id}
              className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4 text-[13.5px]"
            >
              <span className="text-muted">
                Aplicativo vinculado em{" "}
                {new Date(factor.created_at).toLocaleDateString("pt-BR")}
              </span>
              <button
                type="button"
                onClick={() => void disable(factor.id)}
                disabled={busy}
                className="link-arrow !border-red-300 !text-red-800 disabled:opacity-50"
              >
                Desativar
              </button>
            </div>
          ))}
        </div>
      ) : enrolling ? (
        <form onSubmit={confirmEnrollment} className="card flex flex-col gap-5 p-6">
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-[14.5px] text-body">
            <li>
              Instale um aplicativo autenticador no celular (Google Authenticator,
              Microsoft Authenticator, Authy ou 1Password).
            </li>
            <li>No aplicativo, escolha adicionar conta e aponte a câmera para o código abaixo.</li>
            <li>Digite aqui os 6 dígitos que o aplicativo mostrar.</li>
          </ol>

          <div className="flex flex-wrap items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(enrolling.qr)}`}
              alt="Código QR para vincular o aplicativo autenticador"
              width={176}
              height={176}
              className="h-44 w-44 rounded-xl border border-rule bg-white p-2"
            />
            <details className="text-[13px] text-muted">
              <summary className="cursor-pointer font-semibold text-navy">
                Não consegue ler o código?
              </summary>
              <p className="mt-2">Digite esta chave no aplicativo:</p>
              <code className="mt-1 block break-all rounded-lg bg-sand-soft px-3 py-2 font-mono text-[13px] text-ink">
                {enrolling.secret}
              </code>
            </details>
          </div>

          <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
            Código de 6 dígitos
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              className="field max-w-[14rem] text-center font-mono !text-[1.4rem] tracking-[0.4em]"
            />
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={busy || code.length !== 6}
              className="btn btn-primary disabled:opacity-60"
            >
              {busy ? "Confirmando…" : "Confirmar e ativar"}
            </button>
            <button
              type="button"
              onClick={() => void cancelEnrollment()}
              disabled={busy}
              className="link-arrow"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="card flex flex-col gap-4 p-6">
          <p className="text-[15px] font-semibold text-ink">Desativada</p>
          <p className="text-[14.5px] text-muted">
            Com a verificação em duas etapas, só a senha não basta: quem
            descobrir a sua senha ainda precisaria do código do seu celular.
            Recomendamos ativar, principalmente para quem edita o site.
          </p>
          <button
            type="button"
            onClick={() => void startEnrollment()}
            disabled={busy}
            className="btn btn-primary self-start disabled:opacity-60"
          >
            {busy ? "Preparando…" : "Ativar verificação em duas etapas"}
          </button>
        </div>
      )}

      {message && (
        <p
          role={message.ok ? "status" : "alert"}
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.ok
              ? "border-forest/30 bg-sage-soft text-forest"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
