"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/newsletter";

export default function NewsletterForm() {
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
    return (
      <p className="font-display text-sm font-semibold text-white">
        Inscrição confirmada! Obrigado.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="nome@exemplo.com"
        className="min-w-0 flex-1 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/60 outline-none focus:border-white"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-white px-5 py-2.5 font-display text-sm font-semibold text-marrom transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Enviando…" : "Inscrever"}
      </button>
      {status === "error" && (
        <p className="text-xs text-white sm:absolute sm:mt-10">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
