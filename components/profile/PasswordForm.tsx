"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = { type: "ok" | "error"; text: string } | null;

export default function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    if (password.length < 8) {
      setMessage({ type: "error", text: "A nova senha precisa ter pelo menos 8 caracteres." });
      return;
    }
    if (password !== confirm) {
      setMessage({ type: "error", text: "As senhas não são iguais." });
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      setMessage({
        type: "error",
        text: "Não foi possível alterar a senha. Tente de novo ou saia e entre outra vez.",
      });
      return;
    }
    setPassword("");
    setConfirm("");
    setMessage({ type: "ok", text: "Senha alterada com sucesso." });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Nova senha
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
          className="field"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Confirmar nova senha
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
          className="field"
        />
      </label>

      {message && (
        <p
          role={message.type === "error" ? "alert" : "status"}
          className={`rounded-md border px-4 py-3 text-sm ${
            message.type === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-rule-strong bg-mist"
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="btn btn-primary self-start disabled:opacity-60"
      >
        {saving ? "Alterando…" : "Alterar senha"}
      </button>
    </form>
  );
}
