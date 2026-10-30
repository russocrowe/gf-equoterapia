"use client";

import { useState } from "react";
import ImageFramer, { type FramedImage } from "@/components/ImageFramer";
import {
  fetchImageBlob,
  MAX_RAW_BYTES,
  uploadPostBlob,
  uploadPostImage,
  type PreparedImage,
} from "@/lib/image-upload";
import { isFramable } from "@/lib/site-image-keys";

function formatBytes(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

// Capa da matéria, com orientação de tamanho e proporção e uma prévia de
// como ela é recortada em cada lugar do site.
export default function CoverUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<PreparedImage | null>(null);
  const [framing, setFraming] = useState<Blob | null>(null);

  async function sendAsIs(file: File) {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const { url, image } = await uploadPostImage(file, "covers");
      onChange(url);
      setInfo(image);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no envio da imagem.");
    } finally {
      setBusy(false);
    }
  }

  function handleFile(file: File) {
    setError(null);
    if (!isFramable(file)) {
      void sendAsIs(file);
      return;
    }
    if (file.size > MAX_RAW_BYTES) {
      setError("A imagem passou de 20 MB. Escolha uma menor.");
      return;
    }
    setFraming(file);
  }

  async function onFramed(result: FramedImage) {
    const source = framing;
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const url = await uploadPostBlob(result.blob, result.extension, "covers");
      onChange(url);
      setInfo({
        blob: result.blob,
        extension: result.extension,
        originalWidth: result.sourceWidth,
        originalHeight: result.sourceHeight,
        originalBytes: source?.size ?? result.blob.size,
        finalBytes: result.blob.size,
      });
      setFraming(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no envio da imagem.");
    } finally {
      setBusy(false);
    }
  }

  async function reframe() {
    if (!value) return;
    setBusy(true);
    setError(null);
    try {
      setFraming(await fetchImageBlob(value));
    } catch {
      setError("Não consegui abrir a capa atual. Envie a foto de novo.");
    } finally {
      setBusy(false);
    }
  }

  const warnings: string[] = [];
  if (info && info.originalWidth > 0) {
    if (info.originalWidth < 1200) {
      warnings.push(
        `A foto tem ${info.originalWidth} px de largura. Abaixo de 1200 px ela pode ficar embaçada em telas grandes.`,
      );
    }
  }

  const crops = [
    { label: "Lista de matérias", ratio: "aspect-[16/10]" },
    { label: "Destaque", ratio: "aspect-[3/2]" },
    { label: "Topo da matéria", ratio: "aspect-video" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl bg-sand-soft px-4 py-3 text-[13px] leading-relaxed text-body">
        <p>
          <b className="text-ink">Tamanho ideal: 1600 × 900 px</b> (foto deitada,
          proporção 16:9). Ao escolher a foto, você <b className="text-ink">enquadra</b> antes
          de enviar; o site reduz e otimiza sozinho.
        </p>
        <p className="mt-1.5">
          Deixe o assunto principal no <b className="text-ink">centro</b>: nas
          listas as bordas são cortadas.
        </p>
      </div>

      {value ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2.5">
            {crops.map((crop) => (
              <figure key={crop.label}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt=""
                  className={`${crop.ratio} w-full rounded-lg border border-rule object-cover`}
                />
                <figcaption className="mt-1 text-[11px] leading-tight text-muted">
                  {crop.label}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <label className="link-arrow cursor-pointer">
              {busy ? "Enviando…" : "Trocar capa"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) void handleFile(file);
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => void reframe()}
              disabled={busy}
              className="link-arrow disabled:opacity-50"
            >
              Enquadrar de novo
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setInfo(null);
              }}
              className="link-arrow !border-red-300 !text-red-800"
            >
              Remover capa
            </button>
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-rule-strong bg-white px-4 py-9 text-center text-sm text-muted transition-colors hover:border-forest">
          <span className="font-semibold text-ink">
            {busy ? "Enviando e otimizando…" : "Clique para adicionar a capa"}
          </span>
          <span className="text-xs">Recomendado 1600 × 900 px</span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void handleFile(file);
            }}
          />
        </label>
      )}

      {info && info.finalBytes < info.originalBytes && (
        <p className="text-xs text-muted">
          Otimizada: {formatBytes(info.originalBytes)} → {formatBytes(info.finalBytes)}
          {info.originalWidth > 0 ? ` (original ${info.originalWidth} × ${info.originalHeight} px)` : ""}.
        </p>
      )}

      {warnings.map((text) => (
        <p
          key={text}
          role="note"
          className="rounded-lg border border-gold/50 bg-sand-soft px-3 py-2 text-xs text-body"
        >
          {text}
        </p>
      ))}

      {framing && (
        <ImageFramer
          file={framing}
          title="Enquadrar a capa da matéria"
          aspect={16 / 9}
          outputWidth={1600}
          confirmLabel="Usar como capa"
          onConfirm={onFramed}
          onCancel={() => setFraming(null)}
        />
      )}

      {error && (
        <p role="alert" className="text-xs font-medium text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
