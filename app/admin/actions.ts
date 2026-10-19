"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth";
import {
  createPost,
  deletePost,
  estimateReadMinutes,
  getPostByIdAdmin,
  updatePost,
  type PostInput,
} from "@/lib/posts";
import { MAX_CONTENT_LENGTH, isContentKey } from "@/lib/content-defaults";
import {
  SITE_CONFIG_TAG,
  SITE_CONTENT_TAG,
  SITE_IMAGES_TAG,
} from "@/lib/public-data";
import { plainText, sanitizeRich } from "@/lib/rich-text";
import { centerInfoKeys } from "@/lib/site-config";
import { slugify } from "@/lib/slug";
import { parseTags } from "@/lib/tags";
import { createClient } from "@/lib/supabase/server";

export type FormState = { ok: boolean; message: string } | null;

// ---------------------------------------------------------------------------
// Matérias
// ---------------------------------------------------------------------------

type PostIntent = "save" | "publish" | "unpublish";

const MAX_TITLE = 120;
const MAX_EXCERPT = 300;

function readPostInput(
  formData: FormData,
  intent: PostIntent,
  wasPublished: boolean,
): { input: PostInput } | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const category = String(formData.get("category") ?? "").trim();
  const cover = String(formData.get("cover_image") ?? "").trim();

  if (!title) return { error: "Escreva o título da matéria." };
  if (title.length > MAX_TITLE) {
    return { error: `O título passou de ${MAX_TITLE} caracteres. Encurte para o Google mostrar inteiro.` };
  }
  if (!slug) return { error: "O endereço da matéria (slug) ficou vazio." };
  if (!excerpt) return { error: "Escreva o resumo: ele aparece na lista de matérias e no Google." };
  if (excerpt.length > MAX_EXCERPT) {
    return { error: `O resumo passou de ${MAX_EXCERPT} caracteres.` };
  }
  if (!content.trim()) return { error: "O texto da matéria está vazio." };
  if (!category) return { error: "Escolha ou escreva uma categoria." };

  // A capa só pode vir do armazenamento do próprio site.
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  if (cover && !cover.startsWith(`${baseUrl}/storage/v1/object/public/`)) {
    return { error: "Endereço de capa não permitido. Envie a imagem pelo editor." };
  }

  const published =
    intent === "publish" ? true : intent === "unpublish" ? false : wasPublished;

  return {
    input: {
      slug,
      title,
      excerpt,
      content,
      category,
      read_minutes: estimateReadMinutes(content),
      cover_image: cover || null,
      featured: formData.get("featured") === "on",
      published,
      author_name: String(formData.get("author_name") ?? "").trim() || null,
      author_role: String(formData.get("author_role") ?? "").trim() || null,
      reviewed_by: String(formData.get("reviewed_by") ?? "").trim() || null,
      reviewed_role: String(formData.get("reviewed_role") ?? "").trim() || null,
      tags: parseTags(String(formData.get("tags") ?? "")),
    },
  };
}

function revalidatePosts(...slugs: (string | undefined)[]) {
  revalidatePath("/admin", "layout");
  revalidatePath("/equoterapia");
  revalidatePath("/");
  for (const slug of slugs) if (slug) revalidatePath(`/blog/${slug}`);
}

async function savePost(id: string | null, formData: FormData): Promise<FormState> {
  await assertAdmin();

  const rawIntent = String(formData.get("intent") ?? "save");
  const intent: PostIntent =
    rawIntent === "publish" || rawIntent === "unpublish" ? rawIntent : "save";

  const existing = id ? await getPostByIdAdmin(id) : null;
  if (id && !existing) return { ok: false, message: "Essa matéria não existe mais." };

  const parsed = readPostInput(formData, intent, existing?.published ?? false);
  if ("error" in parsed) return { ok: false, message: parsed.error };

  const supabase = await createClient();
  try {
    if (id) await updatePost(supabase, id, parsed.input, existing?.published ?? false);
    else await createPost(supabase, parsed.input);
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      return {
        ok: false,
        message: "Esse endereço (slug) já está em uso por outra matéria. Escolha outro.",
      };
    }
    return {
      ok: false,
      message: "Não foi possível salvar agora. Seu texto continua na tela; tente de novo em instantes.",
    };
  }

  revalidatePosts(parsed.input.slug, existing?.slug);
  const notice =
    intent === "publish" ? "publicada" : intent === "unpublish" ? "rascunho" : "salva";
  redirect(`/admin/materias?aviso=${notice}`);
}

