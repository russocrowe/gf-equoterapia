"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEditor } from "@/components/editor/EditorProvider";
import { editablePages } from "@/lib/content-defaults";

const barButton =
  "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-50";

// Barra do administrador. Fica junto do cabeçalho (não flutua sobre o
// conteúdo): em modo normal oferece "Editar esta página"; em modo de edição
// mostra o que mudou e os botões de publicar / desfazer / sair.
export default function EditBar() {
  const pathname = usePathname();
  const editor = useEditor();
  const {
    canEdit,
    editing,
    changedKeys,
    status,
    pageLabel,
    startEditing,
    stopEditing,
    discard,
    save,
    goToPage,
  } = editor;

  if (!canEdit) return null;

  const count = changedKeys.length;
  const saving = status.kind === "saving";

  if (!editing) {
    return (
      <div data-editor-ui className="bg-forest-deep text-white">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-4 gap-y-2 px-6 py-2 text-[13px] md:px-12">
          <span className="flex items-center gap-2 font-medium text-white/90">
            <span aria-hidden className="h-2 w-2 rounded-full bg-gold" />
            Você é administrador
          </span>
          {pageLabel ? (
            <button
              type="button"
              onClick={startEditing}
              className={`${barButton} bg-gold text-forest-deep hover:bg-[#d6b96f]`}
            >
              Editar esta página
            </button>
          ) : null}
          <Link
            href="/admin"
            className="text-white/85 underline-offset-4 hover:text-white hover:underline"
          >
            Abrir painel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-editor-ui className="bg-forest-deep text-white shadow-md">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-3 gap-y-2 px-6 py-2.5 text-[13px] md:px-12">
        <span className="flex items-center gap-2 font-semibold">
          <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-gold" />
          Editando
        </span>

        <label className="flex items-center gap-2">
          <span className="sr-only">Página em edição</span>
          <select
            value={pathname}
            onChange={(e) => goToPage(e.target.value)}
            className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[13px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {editablePages.map((page) => (
              <option key={page.href} value={page.href} className="text-ink">
                {page.label}
              </option>
            ))}
          </select>
        </label>

        <span className="hidden text-white/75 lg:inline">
          Clique em qualquer texto para escrever. Ctrl + S publica.
        </span>

        <span className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            title="Itálico (Ctrl + I): destaque uma palavra e clique"
            aria-label="Aplicar itálico ao texto selecionado"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => document.execCommand("italic")}
            className={`${barButton} border border-white/25 bg-white/10 font-serif text-[15px] italic hover:bg-white/20`}
          >
            I
          </button>

          <span
            role="status"
            aria-live="polite"
            className={`max-w-[18rem] text-[12.5px] ${
              status.kind === "error"
                ? "rounded bg-red-100 px-2 py-1 font-medium text-red-900"
                : status.kind === "saved"
                  ? "text-sand"
                  : "text-white/80"
            }`}
          >
            {status.text ||
              (count > 0
                ? `${count} ${count === 1 ? "alteração" : "alterações"} não publicada${count === 1 ? "" : "s"}`
                : "Tudo publicado")}
          </span>

          <button
            type="button"
            onClick={discard}
            disabled={count === 0 || saving}
            className={`${barButton} border border-white/25 hover:bg-white/10`}
          >
            Desfazer
          </button>
          <button
            type="button"
            onClick={() => void save()}
            disabled={count === 0 || saving}
            className={`${barButton} bg-gold text-forest-deep hover:bg-[#d6b96f]`}
          >
            {saving ? "Publicando…" : "Salvar e publicar"}
          </button>
          <button
            type="button"
            onClick={stopEditing}
            className={`${barButton} text-white/90 hover:bg-white/10`}
          >
            Sair
          </button>
        </span>
      </div>
    </div>
  );
}
