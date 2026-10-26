"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import type { FormState } from "@/app/admin/actions";
import ArticleBody from "@/components/ArticleBody";
import CoverUploader from "@/components/admin/post/CoverUploader";
import TagInput from "@/components/admin/post/TagInput";
import { uploadPostImage } from "@/lib/image-upload";
import type { Post } from "@/lib/posts";
import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/client";

const label = "flex flex-col gap-1.5 text-sm font-semibold text-ink";
const hint = "text-xs font-normal text-muted";
const TITLE_MAX = 70;
const EXCERPT_MAX = 160;

type Draft = {
  title: string;
  slug: string;
  category: string;
  showCategory: boolean;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  authorName: string;
  authorRole: string;
  reviewedBy: string;
  reviewedRole: string;
  featured: boolean;
};

function initialDraft(post?: Post): Draft {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    category: post?.category ?? "",
    showCategory: post?.show_category !== false,
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    coverImage: post?.cover_image ?? "",
    tags: post?.tags ?? [],
    authorName: post?.author_name ?? "",
    authorRole: post?.author_role ?? "",
    reviewedBy: post?.reviewed_by ?? "",
    reviewedRole: post?.reviewed_role ?? "",
    featured: post?.featured ?? false,
  };
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function clip(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

const siteHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").host;
  } catch {
    return "seusite.com.br";
  }
})();

type ToolKind =
  | "h1"
  | "h2"
  | "h3"
  | "bold"
  | "italic"
  | "ul"
  | "ol"
  | "quote"
  | "link"
  | "image";

const tools: { kind: ToolKind; title: string; label: React.ReactNode; group: number }[] = [
  { kind: "h1", title: "Título de seção grande (H1)", label: "H1", group: 0 },
  { kind: "h2", title: "Título de seção (H2)", label: "H2", group: 0 },
  { kind: "h3", title: "Subtítulo (H3)", label: "H3", group: 0 },
  { kind: "bold", title: "Negrito (Ctrl + B)", label: <b>N</b>, group: 1 },
  { kind: "italic", title: "Itálico (Ctrl + I)", label: <i className="font-serif">I</i>, group: 1 },
  { kind: "ul", title: "Lista com marcadores", label: "• Lista", group: 2 },
  { kind: "ol", title: "Lista numerada", label: "1. Lista", group: 2 },
  { kind: "quote", title: "Citação", label: "“ Citação", group: 2 },
  { kind: "link", title: "Link (Ctrl + K)", label: "Link", group: 3 },
  { kind: "image", title: "Imagem no meio do texto", label: "Imagem", group: 3 },
];

