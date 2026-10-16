"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/newsletter";

export default function NewsletterForm({
  tone = "dark",
}: {
  // "dark" = sobre fundo escuro; "light" = sobre fundo claro/areia.
  tone?: "dark" | "light";
}) {
  const onDark = tone === "dark";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await subscribeToNewsletter(email);
      setStatus("done");
      setEmail("");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Não foi possível inscrever.",
      );
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="text-sm font-medium">Inscrição confirmada! Obrigado.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Seu e-mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@exemplo.com"
            className={
              onDark
                ? "field !border-white/40 !bg-white/10 !text-white placeholder:text-white/60 focus:!border-white"
                : "field !border-navy/30 !bg-white placeholder:text-ink/50 focus:!border-navy"
            }
          />
        </label>
        <button
          type="submit"
          disabled={status === "loading"}
          className={`btn justify-center disabled:opacity-60 ${
            onDark ? "btn-light" : "btn-primary"
          }`}
        >
          {status === "loading" ? "Enviando…" : "Inscrever"}
        </button>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-2 text-xs">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
