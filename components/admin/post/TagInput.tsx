"use client";

import { useState } from "react";
import { MAX_TAGS, MAX_TAG_LENGTH, parseTags, tagKey } from "@/lib/tags";

// Campo de tags em "etiquetas": digite e aperte Enter ou vírgula. Sugere as
// tags que já existem em outras matérias (em linha, sem janela flutuante).
export default function TagInput({
  value,
  onChange,
  suggestions,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
}) {
  const [draft, setDraft] = useState("");
  const full = value.length >= MAX_TAGS;

  function commit(text = draft) {
    const next = parseTags([...value, ...text.split(",")]);
    if (next.length !== value.length) onChange(next);
    setDraft("");
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  const taken = new Set(value.map(tagKey));
  const query = tagKey(draft);
  const visible = suggestions
    .filter((tag) => !taken.has(tagKey(tag)) && (!query || tagKey(tag).includes(query)))
    .slice(0, 8);

  return (
    <div className="flex flex-col gap-2.5">
      <input type="hidden" name="tags" value={value.join(",")} />

      <div className="field flex min-h-[46px] flex-wrap items-center gap-2 !py-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft py-1 pl-3 pr-1.5 text-[13px] font-semibold text-forest"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              aria-label={`Remover a tag ${tag}`}
              className="flex h-5 w-5 items-center justify-center rounded-full text-forest hover:bg-forest hover:text-white"
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
                <path d="M1 1l8 8M9 1 1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => {
            const text = e.target.value;
            if (text.includes(",")) commit(text);
            else setDraft(text.slice(0, MAX_TAG_LENGTH));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            } else if (e.key === "Backspace" && !draft && value.length > 0) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => draft && commit()}
          disabled={full}
          placeholder={
            full ? "Limite de tags atingido" : value.length ? "Adicionar outra…" : "Ex.: acolhimento, família"
          }
          aria-label="Adicionar tag"
          className="min-w-[8rem] flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#8a8fa8] disabled:cursor-not-allowed"
        />
      </div>

      <p className="text-xs text-muted">
        Enter ou vírgula para adicionar · {value.length}/{MAX_TAGS} tags. Tags
        ajudam o leitor a achar matérias parecidas.
      </p>

      {visible.length > 0 && !full && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted">Já usadas:</span>
          {visible.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => commit(tag)}
              className="rounded-full border border-rule-strong bg-white px-2.5 py-1 font-semibold text-ink hover:border-forest hover:text-forest"
            >
              + {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