export default function PostForm({
  post,
  action,
  suggestions,
}: {
  post?: Post;
  action: (previous: FormState, formData: FormData) => Promise<FormState>;
  suggestions: { categories: string[]; tags: string[] };
}) {
  const initial = useMemo(() => initialDraft(post), [post]);
  const [draft, setDraft] = useState<Draft>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [slugCheck, setSlugCheck] = useState<"taken" | "free" | null>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [recovered, setRecovered] = useState<Draft | null>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, null);

  const textarea = useRef<HTMLTextAreaElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const imageCursor = useRef<number>(0);
  const storageKey = `gf-post-draft:${post?.id ?? "new"}`;
  const published = Boolean(post?.published);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  // Rascunho automático neste navegador: se a aba fechar, nada se perde.
  useEffect(() => {
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

  // Se o servidor recusou o envio, o rascunho local volta a valer.
  useEffect(() => {
    if (!state || state.ok) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(draft));
    } catch {
      /* ignora */
    }
  }, [state, draft, storageKey]);

  // Avisa antes de fechar a aba com texto não salvo.
  useEffect(() => {
    if (!dirty || pending) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, pending]);

  async function checkSlug() {
    const slug = draft.slug;
    if (!slug) return;
    const supabase = createClient();
    const { data } = await supabase.from("posts").select("id").eq("slug", slug).limit(1);
    const other = (data ?? []).find((row) => row.id !== post?.id);
    setSlugCheck(other ? "taken" : "free");
  }

  function format(kind: ToolKind) {
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

    // Aplica (ou tira) um prefixo em cada linha selecionada.
    const prefixLines = (prefix: (index: number) => string, strip: RegExp, placeholder: string) => {
      const lineStart = text.lastIndexOf("\n", start - 1) + 1;
      const block = text.slice(lineStart, end) || placeholder;
      const lines = block.split("\n");
      const allHave = lines.every((line) => prefix(0).trim() && line.startsWith(prefix(0)));
      const result = lines
        .map((line, i) => {
          const clean = line.replace(strip, "");
          return allHave ? clean : prefix(i) + clean;
        })
        .join("\n");
      next = text.slice(0, lineStart) + result + text.slice(end);
      from = lineStart;
      to = lineStart + result.length;
    };

    const heading = /^#{1,6}\s+/;
    if (kind === "h1") prefixLines(() => "# ", heading, "Título da seção");
    else if (kind === "h2") prefixLines(() => "## ", heading, "Título da seção");
    else if (kind === "h3") prefixLines(() => "### ", heading, "Subtítulo");
    else if (kind === "bold") wrap("**", "**", "texto em negrito");
    else if (kind === "italic") wrap("*", "*", "texto em itálico");
    else if (kind === "ul") prefixLines(() => "- ", /^(?:[-*]|\d+\.)\s+/, "Item da lista");
    else if (kind === "ol")
      prefixLines((i) => `${i + 1}. `, /^(?:[-*]|\d+\.)\s+/, "Item da lista");
    else if (kind === "quote") prefixLines(() => "> ", /^>\s?/, "Citação");
    else if (kind === "link") {
      const url = window.prompt("Endereço do link (comece com https://)");
      if (!url) return;
      wrap("[", `](${url})`, "texto do link");
    } else if (kind === "image") {
      imageCursor.current = start;
      imageInput.current?.click();
      return;
    }

    set("content", next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(from, to);
    });
  }

  async function insertImage(file: File) {
    setImageBusy(true);
    setImageError(null);
    try {
      const { url } = await uploadPostImage(file, "inline");
      const alt = (window.prompt(
        "Descreva a imagem em poucas palavras (para quem usa leitor de tela e para o Google):",
        "",
      ) ?? "")
        .replace(/[\[\]\n]/g, " ")
        .trim();
      const at = Math.min(imageCursor.current, draft.content.length);
      const snippet = `\n\n![${alt}](${url})\n\n`;
      set("content", draft.content.slice(0, at) + snippet + draft.content.slice(at));
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Falha no envio da imagem.");
    } finally {
      setImageBusy(false);
    }
  }

  function onEditorKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(event.ctrlKey || event.metaKey)) return;
    const key = event.key.toLowerCase();
    if (key === "b") {
      event.preventDefault();
      format("bold");
    } else if (key === "i") {
      event.preventDefault();
      format("italic");
    } else if (key === "k") {
      event.preventDefault();
      format("link");
    }
  }

  const words = wordCount(draft.content);
  const titleLen = draft.title.trim().length;
  const excerptLen = draft.excerpt.trim().length;

  const checklist = [
    {
      ok: titleLen >= 20 && titleLen <= TITLE_MAX,
      text: `Título entre 20 e ${TITLE_MAX} caracteres (aparece inteiro no Google)`,
    },
    {
      ok: excerptLen >= 80 && excerptLen <= EXCERPT_MAX,
      text: `Resumo entre 80 e ${EXCERPT_MAX} caracteres`,
    },
    { ok: Boolean(draft.coverImage), text: "Capa enviada" },
    { ok: draft.tags.length >= 2, text: "Pelo menos 2 tags" },
    { ok: /^#{1,3}\s+\S/m.test(draft.content), text: "Textos divididos com títulos (H1, H2 ou H3)" },
    { ok: words >= 300, text: "Texto com 300 palavras ou mais (recomendado)" },
  ];
  const checklistDone = checklist.filter((item) => item.ok).length;

  const preview = (
    <div className="flex flex-col gap-5">
      <article className="card overflow-hidden">
        {draft.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={draft.coverImage} alt="" className="aspect-video w-full object-cover" />
        )}
        <div className="p-6 md:p-8">
          {draft.showCategory && draft.category.trim() && (
            <p className="eyebrow">{draft.category}</p>
          )}
          <h2 className="mb-3 mt-4 text-[1.9rem] leading-[1.15]">
            {draft.title || "Título da matéria"}
          </h2>
          <p className="text-[1.05rem] text-[#111]">
            {draft.excerpt || "O resumo aparece aqui e na lista de matérias."}
          </p>
          {draft.tags.length > 0 && (
            <p className="mt-4 flex flex-wrap gap-1.5">
              {draft.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </p>
          )}
          <div className="mt-8 border-t border-rule pt-8">
            {draft.content.trim() ? (
              <ArticleBody content={draft.content} />
            ) : (
              <p className="text-muted">O texto da matéria aparece aqui enquanto você escreve.</p>
            )}
          </div>
        </div>
      </article>

      <div className="card p-5">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-ink">
          Como aparece no Google
        </p>
        <p className="truncate text-[13px] text-[#4d5156]">
          {siteHost} › blog › {draft.slug || "endereco-da-materia"}
        </p>
        <p className="mt-0.5 text-[1.15rem] leading-snug text-[#1a0dab]">
          {clip(draft.title || "Título da matéria", 60)}
        </p>
        <p className="mt-1 text-[14px] leading-snug text-[#4d5156]">
          {clip(draft.excerpt || "O resumo da matéria aparece aqui.", 160)}
        </p>
      </div>
    </div>
  );

  return (
    <form
      id="post-form"
      action={formAction}
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

      {state && !state.ok && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-800"
        >
          {state.message}
        </p>
      )}

      {/* Barra de ações */}
      <div className="card flex flex-wrap items-center justify-between gap-4 px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              published ? "bg-forest text-white" : "bg-sand-soft text-gold-ink"
            }`}
          >
            {published ? "Publicada" : "Rascunho"}
          </span>
          <span className="text-xs text-muted">
            {words} palavras
            {dirty ? " · alterações não salvas" : ""}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            name="intent"
            value="save"
            disabled={pending}
            className={`btn !px-6 !py-2.5 disabled:opacity-60 ${published ? "btn-primary" : "btn-outline"}`}
          >
            {pending ? "Salvando…" : published ? "Salvar alterações" : "Salvar rascunho"}
          </button>
          {published ? (
            <button
              type="submit"
              name="intent"
              value="unpublish"
              disabled={pending}
              className="btn btn-outline !px-6 !py-2.5 disabled:opacity-60"
            >
              Voltar a rascunho
            </button>
          ) : (
            <button
              type="submit"
              name="intent"
              value="publish"
              disabled={pending}
              className="btn btn-primary !px-6 !py-2.5 disabled:opacity-60"
            >
              Publicar agora
            </button>
          )}
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
            <span className="flex items-baseline justify-between gap-3">
              <span>
                Título <span className="font-normal text-muted">(é o H1 da página)</span>
              </span>
              <span
                className={`text-xs font-normal ${
                  titleLen > TITLE_MAX ? "font-bold text-red-800" : "text-muted"
                }`}
              >
                {titleLen}/{TITLE_MAX}
              </span>
            </span>
            <input
              name="title"
              required
              value={draft.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
                setSlugCheck(null);
              }}
              placeholder="Escreva um título claro e atrativo"
              className="field !text-[1.1rem] font-medium"
            />
          </label>

          <label className={label}>
            <span className="flex items-baseline justify-between gap-3">
              <span>Slug (endereço da matéria)</span>
              {slugTouched && (
                <button
                  type="button"
                  className="text-xs font-semibold text-forest underline underline-offset-2"
                  onClick={() => {
                    setSlugTouched(false);
                    set("slug", slugify(draft.title));
                    setSlugCheck(null);
                  }}
                >
                  Gerar do título
                </button>
              )}
            </span>
            <input
              name="slug"
              required
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
                setSlugCheck(null);
              }}
              onBlur={() => void checkSlug()}
              placeholder="endereco-da-materia"
              className="field font-mono text-sm"
              aria-invalid={slugCheck === "taken"}
            />
            <span
              className={
                slugCheck === "taken"
                  ? "text-xs font-medium text-red-800"
                  : slugCheck === "free"
                    ? "text-xs font-medium text-forest"
                    : hint
              }
            >
              {slugCheck === "taken"
                ? "Já existe outra matéria com esse endereço. Escolha outro."
                : slugCheck === "free"
                  ? `Disponível · ${siteHost}/blog/${draft.slug}`
                  : `${siteHost}/blog/${draft.slug || "endereco-da-materia"}${
                      post ? " · mudar o endereço quebra links já compartilhados" : ""
                    }`}
            </span>
          </label>

          <label className={label}>
            <span className="flex items-baseline justify-between gap-3">
              <span>Resumo</span>
              <span
                className={`text-xs font-normal ${
                  excerptLen > EXCERPT_MAX ? "font-bold text-red-800" : "text-muted"
                }`}
              >
                {excerptLen}/{EXCERPT_MAX}
              </span>
            </span>
            <textarea
              name="excerpt"
              required
              rows={3}
              value={draft.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Uma ou duas frases que fazem a pessoa querer ler."
              className="field"
            />
            <span className={hint}>
              Aparece na lista de matérias e como descrição no Google.
            </span>
          </label>

          <div className={label}>
            <span>Texto da matéria</span>
            <p className={hint}>
              O título acima já é o H1 da página. No texto, use{" "}
              <b>H1</b> para um título de seção grande, <b>H2</b> para um menor e{" "}
              <b>H3</b> para subtítulos.
            </p>
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="toolbar"
              aria-label="Formatação do texto"
            >
              {tools.map((tool, i) => (
                <span key={tool.kind} className="flex items-center gap-1.5">
                  {i > 0 && tools[i - 1].group !== tool.group && (
                    <span aria-hidden className="mx-1 h-5 w-px bg-rule-strong" />
                  )}
                  <button
                    type="button"
                    title={tool.title}
                    aria-label={tool.title}
                    disabled={tool.kind === "image" && imageBusy}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => format(tool.kind)}
                    className="rounded-lg border border-rule-strong bg-white px-3 py-1.5 text-[13px] font-semibold text-ink hover:border-forest hover:text-forest disabled:opacity-50"
                  >
                    {tool.kind === "image" && imageBusy ? "Enviando…" : tool.label}
                  </button>
                </span>
              ))}
            </div>
            <input
              ref={imageInput}
              type="file"
              accept="image/*"
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) void insertImage(file);
              }}
            />
            <textarea
              ref={textarea}
              id="content"
              name="content"
              required
              rows={20}
              value={draft.content}
              onChange={(e) => set("content", e.target.value)}
              onKeyDown={onEditorKeyDown}
              placeholder="Escreva aqui. Use os botões acima para títulos, negrito, listas, links e imagens."
              className="field leading-relaxed text-[#111]"
            />
            {imageError && (
              <span role="alert" className="text-xs font-medium text-red-800">
                {imageError}
              </span>
            )}
            <span className={hint}>
              Atalhos: Ctrl + B negrito · Ctrl + I itálico · Ctrl + K link. O
              texto corrido é publicado em preto; só os títulos ficam azuis.
            </span>
          </div>
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

      {/* Configurações da matéria */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section className="card flex flex-col gap-4 p-6" aria-labelledby="cover-title">
          <h3 id="cover-title" className="text-[1.15rem]">
            Imagem de capa
          </h3>
          <input type="hidden" name="cover_image" value={draft.coverImage} />
          <CoverUploader value={draft.coverImage} onChange={(url) => set("coverImage", url)} />
        </section>

        <div className="flex flex-col gap-6">
          <section className="card flex flex-col gap-5 p-6" aria-labelledby="org-title">
            <h3 id="org-title" className="text-[1.15rem]">
              Organização
            </h3>
            <label className={label}>
              Categoria <span className="font-normal text-muted">(opcional)</span>
              <input
                name="category"
                list="category-options"
                value={draft.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="Escolha ou escreva uma categoria"
                className="field"
                autoComplete="off"
              />
              <datalist id="category-options">
                {suggestions.categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>

            <label className="flex items-center gap-2.5 text-sm font-medium">
              <input
                type="checkbox"
                name="show_category"
                checked={draft.showCategory}
                onChange={(e) => set("showCategory", e.target.checked)}
                className="h-4 w-4 accent-[var(--forest)]"
              />
              Mostrar a categoria no site
            </label>

            <div className={label}>
              Tags
              <TagInput
                value={draft.tags}
                onChange={(tags) => set("tags", tags)}
                suggestions={suggestions.tags}
              />
            </div>

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
          </section>

          <section className="card flex flex-col gap-4 p-6" aria-labelledby="author-title">
            <h3 id="author-title" className="text-[1.15rem]">
              Autoria e revisão <span className="text-sm font-normal text-muted">(opcional)</span>
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
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
          </section>

          <section className="card flex flex-col gap-3 p-6" aria-labelledby="check-title">
            <h3 id="check-title" className="flex items-baseline justify-between text-[1.15rem]">
              Antes de publicar
              <span className="text-sm font-normal text-muted">
                {checklistDone} de {checklist.length}
              </span>
            </h3>
            <ul className="flex flex-col gap-2 text-[14px]">
              {checklist.map((item) => (
                <li key={item.text} className="flex items-start gap-2.5">
                  <span
                    aria-hidden
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      item.ok ? "bg-forest text-white" : "border border-rule-strong text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span className={item.ok ? "text-body" : "text-muted"}>{item.text}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted">
              São sugestões para a matéria ser bem encontrada; nada disso
              impede de publicar.
            </p>
          </section>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          name="intent"
          value="save"
          disabled={pending}
          className={`btn disabled:opacity-60 ${published ? "btn-primary" : "btn-outline"}`}
        >
          {pending ? "Salvando…" : published ? "Salvar alterações" : "Salvar rascunho"}
        </button>
        {!published && (
          <button
            type="submit"
            name="intent"
            value="publish"
            disabled={pending}
            className="btn btn-primary disabled:opacity-60"
          >
            Publicar agora
          </button>
        )}
      </div>
    </form>
  );
}
