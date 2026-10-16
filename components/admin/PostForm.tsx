"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/lib/posts";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const label = "flex flex-col gap-1.5 text-sm font-semibold text-ink";
const hint = "text-xs font-normal text-muted";

type Draft = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  readMinutes: string;
  authorName: string;
  authorRole: string;
  reviewedBy: string;
  reviewedRole: string;
  featured: boolean;
  published: boolean;
};

function initialDraft(post?: Post): Draft {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    category: post?.category ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    coverImage: post?.cover_image ?? "",
    readMinutes: post?.read_minutes ? String(post.read_minutes) : "",
    authorName: post?.author_name ?? "",
    authorRole: post?.author_role ?? "",
    reviewedBy: post?.reviewed_by ?? "",
    reviewedRole: post?.reviewed_role ?? "",
    featured: post?.featured ?? false,
    published: post?.published ?? false,
  };
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const tools: { title: string; label: React.ReactNode; run: string }[] = [
  { title: "Negrito", label: <b>N</b>, run: "bold" },
  { title: "Itálico", label: <i className="font-serif">I</i>, run: "italic" },
  { title: "Título de seção", label: "Título", run: "h2" },
  { title: "Lista", label: "Lista", run: "list" },
  { title: "Citação", label: "Citação", run: "quote" },
  { title: "Link", label: "Link", run: "link" },
];