export async function createPostAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  return savePost(null, formData);
}

export async function updatePostAction(
  id: string,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  return savePost(id, formData);
}

export async function deletePostAction(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  await deletePost(supabase, id);
  revalidatePosts();
}

// ---------------------------------------------------------------------------
// Informações do centro
// ---------------------------------------------------------------------------

export async function saveCenterInfoAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await assertAdmin();

  const value: Record<string, string> = {};
  for (const key of centerInfoKeys) {
    value[key] = String(formData.get(key) ?? "")
      .trim()
      .slice(0, 300);
  }

  if (
    value.email &&
    !value.email.startsWith("[") &&
    !/^\S+@\S+\.\S+$/.test(value.email)
  ) {
    return { ok: false, message: "O e-mail informado não parece válido." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "center", value }, { onConflict: "key" });

  if (error) {
    return {
      ok: false,
      message: "Não foi possível salvar agora. Tente novamente em instantes.",
    };
  }

  updateTag(SITE_CONFIG_TAG);
  revalidatePath("/", "layout");
  return { ok: true, message: "Informações salvas. O site já mostra os novos dados." };
}

// ---------------------------------------------------------------------------
// Imagens do site
// ---------------------------------------------------------------------------

const IMAGE_KEYS = ["hero", "sobre", "materia_padrao"];

export async function saveSiteImageAction(input: {
  key: string;
  url: string;
  alt: string;
  caption: string;
}): Promise<FormState> {
  await assertAdmin();

  if (!IMAGE_KEYS.includes(input.key)) {
    return { ok: false, message: "Imagem desconhecida." };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const allowedPrefix = `${baseUrl}/storage/v1/object/public/site-images/`;
  if (input.url && !input.url.startsWith(allowedPrefix)) {
    return { ok: false, message: "Endereço de imagem não permitido." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_images")
    .update({
      url: input.url,
      alt: input.alt.trim().slice(0, 300),
      caption: input.caption.trim().slice(0, 120),
    })
    .eq("key", input.key);

  if (error) {
    return { ok: false, message: "Não foi possível salvar a imagem agora." };
  }

  updateTag(SITE_IMAGES_TAG);
  revalidatePath("/", "layout");
  return { ok: true, message: "Imagem salva e publicada." };
}

// ---------------------------------------------------------------------------
// Textos das páginas (editor visual / "canvas")
// ---------------------------------------------------------------------------

export type SaveContentResult = {
  ok: boolean;
  message: string;
  // Valor final de cada chave, já limpo; "" = voltou ao texto original.
  saved?: Record<string, string>;
};

export async function saveContentAction(
  changes: Record<string, string>,
): Promise<SaveContentResult> {
  await assertAdmin();

  const clean: Record<string, string> = {};
  for (const [key, raw] of Object.entries(changes ?? {})) {
    if (!isContentKey(key) || typeof raw !== "string") continue;
    const value = sanitizeRich(raw);
    if (plainText(value).length > MAX_CONTENT_LENGTH) {
      return {
        ok: false,
        message: `Um dos textos passou de ${MAX_CONTENT_LENGTH} caracteres. Encurte e salve de novo.`,
      };
    }
    clean[key] = plainText(value) ? value : "";
  }

  if (Object.keys(clean).length === 0) {
    return { ok: true, message: "Nada para salvar.", saved: {} };
  }

  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "content")
    .maybeSingle();

  if (readError) {
    return { ok: false, message: "Não foi possível ler os textos atuais. Tente de novo." };
  }

  const merged: Record<string, string> = {
    ...((existing?.value as Record<string, string> | null) ?? {}),
  };
  for (const [key, value] of Object.entries(clean)) {
    if (value) merged[key] = value;
    else delete merged[key]; // texto vazio = volta ao padrão do site
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "content", value: merged }, { onConflict: "key" });

  if (error) {
    return {
      ok: false,
      message: "Não foi possível salvar agora. Suas alterações continuam na tela.",
    };
  }

  updateTag(SITE_CONTENT_TAG);
  revalidatePath("/", "layout");
  return {
    ok: true,
    message: "Alterações publicadas. O site já mostra os novos textos.",
    saved: clean,
  };
}
