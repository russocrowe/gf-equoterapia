"use client";

import { useState } from "react";
import { saveSiteImageAction } from "@/app/admin/actions";
import { useEditor } from "@/components/editor/EditorProvider";
import ImageFramer, { type FramedImage } from "@/components/ImageFramer";
import SitePhoto from "@/components/SitePhoto";
import { fetchImageBlob, MAX_RAW_BYTES } from "@/lib/image-upload";
import { createClient } from "@/lib/supabase/client";
import type { SiteImage } from "@/lib/public-data";
import { isFramable, siteImageFrames, type SiteImageKey } from "@/lib/site-image-keys";

const MAX_DIRECT_BYTES = 5 * 1024 * 1024;

type Message = { ok: boolean; text: string } | null;

// Foto do site. Para o administrador, no modo de edição, aparece logo abaixo
// um painel para trocar (e enquadrar) a foto e ajustar descrição e legenda.
export default function EditablePhoto({
  imageKey,
  image,
  className,
  priority,
  sizes,
  showCaption = true,
}: {
  imageKey: SiteImageKey;
  image: SiteImage;
  className?: string;
  priority?: boolean;
  sizes?: string;
  showCaption?: boolean;
}) {
  const { editing } = useEditor();
  const frame = siteImageFrames[imageKey];
  const [current, setCurrent] = useState(image);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const [framing, setFraming] = useState<Blob | null>(null);

  async function persist(next: SiteImage) {
    setBusy(true);
    const result = await saveSiteImageAction({ key: imageKey, ...next });
    setBusy(false);
    if (!result) return false;
    setMessage({ ok: result.ok, text: result.message });
    if (result.ok) setCurrent(next);
    return result.ok;
  }

  async function upload(blob: Blob, extension: string) {
    setBusy(true);
    setMessage(null);
    const supabase = createClient();
    const path = `${imageKey}/${Date.now()}.${extension}`;
    const { error } = await supabase.storage
      .from("site-images")
      .upload(path, blob, { upsert: false, contentType: blob.type || "image/webp" });
    if (error) {
      setBusy(false);
      setMessage({ ok: false, text: "Não foi possível enviar a imagem." });
      return;
    }
    const { data } = supabase.storage.from("site-images").getPublicUrl(path);
    setBusy(false);
    await persist({ ...current, url: data.publicUrl });
  }

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ ok: false, text: "Escolha um arquivo de imagem (JPG, PNG ou WebP)." });
      return;
    }
    if (isFramable(file)) {
      if (file.size > MAX_RAW_BYTES) {
        setMessage({ ok: false, text: "A imagem passou de 20 MB. Escolha uma menor." });
        return;
      }
      setMessage(null);
      setFraming(file);
      return;
    }
    if (file.size > MAX_DIRECT_BYTES) {
      setMessage({ ok: false, text: "A imagem precisa ter no máximo 5 MB." });
      return;
    }
    const extension = (file.name.split(".").pop() || "gif").toLowerCase();
    await upload(file, extension);
  }

  async function onFramed(result: FramedImage) {
    await upload(result.blob, result.extension);
    setFraming(null);
  }

  async function reframe() {
    if (!current.url) return;
    setBusy(true);
    setMessage(null);
    try {
      setFraming(await fetchImageBlob(current.url));
    } catch {
      setMessage({ ok: false, text: "Não consegui abrir a foto atual. Envie a foto de novo." });
    } finally {
      setBusy(false);
    }
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

      {framing && (
        <ImageFramer
          file={framing}
          title={`Enquadrar: ${frame.hint}`}
          aspect={frame.aspect}
          shape={frame.shape}
          outputWidth={frame.outputWidth}
          confirmLabel="Usar e publicar"
          onConfirm={onFramed}
          onCancel={() => setFraming(null)}
        />
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
            {current.url && (
              <button
                type="button"
                onClick={() => void reframe()}
                disabled={busy}
                className="btn btn-outline !px-4 !py-2 text-[13px] disabled:opacity-60"
              >
                Enquadrar
              </button>
            )}
            <span className="text-xs muted">
              Ao escolher a foto você enquadra antes de publicar (JPG, PNG ou WebP).
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
