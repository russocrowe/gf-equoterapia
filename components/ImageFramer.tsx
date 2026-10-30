"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";

export type FramedImage = {
  blob: Blob;
  extension: string;
  // Medidas da imagem enviada (já enquadrada) e da foto original.
  width: number;
  height: number;
  sourceWidth: number;
  sourceHeight: number;
};

export type AspectOption = {
  label: string;
  // null = a proporção da própria foto (sem cortar nada, a menos que aproxime).
  value: number | null;
};

type Props = {
  file: Blob;
  title: string;
  // Proporção fixa (largura / altura). Se houver "options", elas valem no lugar.
  aspect?: number;
  options?: AspectOption[];
  // "arch" desenha a moldura em arco, como a foto aparece na abertura do site.
  shape?: "rect" | "arch";
  outputWidth?: number;
  confirmLabel?: string;
  onConfirm: (result: FramedImage) => void | Promise<void>;
  onCancel: () => void;
};

type Loaded = { url: string; width: number; height: number };

const MAX_ZOOM = 4;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function encode(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

// Janela para enquadrar a foto antes de enviar: arrastar muda a posição, o controle
// aproxima, e só o que está dentro da moldura é enviado.
export default function ImageFramer({
  file,
  title,
  aspect = 1,
  options,
  shape = "rect",
  outputWidth = 1600,
  confirmLabel = "Usar este enquadramento",
  onConfirm,
  onCancel,
}: Props) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [choice, setChoice] = useState(0);
  const [zoom, setZoom] = useState(1);
  // Ponto da foto (0 a 1) que fica no centro da moldura.
  const [center, setCenter] = useState({ x: 0.5, y: 0.5 });
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null);

  // Abre a foto escolhida.
  useEffect(() => {
    let cancelled = false;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      setLoaded({ url, width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      if (!cancelled) setLoadFailed(true);
    };
    img.src = url;
    return () => {
      cancelled = true;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Mede a moldura (muda quando a proporção muda ou a janela é redimensionada).
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setSize({ w: rect.width, h: rect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [loaded]);

  useEffect(() => {
    frameRef.current?.focus();
  }, [loaded]);

  // Trava a rolagem da página enquanto a janela está aberta.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const picked = options?.[choice]?.value;
  const ratio = options
    ? (picked ?? (loaded ? loaded.width / loaded.height : 1))
    : aspect;

  // Posição da foto dentro da moldura, calculada a cada desenho.
  let layout: { left: number; top: number; width: number; height: number; scale: number; cx: number; cy: number } | null = null;
  if (loaded && size && size.w > 0 && size.h > 0) {
    const base = Math.max(size.w / loaded.width, size.h / loaded.height);
    const scale = base * zoom;
    const width = loaded.width * scale;
    const height = loaded.height * scale;
    const halfX = size.w / (2 * width);
    const halfY = size.h / (2 * height);
    const cx = clamp(center.x, halfX, 1 - halfX);
    const cy = clamp(center.y, halfY, 1 - halfY);
    layout = {
      left: size.w / 2 - cx * width,
      top: size.h / 2 - cy * height,
      width,
      height,
      scale,
      cx,
      cy,
    };
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!layout) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, cx: layout.cx, cy: layout.cy };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || !layout) return;
    setCenter({
      x: start.cx - (event.clientX - start.x) / layout.width,
      y: start.cy - (event.clientY - start.y) / layout.height,
    });
  }

  function onPointerUp() {
    drag.current = null;
  }

  function nudge(dx: number, dy: number) {
    if (!layout) return;
    setCenter({ x: layout.cx + dx, y: layout.cy + dy });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = 0.02 / zoom;
    if (event.key === "ArrowLeft") nudge(-step, 0);
    else if (event.key === "ArrowRight") nudge(step, 0);
    else if (event.key === "ArrowUp") nudge(0, -step);
    else if (event.key === "ArrowDown") nudge(0, step);
    else if (event.key === "+" || event.key === "=") setZoom((z) => clamp(z + 0.15, 1, MAX_ZOOM));
    else if (event.key === "-") setZoom((z) => clamp(z - 0.15, 1, MAX_ZOOM));
    else return;
    event.preventDefault();
  }

  function recenter() {
    setZoom(1);
    setCenter({ x: 0.5, y: 0.5 });
  }

  async function confirm() {
    if (!loaded || !layout || !size) return;
    setSaving(true);
    setError(null);
    try {
      const bitmap = await createImageBitmap(file);
      const sw = size.w / layout.scale;
      const sh = size.h / layout.scale;
      const sx = layout.cx * loaded.width - sw / 2;
      const sy = layout.cy * loaded.height - sh / 2;
      const width = Math.max(1, Math.min(outputWidth, Math.round(sw)));
      const height = Math.max(1, Math.round(width / ratio));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("canvas");
      context.imageSmoothingQuality = "high";
      context.drawImage(bitmap, sx, sy, sw, sh, 0, 0, width, height);
      bitmap.close();

      let blob = await encode(canvas, "image/webp", 0.9);
      let extension = "webp";
      if (!blob || blob.type !== "image/webp") {
        blob = await encode(canvas, "image/jpeg", 0.9);
        extension = "jpg";
      }
      if (!blob) throw new Error("encode");

      await onConfirm({
        blob,
        extension,
        width,
        height,
        sourceWidth: loaded.width,
        sourceHeight: loaded.height,
      });
    } catch {
      setError("Não consegui preparar a imagem. Tente de novo ou escolha outra foto.");
    } finally {
      setSaving(false);
    }
  }

  const frameRadius = shape === "arch" ? "999px 999px 22px 22px" : "16px";

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgb(8_14_40/0.62)] p-3 sm:p-5"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onKeyDown={(event) => {
          if (event.key === "Escape" && !saving) onCancel();
        }}
        className="flex max-h-full w-full max-w-[640px] flex-col gap-4 overflow-y-auto rounded-2xl bg-white p-5 text-left shadow-2xl md:p-7"
      >
        <div>
          <h2 className="text-[1.35rem]">{title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Arraste a foto para enquadrar e use o controle para aproximar. Só a parte
            dentro da moldura vai para o site
            {shape === "arch" ? " (a moldura em arco é como ela aparece na abertura)" : ""}.
          </p>
        </div>

        {options && options.length > 1 && (
          <div role="group" aria-label="Formato da foto" className="flex flex-wrap gap-2">
            {options.map((option, index) => (
              <button
                key={option.label}
                type="button"
                aria-pressed={index === choice}
                onClick={() => {
                  setChoice(index);
                  recenter();
                }}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  index === choice
                    ? "border-navy bg-navy text-white"
                    : "border-rule-strong bg-white text-ink hover:border-forest"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {loadFailed ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            Não consegui abrir essa imagem. Escolha outro arquivo (JPG, PNG ou WebP).
          </p>
        ) : (
          <div className="flex justify-center">
            <div
              ref={frameRef}
              tabIndex={0}
              role="group"
              aria-label="Moldura da foto. Use as setas para mover e os sinais de mais e menos para aproximar."
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown}
              className="relative cursor-grab touch-none select-none overflow-hidden bg-[#1b1d2b] outline-offset-4 focus-visible:outline-2 focus-visible:outline-forest active:cursor-grabbing"
              style={{
                aspectRatio: String(ratio),
                width: `min(100%, calc(56vh * ${ratio}))`,
                borderRadius: frameRadius,
              }}
            >
              {loaded && layout && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={loaded.url}
                  alt=""
                  draggable={false}
                  className="pointer-events-none absolute max-w-none"
                  style={{
                    left: layout.left,
                    top: layout.top,
                    width: layout.width,
                    height: layout.height,
                  }}
                />
              )}
              {/* Guias em terços, só para ajudar a compor */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, transparent calc(33.33% - 0.5px), rgb(255 255 255 / 0.4) calc(33.33% - 0.5px) calc(33.33% + 0.5px), transparent calc(33.33% + 0.5px), transparent calc(66.66% - 0.5px), rgb(255 255 255 / 0.4) calc(66.66% - 0.5px) calc(66.66% + 0.5px), transparent calc(66.66% + 0.5px)), linear-gradient(to bottom, transparent calc(33.33% - 0.5px), rgb(255 255 255 / 0.4) calc(33.33% - 0.5px) calc(33.33% + 0.5px), transparent calc(33.33% + 0.5px), transparent calc(66.66% - 0.5px), rgb(255 255 255 / 0.4) calc(66.66% - 0.5px) calc(66.66% + 0.5px), transparent calc(66.66% + 0.5px))",
                }}
              />
              {!loaded && (
                <span className="absolute inset-0 flex items-center justify-center text-sm text-white/80">
                  Abrindo a foto…
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Afastar"
            onClick={() => setZoom((z) => clamp(z - 0.25, 1, MAX_ZOOM))}
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-rule-strong text-xl font-semibold text-ink hover:border-forest"
          >
            −
          </button>
          <input
            type="range"
            aria-label="Aproximar a foto"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="h-2 min-w-0 flex-1 cursor-pointer accent-[#0b4f3e]"
          />
          <button
            type="button"
            aria-label="Aproximar"
            onClick={() => setZoom((z) => clamp(z + 0.25, 1, MAX_ZOOM))}
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-rule-strong text-xl font-semibold text-ink hover:border-forest"
          >
            +
          </button>
          <button
            type="button"
            onClick={recenter}
            className="link-arrow flex-none text-[13px]"
          >
            Centralizar
          </button>
        </div>

        {loaded && (
          <p className="text-xs text-muted">
            Foto original: {loaded.width} × {loaded.height} px.
            {loaded.width < 1200 ? " Em telas grandes ela pode ficar um pouco embaçada." : ""}
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm font-medium text-red-800">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="btn btn-outline !px-5 !py-2.5 text-[13px] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => void confirm()}
            disabled={saving || !loaded || !layout || loadFailed}
            className="btn btn-primary !px-5 !py-2.5 text-[13px] disabled:opacity-50"
          >
            {saving ? "Enviando…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