export default function PostForm({
  post,
  action,
}: {
  post?: Post;
  action: (formData: FormData) => void;
}) {
  const initial = useMemo(() => initialDraft(post), [post]);
  const [draft, setDraft] = useState<Draft>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [recovered, setRecovered] = useState<Draft | null>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const storageKey = `gf-post-draft:${post?.id ?? "new"}`;

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  // Rascunho automático neste navegador: se a aba fechar, nada se perde.
  useEffect(() => {
    // Adiado um instante: o rascunho vem do navegador, não do servidor.
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return;
        const saved = JSON.parse(raw) as Draft;
        if (JSON.stringify(saved) !== JSON.stringify(initial)) setRecovered(saved);
      } catch {
        /* sem acesso ao armazenamento: segue sem rascunho */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [storageKey, initial]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (JSON.stringify(draft) === JSON.stringify(initial)) {
          localStorage.removeItem(storageKey);
        } else {
          localStorage.setItem(storageKey, JSON.stringify(draft));
        }
      } catch {
        /* ignora */
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [draft, initial, storageKey]);

  async function handleFileUpload(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("post-images")
        .upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("post-images").getPublicUrl(path);
      set("coverImage", data.publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setUploading(false);
    }
  }

  function format(kind: string) {
    const el = textarea.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const text = draft.content;
    const selected = text.slice(start, end);
    let next = text;
    let from = start;
    let to = end;

    const wrap = (before: string, after: string, placeholder: string) => {
      const inner = selected || placeholder;
      next = text.slice(0, start) + before + inner + after + text.slice(end);
      from = start + before.length;
      to = from + inner.length;
    };

    const prefixLines = (prefix: string, placeholder: string) => {
      const lineStart = text.lastIndexOf("\n", start - 1) + 1;
      const block = text.slice(lineStart, end) || placeholder;
      const prefixed = block
        .split("\n")
        .map((line) => prefix + line)
        .join("\n");
      next = text.slice(0, lineStart) + prefixed + text.slice(end);
      from = lineStart + prefix.length;
      to = lineStart + prefixed.length;
    };

    if (kind === "bold") wrap("**", "**", "texto em negrito");
    else if (kind === "italic") wrap("*", "*", "texto em itálico");
    else if (kind === "h2") prefixLines("## ", "Título da seção");
    else if (kind === "list") prefixLines("- ", "Item da lista");
    else if (kind === "quote") prefixLines("> ", "Citação");
    else if (kind === "link") {
      const url = window.prompt("Endereço do link (comece com https://)");
      if (!url) return;
      wrap("[", `](${url})`, "texto do link");
    }

    set("content", next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(from, to);
    });
  }

  const words = wordCount(draft.content);
  const autoMinutes = Math.max(1, Math.round(words / 200));

  const preview = (
    <article className="card overflow-hidden">
      {draft.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={draft.coverImage}
          alt=""
          className="aspect-[16/9] w-full object-cover"
        />
      )}
      <div className="p-6 md:p-8">
        <p className="eyebrow">{draft.category || "Categoria"}</p>
        <h2 className="mb-3 mt-4 text-[1.9rem] leading-[1.15]">
          {draft.title || "Título da matéria"}
        </h2>
        <p className="text-[1.05rem] text-body">
          {draft.excerpt || "O resumo aparece aqui e na lista de matérias."}
        </p>
        <p className="mt-4 text-xs text-muted">
          {draft.readMinutes || autoMinutes} min de leitura
          {draft.authorName ? ` · Por ${draft.authorName}` : ""}
        </p>
        <div className="mt-8 border-t border-rule pt-8">
          {draft.content.trim() ? (
            <div className="prose-article">
              <ReactMarkdown>{draft.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-muted">O texto da matéria aparece aqui enquanto você escreve.</p>
          )}
        </div>
      </div>
    </article>
  );

  return (
    <form
      id="post-form"
      action={action}
      onSubmit={() => {
        try {
          localStorage.removeItem(storageKey);
        } catch {
          /* ignora */
        }
      }}
      className="flex flex-col gap-6"
    >
      {recovered && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/60 bg-sand-soft px-5 py-3 text-sm"
        >
          <span>
            <b>Encontramos um rascunho não salvo</b> deste texto neste navegador.
          </span>
          <span className="flex gap-3">
            <button
              type="button"
              className="link-arrow"
              onClick={() => {
                setDraft(recovered);
                setSlugTouched(true);
                setRecovered(null);
              }}
            >
              Restaurar
            </button>
            <button
              type="button"
              className="link-arrow !border-rule-strong"
              onClick={() => {
                try {
                  localStorage.removeItem(storageKey);
                } catch {
                  /* ignora */
                }
                setRecovered(null);
              }}
            >
              Descartar
            </button>
          </span>
        </div>
      )}

      {/* Barra de ações */}
      <div className="card flex flex-wrap items-center justify-between gap-4 px-5 py-3.5">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            name="published"
            checked={draft.published}
            onChange={(e) => set("published", e.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="relative h-6 w-11 rounded-full bg-rule-strong transition-colors peer-checked:bg-forest peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-forest after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
          />
          {draft.published ? "Publicada no site" : "Rascunho (só você vê)"}
        </label>
        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-muted sm:inline">
            {words} palavras · {autoMinutes} min de leitura
          </span>
          <button type="submit" className="btn btn-primary !px-6 !py-2.5">
            Salvar matéria
          </button>
        </div>
      </div>

      {/* Abas (telas pequenas) */}
      <div role="tablist" aria-label="Modo" className="flex gap-2 xl:hidden">
        {(
          [
            ["write", "Escrever"],
            ["preview", "Ver como ficará"],
          ] as const
        ).map(([id, text]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === id ? "bg-navy text-white" : "bg-sage-soft text-ink"
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-8 xl:grid-cols-2">
        {/* Escrever */}
        <div className={`flex flex-col gap-6 ${tab === "preview" ? "hidden xl:flex" : ""}`}>
          <label className={label}>
            Título
            <input
              name="title"
              required
              value={draft.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
              }}
              className="field !text-[1.1rem] font-medium"
            />
          </label>

          <label className={label}>
            Resumo
            <textarea
              name="excerpt"
              required
              rows={2}
              value={draft.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              className="field"
            />
            <span className={hint}>
              Aparece na lista de matérias e no Google.{" "}
              <b className={draft.excerpt.length > 180 ? "text-red-800" : ""}>
                {draft.excerpt.length}/180
              </b>
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>
              Categoria
              <input
                name="category"
                required
                value={draft.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="Ex.: Acolhimento"
                className="field"
              />
            </label>
            <label className={label}>
              Minutos de leitura
              <input
                name="read_minutes"
                type="number"
                min={1}
                value={draft.readMinutes}
                onChange={(e) => set("readMinutes", e.target.value)}
                placeholder={`Automático (${autoMinutes})`}
                className="field"
              />
            </label>
          </div>

          <div className={label}>
            <span>Conteúdo</span>
            <div className="flex flex-wrap gap-1.5" role="toolbar" aria-label="Formatação">
              {tools.map((tool) => (
                <button
                  key={tool.run}
                  type="button"
                  title={tool.title}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => format(tool.run)}
                  className="rounded-lg border border-rule-strong bg-white px-3 py-1.5 text-[13px] font-semibold text-ink hover:border-forest hover:text-forest"
                >
                  {tool.label}
                </button>
              ))}
            </div>
            <textarea
              ref={textarea}
              id="content"
              name="content"
              required
              rows={18}
              value={draft.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Escreva aqui. Use os botões acima para título, negrito, lista e link."
              className="field leading-relaxed"
            />
            <span className={hint}>
              Dica: uma linha começando com <code>##</code> vira título de seção.
            </span>
          </div>

          <div className={label}>
            <label htmlFor="cover-upload">Imagem de capa</label>
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFileUpload(file);
              }}
              className="text-sm font-normal"
            />
            <input type="hidden" name="cover_image" value={draft.coverImage} />
            {uploading && <span className={hint}>Enviando…</span>}
            {uploadError && (
              <span role="alert" className="text-xs font-normal text-red-800">
                {uploadError}
              </span>
            )}
            {draft.coverImage && (
              <div className="mt-1 flex items-end gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={draft.coverImage}
                  alt="Pré-visualização da capa"
                  className="h-28 w-auto rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => set("coverImage", "")}
                  className="link-arrow font-normal"
                >
                  Remover capa
                </button>
              </div>
            )}
          </div>

          <details className="rounded-xl border border-rule bg-white p-5">
            <summary className="cursor-pointer text-sm font-semibold text-ink">
              Autoria e revisão (opcional)
            </summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className={label}>
                Autor(a)
                <input
                  name="author_name"
                  value={draft.authorName}
                  onChange={(e) => set("authorName", e.target.value)}
                  placeholder="Nome"
                  className="field"
                />
              </label>
              <label className={label}>
                Profissão do autor(a)
                <input
                  name="author_role"
                  value={draft.authorRole}
                  onChange={(e) => set("authorRole", e.target.value)}
                  placeholder="Ex.: Fisioterapeuta"
                  className="field"
                />
              </label>
              <label className={label}>
                Revisado por
                <input
                  name="reviewed_by"
                  value={draft.reviewedBy}
                  onChange={(e) => set("reviewedBy", e.target.value)}
                  placeholder="Nome"
                  className="field"
                />
              </label>
              <label className={label}>
                Profissão do revisor
                <input
                  name="reviewed_role"
                  value={draft.reviewedRole}
                  onChange={(e) => set("reviewedRole", e.target.value)}
                  placeholder="Ex.: Psicóloga"
                  className="field"
                />
              </label>
            </div>
          </details>

          <details className="rounded-xl border border-rule bg-white p-5">
            <summary className="cursor-pointer text-sm font-semibold text-ink">
              Endereço e destaque
            </summary>
            <div className="mt-4 flex flex-col gap-5">
              <label className={label}>
                Endereço da matéria (URL)
                <input
                  name="slug"
                  required
                  value={draft.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                  className="field font-mono text-sm"
                />
                <span className={hint}>
                  /blog/{draft.slug || "endereco-da-materia"} · gerado a partir
                  do título
                </span>
              </label>
              <label className="flex items-center gap-2.5 text-sm font-medium">
                <input
                  type="checkbox"
                  name="featured"
                  checked={draft.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="h-4 w-4 accent-[var(--forest)]"
                />
                Destacar na página Equoterapia
              </label>
            </div>
          </details>

          <button type="submit" className="btn btn-primary self-start">
            Salvar matéria
          </button>
        </div>

        {/* Pré-visualização ao vivo */}
        <div
          className={`xl:sticky xl:top-40 xl:max-h-[calc(100vh-11rem)] xl:overflow-y-auto xl:rounded-3xl ${
            tab === "write" ? "hidden xl:block" : ""
          }`}
        >
          <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-ink">
            <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-forest" />
            Pré-visualização ao vivo
          </p>
          {preview}
        </div>
      </div>
    </form>
  );
}
