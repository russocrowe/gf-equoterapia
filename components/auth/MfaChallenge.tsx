"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function friendlyError(error: { code?: string; status?: number; message?: string }) {
  if (error.code === "mfa_verification_failed" || error.status === 400) {
    return "Código incorreto ou expirado. Confira o relógio do celular e tente o código novo que aparece no aplicativo.";
  }
  if (error.code === "over_request_rate_limit" || error.status === 429) {
    return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
  }
  return "Não foi possível confirmar agora. Tente novamente em instantes.";
}

// Segunda etapa do login: o código de 6 dígitos do aplicativo autenticador.
export default function MfaChallenge({ next }: { next: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function verify(value: string) {
    if (busy) return;
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { data, error: listError } = await supabase.auth.mfa.listFactors();
    const factor = data?.totp?.[0];

    if (listError || !factor) {
      setBusy(false);
      setError(
        "Não encontramos um aplicativo vinculado a esta conta. Saia e entre de novo; se continuar, peça ajuda a quem administra o site.",
      );
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
      factorId: factor.id,
      code: value,
    });

    if (verifyError) {
      setBusy(false);
      setCode("");
      setError(friendlyError(verifyError));
      input.current?.focus();
      return;
    }

    router.replace(next);
    router.refresh();
  }

  function onChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    setCode(digits);
    if (digits.length === 6) void verify(digits);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (code.length === 6) void verify(code);
      }}
      className="mt-8 flex max-w-sm flex-col gap-5"
    >
      <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
        Código de 6 dígitos
        <input
          ref={input}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={6}
          autoFocus
          placeholder="000000"
          aria-invalid={Boolean(error)}
          className="field text-center font-mono !text-[1.8rem] tracking-[0.5em]"
        />
      </label>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy || code.length !== 6}
        className="btn btn-primary justify-center disabled:opacity-60"
      >
        {busy ? "Confirmando…" : "Confirmar e entrar"}
      </button>
    </form>
  );
}
