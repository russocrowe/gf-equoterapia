"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Avatar } from "@/components/UserMenu";
import { createClient } from "@/lib/supabase/client";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

type Message = { type: "ok" | "error"; text: string } | null;

function storagePathFromUrl(url: string | null): string | null {
  if (!url) return null;
  const marker = "/avatars/";
  const index = url.indexOf(marker);
  return index === -1 ? null : url.slice(index + marker.length).split("?")[0];
}

export default function ProfileForm({
  userId,
  email,
  initialName,
  initialPhone,
  initialAvatarUrl,
}: {
  userId: string;
  email: string;
  initialName: string;
  initialPhone: string;
  initialAvatarUrl: string | null;
}) {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: userId,
        full_name: fullName.trim(),
        phone: phone.trim() || null,
      },
      { onConflict: "user_id" },
    );
    setSaving(false);
    if (error) {
      setMessage({ type: "error", text: "Não foi possível salvar. Tente novamente." });
      return;
    }
    setMessage({ type: "ok", text: "Dados salvos." });
    await refreshProfile();
    router.refresh();
  }

  async function handleAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Escolha um arquivo de imagem (JPG, PNG ou WebP)." });
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setMessage({ type: "error", text: "A foto precisa ter no máximo 2 MB." });
      return;
    }

    setUploading(true);
    setMessage(null);
    const supabase = createClient();
    const extension = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${userId}/avatar-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: false, contentType: file.type });
    if (uploadError) {
      setUploading(false);
      setMessage({ type: "error", text: "Não foi possível enviar a foto." });
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        { user_id: userId, avatar_url: data.publicUrl },
        { onConflict: "user_id" },
      );
    setUploading(false);
    if (profileError) {
      setMessage({ type: "error", text: "A foto foi enviada, mas não foi possível salvá-la no perfil." });
      return;
    }

    const oldPath = storagePathFromUrl(avatarUrl);
    if (oldPath) void supabase.storage.from("avatars").remove([oldPath]);

    setAvatarUrl(data.publicUrl);
    setMessage({ type: "ok", text: "Foto atualizada." });
    await refreshProfile();
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="flex max-w-lg flex-col gap-6">
      <div className="flex items-center gap-5">
        <Avatar url={avatarUrl} name={fullName || email} size={80} />
        <div>
          <label className="btn btn-outline cursor-pointer !px-4 !py-2.5 text-xs">
            {uploading ? "Enviando…" : "Alterar foto"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatar}
              disabled={uploading}
            />
          </label>
          <p className="mt-2 text-xs">JPG, PNG ou WebP — até 2 MB.</p>
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Nome completo
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          className="field"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Telefone / WhatsApp
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          placeholder="(11) 99999-0000"
          className="field"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        E-mail
        <input value={email} readOnly className="field cursor-not-allowed opacity-70" />
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
        {saving ? "Salvando…" : "Salvar alterações"}
      </button>
    </form>
  );
}
