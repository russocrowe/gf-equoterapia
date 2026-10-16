"use client";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type ElementType,
  type KeyboardEvent,
} from "react";
import { useEditor } from "@/components/editor/EditorProvider";
import { contentDefaults, type ContentKey } from "@/lib/content-defaults";
import { serializeEditable } from "@/lib/rich-text";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div" | "li";

// Texto da página que o administrador edita direto nela. Para o visitante é
// só HTML estático; no modo de edição vira um campo de texto no próprio lugar.
export default function Editable({
  k,
  value,
  as = "span",
  className,
}: {
  k: ContentKey;
  value: string;
  as?: Tag;
  className?: string;
}) {
  const editor = useEditor();
  const {
    editing,
    version,
    savedTick,
    lastSaved,
    changedKeys,
    register,
    getBaseline,
    setValue,
  } = editor;
  const ref = useRef<HTMLElement>(null);
  const [html] = useState(value);
  const changed = changedKeys.includes(k);
  const seenVersion = useRef(version);
  const seenTick = useRef(savedTick);

  useEffect(() => {
    register(k, value);
  }, [k, value, register]);

  // Descartar: devolve o valor salvo.
  useEffect(() => {
    if (seenVersion.current === version) return;
    seenVersion.current = version;
    if (ref.current) ref.current.innerHTML = getBaseline(k) ?? value;
  }, [version, value, k, getBaseline]);

  // Depois de salvar: texto esvaziado volta ao padrão do site.
  useEffect(() => {
    if (seenTick.current === savedTick) return;
    seenTick.current = savedTick;
    if (k in lastSaved && lastSaved[k] === "" && ref.current) {
      ref.current.innerHTML = contentDefaults[k];
    }
  }, [savedTick, lastSaved, k]);

  function commit() {
    if (!ref.current) return;
    setValue(k, serializeEditable(ref.current));
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const mod = event.ctrlKey || event.metaKey;
    if (event.key === "Enter") {
      event.preventDefault();
      (event.currentTarget as HTMLElement).blur();
    } else if (event.key === "Escape") {
      (event.currentTarget as HTMLElement).blur();
    } else if (mod && ["b", "u"].includes(event.key.toLowerCase())) {
      event.preventDefault(); // só itálico é permitido
    }
  }

  function onPaste(event: ClipboardEvent<HTMLElement>) {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain").replace(/\s+/g, " ");
    document.execCommand("insertText", false, text);
  }

  function onBlur() {
    if (!ref.current) return;
    // Normaliza: o que aparece na tela é exatamente o que será salvo.
    const clean = serializeEditable(ref.current);
    if (ref.current.innerHTML !== clean) ref.current.innerHTML = clean;
  }

  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      className={className}
      data-editable={k}
      data-changed={editing && changed ? "true" : undefined}
      contentEditable={editing}
      suppressContentEditableWarning
      spellCheck={editing}
      lang="pt-BR"
      role={editing ? "textbox" : undefined}
      aria-label={editing ? "Texto editável" : undefined}
      onInput={editing ? commit : undefined}
      onKeyDown={editing ? onKeyDown : undefined}
      onPaste={editing ? onPaste : undefined}
      onBlur={editing ? onBlur : undefined}
      onDrop={editing ? (event: { preventDefault: () => void }) => event.preventDefault() : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
