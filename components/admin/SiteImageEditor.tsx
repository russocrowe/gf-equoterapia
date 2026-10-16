"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSiteImageAction } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 5 * 1024 * 1024;

export type SiteImageRow = {
  key: string;
  label: string;
  description: string | null;
  url: string;
  alt: string;
  caption: string;
};

type Message = { ok: boolean; text: string } | null;

export default function SiteImageEditor({ row }: { row: SiteImageRow }) {
  const router = useRouter();
  const [url, setUrl] = useState(row.url);
  const [alt, setAlt] = useState(row.alt);
  const [caption, setCaption] = useState(row.caption);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  async function persist(next: { url: string; alt: string; caption: string }) {
    setBusy(true);
    const result = await saveSiteImageAction({ key: row.key, ...next });
    setBusy(false);
    if (!result) return false;
    setMessage({ ok: result.ok, text: result.message });
    if (result.ok) router.refresh();
    return result.ok;
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
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
    const path = `${row.key}/${Date.now()}.${extension}`;
    const { error } = await supabase.storage
      .from("site-images")
      .upload(path, file, { upsert: false, contentType: file.type });

    if (error) {
      setBusy(false);
      setMessage({ ok: false, text: "Não foi possível enviar a imagem." });
      return;
    }

    const { data } = supabase.storage.from("site-images").getPublicUrl(path);
    const saved = await persist({ url: data.publicUrl, alt, caption });
    if (saved) setUrl(data.publicUrl);
  }

  async function handleRemove() {
    if (!confirm("Remover esta imagem? O site volta a mostrar \"Imagem em breve\" no lugar.")) return;
    const saved = await persist({ url: "", alt, caption });
    if (saved) setUrl("");
  }

  return (
    <section className="card grid gap-6 p-6 md:grid-cols-[280px_1fr] md:p-7">
      <div>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={alt}
            className="aspect-[3/2] w-full rounded-2xl object-cover"
          />
        ) : (
          <div className="flex aspect-[3/2] w-full items-center justify-center rounded-2xl border border-dashed border-sand bg-sand-soft text-sm text-muted">
            Sem imagem
          </div>
        )}
      </div>

      <div className="flex max-w-xl flex-col gap-4">
        <div>
          <h2 className="text-[1.3rem]">{row.label}</h2>
          {row.description && <p className="mt-1 text-sm text-muted">{row.description}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="btn btn-outline cursor-pointer !px-4 !py-2.5 text-xs">
            {busy ? "Aguarde…" : url ? "Trocar imagem" : "Enviar imagem"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFile}
              disabled={busy}
            />
          </label>
          {url && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              className="link-arrow text-red-800 disabled:opacity-50"
            >
              Remover
            </button>
          )}
          <span className="text-xs text-muted">JPG, PNG ou WebP — até 5 MB.</span>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
          Descrição da imagem (para leitores de tela e Google)
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            maxLength={300}
            className="field"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
          Legenda (opcional)
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={120}
            placeholder="Ex.: Imagem ilustrativa"
            className="field"
          />
        </label>

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

        <button
          type="button"
          disabled={busy}
          onClick={() => void persist({ url, alt, caption })}
          className="btn btn-primary self-start disabled:opacity-60"
        >
          Salvar textos
        </button>
      </div>
    </section>
  );
}
