"use client";

import { useState } from "react";
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

export default function PostForm({
  post,
  action,
}: {
  post?: Post;
  action: (formData: FormData) => void;
}) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
      setCoverImage(data.publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1 text-sm">
        Título
        <input
          name="title"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-green"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Slug (URL)
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm font-mono outline-none focus:border-green"
        />
        <span className="text-xs text-muted">/blog/{slug || "seu-slug"}</span>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Categoria
          <input
            name="category"
            required
            defaultValue={post?.category ?? ""}
            placeholder="Ex: Acolhimento"
            className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-green"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Minutos de leitura
          <input
            name="read_minutes"
            type="number"
            min={1}
            defaultValue={post?.read_minutes ?? ""}
            placeholder="Automático se vazio"
            className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-green"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Autor(a)
          <input
            name="author_name"
            defaultValue={post?.author_name ?? ""}
            placeholder="Nome"
            className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-green"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Profissão do autor(a)
          <input
            name="author_role"
            defaultValue={post?.author_role ?? ""}
            placeholder="Ex: Fisioterapeuta"
            className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-green"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Revisado por
          <input
            name="reviewed_by"
            defaultValue={post?.reviewed_by ?? ""}
            placeholder="Nome"
            className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-green"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Profissão do revisor
          <input
            name="reviewed_role"
            defaultValue={post?.reviewed_role ?? ""}
            placeholder="Ex: Psicóloga"
            className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-green"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Resumo (aparece na listagem)
        <textarea
          name="excerpt"
          required
          rows={2}
          defaultValue={post?.excerpt ?? ""}
          className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-green"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Imagem de capa
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          className="text-sm"
        />
        <input type="hidden" name="cover_image" value={coverImage} />
        {uploading && <span className="text-xs text-muted">Enviando…</span>}
        {uploadError && (
          <span className="text-xs text-red-700">{uploadError}</span>
        )}
        {coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt="Pré-visualização da capa"
            className="mt-2 h-32 w-auto rounded-lg object-cover"
          />
        )}
      </label>

      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-center justify-between">
          <span>Conteúdo (markdown)</span>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-xs font-medium underline decoration-lime decoration-2 underline-offset-4"
          >
            {showPreview ? "Editar" : "Pré-visualizar"}
          </button>
        </div>
        {showPreview ? (
          <div className="prose-article min-h-64 rounded-lg border border-ink/20 bg-white px-4 py-3">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            name="content"
            required
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="rounded-lg border border-ink/20 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-green"
          />
        )}
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={post?.featured ?? false}
          />
          Destacar no blog
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post?.published ?? false}
          />
          Publicado
        </label>
      </div>

      <button
        type="submit"
        className="self-start rounded-full bg-green px-6 py-3 font-display text-sm font-semibold text-paper transition-opacity hover:opacity-90"
      >
        Salvar artigo
      </button>
    </form>
  );
}
