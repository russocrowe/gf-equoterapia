"use client";

import { useState } from "react";
import { saveSiteImageAction } from "@/app/admin/actions";
import { useEditor } from "@/components/editor/EditorProvider";
import SitePhoto from "@/components/SitePhoto";
import { createClient } from "@/lib/supabase/client";
import type { SiteImage } from "@/lib/public-data";

const MAX_BYTES = 5 * 1024 * 1024;

type Message = { ok: boolean; text: string } | null;

// Foto do site. Para o administrador, no modo de edição, aparece logo abaixo
// um painel para trocar a foto e ajustar descrição e legenda.
export default function EditablePhoto({
  imageKey,
  image,
  className,
  priority,
  sizes,
  showCaption = true,
}: {
  imageKey: "hero" | "sobre" | "materia_padrao";
  image: SiteImage;
  className?: string;
  priority?: boolean;
  sizes?: string;
  showCaption?: boolean;
}) {
  const { editing } = useEditor();
  const [current, setCurrent] = useState(image);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  async function persist(next: SiteImage) {
    setBusy(true);
    const result = await saveSiteImageAction({ key: imageKey, ...next });
    setBusy(false);
    if (!result) return false;
    setMessage({ ok: result.ok, text: result.message });
    if (result.ok) setCurrent(next);
    return result.ok;
  }

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ ok: false, text: "Escolha um arquivo de imagem (JPG, PNG ou WebP)." });
      return;
    }
    if (file.size > MAX_BYTES) {
      setMessage({ ok: false, text: "A imagem precisa ter no máximo 5 MB." });
      return;
    }

    setBusy(true);
    setMessage(null);
    const supabase = createClient();
    const extension = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${imageKey}/${Date.now()}.${extension}`;
    const { error } = await supabase.storage
      .from("site-images")
      .upload(path, file, { upsert: false, contentType: file.type });
    if (error) {
      setBusy(false);
      setMessage({ ok: false, text: "Não foi possível enviar a imagem." });
      return;
    }
    const { data } = supabase.storage.from("site-images").getPublicUrl(path);
    setBusy(false);
    await persist({ ...current, url: data.publicUrl });
  }

  return (
    <>
      <SitePhoto
        image={current}
        className={className}
        priority={priority}
        sizes={sizes}
      />
      {showCaption && !editing && current.caption && (
        <p className="photo-note">{current.caption}</p>
      )}

      {editing && (
        <div
          data-editor-ui
          className="relative mt-7 flex flex-col gap-3 rounded-xl border border-dashed border-forest/40 bg-white/80 p-4 text-sm"
        >
          <div className="flex flex-wrap items-center gap-3">
            <label className="btn btn-forest cursor-pointer !px-4 !py-2 text-[13px]">
              {busy ? "Aguarde…" : current.url ? "Trocar foto" : "Enviar foto"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onFile}
                disabled={busy}
              />
            </label>
            <span className="text-xs muted">
              A foto é publicada assim que enviada (JPG, PNG ou WebP, até 5 MB).
            </span>
          </div>

          <label className="flex flex-col gap-1 text-xs font-semibold">
            Descrição da foto (para leitores de tela e Google)
            <input
              value={current.alt}
              onChange={(e) => setCurrent({ ...current, alt: e.target.value })}
              onBlur={() => void persist(current)}
              maxLength={300}
              className="field !py-2 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold">
            Legenda (opcional)
            <input
              value={current.caption}
              onChange={(e) => setCurrent({ ...current, caption: e.target.value })}
              onBlur={() => void persist(current)}
              maxLength={120}
              placeholder="Ex.: Imagem ilustrativa"
              className="field !py-2 text-sm font-normal"
            />
          </label>

          {message && (
            <p
              role={message.ok ? "status" : "alert"}
              className={`text-xs font-medium ${
                message.ok ? "text-forest" : "text-red-800"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      )}
    </>
  );
}
