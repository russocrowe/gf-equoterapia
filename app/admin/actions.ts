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
import { SITE_CONFIG_TAG, SITE_IMAGES_TAG } from "@/lib/public-data";
import { centerInfoKeys } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";

export type FormState = { ok: boolean; message: string } | null;

// ---------------------------------------------------------------------------
// Matérias
// ---------------------------------------------------------------------------

function readPostInput(formData: FormData): PostInput {
  const content = String(formData.get("content") ?? "");
  const readMinutesRaw = String(formData.get("read_minutes") ?? "").trim();

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content,
    category: String(formData.get("category") ?? "").trim(),
    read_minutes: readMinutesRaw
      ? Number(readMinutesRaw)
      : estimateReadMinutes(content),
    cover_image: String(formData.get("cover_image") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    author_name: String(formData.get("author_name") ?? "").trim() || null,
    author_role: String(formData.get("author_role") ?? "").trim() || null,
    reviewed_by: String(formData.get("reviewed_by") ?? "").trim() || null,
    reviewed_role: String(formData.get("reviewed_role") ?? "").trim() || null,
  };
}

function revalidatePosts(slug?: string) {
  revalidatePath("/admin", "layout");
  revalidatePath("/blog");
  revalidatePath("/");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function createPostAction(formData: FormData) {
  await assertAdmin();
  const supabase = await createClient();
  const input = readPostInput(formData);
  await createPost(supabase, input);
  revalidatePosts(input.slug);
  redirect("/admin/materias");
}

export async function updatePostAction(id: string, formData: FormData) {
  await assertAdmin();
  const supabase = await createClient();
  const existing = await getPostByIdAdmin(id);
  const input = readPostInput(formData);
  await updatePost(supabase, id, input, existing?.published ?? false);
  revalidatePosts(input.slug);
  redirect("/admin/materias");
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
