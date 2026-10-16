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

const label = "flex flex-col gap-1.5 text-sm font-medium";

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
      <label className={label}>
        Título
        <input
          name="title"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="field"
        />
      </label>

      <label className={label}>
        Endereço da matéria (URL)
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          className="field font-mono"
        />
        <span className="text-xs font-normal">/blog/{slug || "endereco-da-materia"}</span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Categoria
          <input
            name="category"
            required
            defaultValue={post?.category ?? ""}
            placeholder="Ex: Acolhimento"
            className="field"
          />
        </label>
        <label className={label}>
          Minutos de leitura
          <input
            name="read_minutes"
            type="number"
            min={1}
            defaultValue={post?.read_minutes ?? ""}
            placeholder="Automático se vazio"
            className="field"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Autor(a)
          <input
            name="author_name"
            defaultValue={post?.author_name ?? ""}
            placeholder="Nome"
            className="field"
          />
        </label>
        <label className={label}>
          Profissão do autor(a)
          <input
            name="author_role"
            defaultValue={post?.author_role ?? ""}
            placeholder="Ex: Fisioterapeuta"
            className="field"
          />
        </label>
        <label className={label}>
          Revisado por
          <input
            name="reviewed_by"
            defaultValue={post?.reviewed_by ?? ""}
            placeholder="Nome"
            className="field"
          />
        </label>
        <label className={label}>
          Profissão do revisor
          <input
            name="reviewed_role"
            defaultValue={post?.reviewed_role ?? ""}
            placeholder="Ex: Psicóloga"
            className="field"
          />
        </label>
      </div>

      <label className={label}>
        Resumo (aparece na listagem)
        <textarea
          name="excerpt"
          required
          rows={2}
          defaultValue={post?.excerpt ?? ""}
          className="field"
        />
      </label>

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
        <input type="hidden" name="cover_image" value={coverImage} />
        {uploading && <span className="text-xs font-normal">Enviando…</span>}
        {uploadError && (
          <span role="alert" className="text-xs font-normal text-red-800">
            {uploadError}
          </span>
        )}
        {coverImage && (
          <div className="mt-1 flex items-end gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt="Pré-visualização da capa"
              className="h-32 w-auto rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => setCoverImage("")}
              className="link-arrow font-normal"
            >
              Remover capa
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 text-sm">
        <div className="flex items-center justify-between">
          <label htmlFor="content" className="font-medium">
            Conteúdo (markdown)
          </label>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="link-arrow text-xs"
          >
            {showPreview ? "Editar" : "Pré-visualizar"}
          </button>
        </div>
        {showPreview && (
          <div className="prose-article min-h-64 rounded-md border border-rule-strong bg-white px-4 py-3">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
        {/* Fica montado (só oculto) para o conteúdo ir junto no envio. */}
        <textarea
          id="content"
          name="content"
          required
          rows={16}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`field font-mono ${showPreview ? "hidden" : ""}`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={post?.featured ?? false}
          />
          Destacar na página de matérias
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post?.published ?? false}
          />
          Publicada
        </label>
      </div>

      <button type="submit" className="btn btn-primary self-start">
        Salvar matéria
      </button>
    </form>
  );
}
