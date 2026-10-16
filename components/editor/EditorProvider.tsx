"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { saveContentAction } from "@/app/admin/actions";
import { useAuth } from "@/components/AuthProvider";
import { contentDefaults, editablePages } from "@/lib/content-defaults";

type Status = {
  kind: "idle" | "saving" | "saved" | "error";
  text: string;
};

type EditorApi = {
  canEdit: boolean;
  editing: boolean;
  // Incrementa ao descartar: faz os textos voltarem ao valor salvo.
  version: number;
  // Incrementa depois de salvar: textos esvaziados voltam ao padrão.
  savedTick: number;
  lastSaved: Record<string, string>;
  changedKeys: string[];
  status: Status;
  pageLabel: string | null;
  startEditing: () => void;
  stopEditing: () => void;
  discard: () => void;
  save: () => Promise<void>;
  register: (key: string, value: string) => void;
  getBaseline: (key: string) => string | undefined;
  setValue: (key: string, html: string) => void;
  goToPage: (href: string) => void;
};

const EditorContext = createContext<EditorApi | null>(null);

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) throw new Error("useEditor precisa estar dentro de EditorProvider");
  return context;
}

// A URL é a fonte da verdade do modo de edição: "?editar=1" liga, sem ele
// desliga. Assim o painel (e o botão "voltar" do navegador) funcionam sem
// estado escondido. A mudança de URL é anunciada por este evento.
const URL_EVENT = "gf:url-change";

function subscribeToUrl(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(URL_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(URL_EVENT, callback);
  };
}

function setUrlParam(name: string, value: string | null) {
  const url = new URL(window.location.href);
  if (value === null) url.searchParams.delete(name);
  else url.searchParams.set(name, value);
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new Event(URL_EVENT));
}

export function EditorProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const search = useSyncExternalStore(
    subscribeToUrl,
    () => window.location.search,
    () => "",
  );
  const params = new URLSearchParams(search);

  // Só em desenvolvimento: "?dev-admin=1" libera o editor sem login e troca o
  // "salvar" por uma simulação. O ramo é removido do build de produção.
  const devMode =
    process.env.NODE_ENV !== "production" && params.get("dev-admin") === "1";
  const canEdit = isAdmin || devMode;
  const page = editablePages.find((p) => p.href === pathname) ?? null;
  const editing = canEdit && page !== null && params.get("editar") === "1";

  const [version, setVersion] = useState(0);
  const [savedTick, setSavedTick] = useState(0);
  const [lastSaved, setLastSaved] = useState<Record<string, string>>({});
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "" });

  const baseline = useRef<Record<string, string>>({});
  const changesRef = useRef(changes);
  const devModeRef = useRef(devMode);
  useEffect(() => {
    changesRef.current = changes;
    devModeRef.current = devMode;
  });

  const dirty = Object.keys(changes).length > 0;

  const register = useCallback((key: string, value: string) => {
    baseline.current[key] = value;
  }, []);

  const getBaseline = useCallback((key: string) => baseline.current[key], []);

  const setValue = useCallback((key: string, html: string) => {
    setChanges((current) => {
      const same = baseline.current[key] === html;
      if (same && !(key in current)) return current;
      const next = { ...current };
      if (same) delete next[key];
      else next[key] = html;
      return next;
    });
    setStatus((s) => (s.kind === "idle" ? s : { kind: "idle", text: "" }));
  }, []);

  const startEditing = useCallback(() => {
    setStatus({ kind: "idle", text: "" });
    setUrlParam("editar", "1");
  }, []);

  const discard = useCallback(() => {
    setChanges({});
    setVersion((v) => v + 1);
    setStatus({ kind: "idle", text: "" });
  }, []);

  const stopEditing = useCallback(() => {
    if (
      Object.keys(changesRef.current).length > 0 &&
      !window.confirm("Há alterações não publicadas. Sair e descartar?")
    ) {
      return;
    }
    setChanges({});
    setVersion((v) => v + 1);
    setStatus({ kind: "idle", text: "" });
    setUrlParam("editar", null);
  }, []);

  const save = useCallback(async () => {
    const pending = changesRef.current;
    if (Object.keys(pending).length === 0) return;
    setStatus({ kind: "saving", text: "Publicando…" });

    const applyBaseline = (saved: Record<string, string>) => {
      for (const [key, value] of Object.entries(saved)) {
        baseline.current[key] =
          value || contentDefaults[key as keyof typeof contentDefaults];
      }
      setLastSaved(saved);
      setChanges({});
      setSavedTick((t) => t + 1);
    };

    try {
      if (devModeRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        applyBaseline(pending);
        setStatus({ kind: "saved", text: "Modo de teste: nada foi salvo no banco." });
        return;
      }

      const result = await saveContentAction(pending);
      if (!result.ok) {
        setStatus({ kind: "error", text: result.message });
        return;
      }
      applyBaseline(result.saved ?? {});
      setStatus({ kind: "saved", text: result.message });
      router.refresh();
    } catch {
      setStatus({
        kind: "error",
        text: "Sem conexão com o servidor. Suas alterações continuam na tela.",
      });
    }
  }, [router]);

  const goToPage = useCallback(
    (href: string) => {
      if (
        Object.keys(changesRef.current).length > 0 &&
        !window.confirm("Há alterações não publicadas. Trocar de página e descartar?")
      ) {
        return;
      }
      setChanges({});
      const dev = devModeRef.current ? "&dev-admin=1" : "";
      router.push(`${href}?editar=1${dev}`);
    },
    [router],
  );

  // Marca a página como "em edição" e impede que links tirem o admin dela.
  useEffect(() => {
    if (!editing) return;
    const root = document.documentElement;
    root.classList.add("is-editing");

    const blockLinks = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || target.closest("[data-editor-ui]")) return;
      if (target.closest("a")) event.preventDefault();
    };
    document.addEventListener("click", blockLinks, true);

    return () => {
      root.classList.remove("is-editing");
      document.removeEventListener("click", blockLinks, true);
    };
  }, [editing]);

  // Avisa antes de fechar a aba com alterações não publicadas.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Ctrl/Cmd + S publica.
  useEffect(() => {
    if (!editing) return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, save]);

  const value = useMemo<EditorApi>(
    () => ({
      canEdit,
      editing,
      version,
      savedTick,
      lastSaved,
      changedKeys: Object.keys(changes),
      status,
      pageLabel: page?.label ?? null,
      startEditing,
      stopEditing,
      discard,
      save,
      register,
      getBaseline,
      setValue,
      goToPage,
    }),
    [
      canEdit,
      editing,
      version,
      savedTick,
      lastSaved,
      changes,
      status,
      page,
      startEditing,
      stopEditing,
      discard,
      save,
      register,
      getBaseline,
      setValue,
      goToPage,
    ],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}
