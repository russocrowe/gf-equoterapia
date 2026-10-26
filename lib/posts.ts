import { createClient as createServerSupabase } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_minutes: number;
  cover_image: string | null;
  featured: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_name: string | null;
  author_role: string | null;
  reviewed_by: string | null;
  reviewed_role: string | null;
  tags: string[];
  // Pode faltar até a migration 0006 rodar; ausente equivale a "mostrar".
  show_category?: boolean | null;
};

export type PostInput = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_minutes: number;
  cover_image?: string | null;
  featured: boolean;
  published: boolean;
  author_name?: string | null;
  author_role?: string | null;
  reviewed_by?: string | null;
  reviewed_role?: string | null;
  tags?: string[];
  show_category?: boolean;
};

// Categoria que deve aparecer no site (vazia quando está escondida ou em branco).
export function visibleCategory(
  post: Pick<Post, "category" | "show_category">,
): string {
  return post.show_category === false ? "" : (post.category ?? "").trim();
}

export function estimateReadMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedPost(): Promise<Post | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getRelatedPosts(
  category: string,
  excludeId: string,
): Promise<Post[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .eq("category", category)
    .neq("id", excludeId)
    .order("published_at", { ascending: false })
    .limit(3);

  if (error) throw error;

  if (!data || data.length < 3) {
    const { data: fallback, error: fallbackError } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .neq("id", excludeId)
      .order("published_at", { ascending: false })
      .limit(3);

    if (fallbackError) throw fallbackError;
    return fallback ?? [];
  }

  return data;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// --- Admin (authenticated) queries ---

export async function getAllPostsAdmin(): Promise<Post[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPostByIdAdmin(id: string): Promise<Post | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Colunas opcionais criadas por migrations posteriores (0005 tags, 0006
// show_category). Enquanto uma delas não existe no banco, salva sem ela em vez
// de falhar.
const OPTIONAL_COLUMNS = ["tags", "show_category"];

type DbError = { code?: string; message?: string } | null;

function missingOptionalColumn(error: DbError): string | null {
  if (!error || (error.code !== "PGRST204" && error.code !== "42703")) return null;
  return OPTIONAL_COLUMNS.find((column) => (error.message ?? "").includes(column)) ?? null;
}

async function saveWithoutMissingColumns(
  row: Record<string, unknown>,
  run: (row: Record<string, unknown>) => PromiseLike<{ error: DbError }>,
): Promise<DbError> {
  const current = { ...row };
  for (let attempt = 0; attempt <= OPTIONAL_COLUMNS.length; attempt++) {
    const { error } = await run(current);
    const missing = missingOptionalColumn(error);
    if (!missing || !(missing in current)) return error;
    delete current[missing];
  }
  return null;
}

export async function createPost(
  supabase: SupabaseClient,
  input: PostInput,
) {
  const row = {
    ...input,
    published_at: input.published ? new Date().toISOString() : null,
  };
  const error = await saveWithoutMissingColumns(row, (r) =>
    supabase.from("posts").insert(r),
  );
  if (error) throw error;
}

export async function updatePost(
  supabase: SupabaseClient,
  id: string,
  input: PostInput,
  wasPublished: boolean,
) {
  const row = {
    ...input,
    published_at:
      input.published && !wasPublished ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString(),
  };
  const error = await saveWithoutMissingColumns(row, (r) =>
    supabase.from("posts").update(r).eq("id", id),
  );
  if (error) throw error;
}

export async function deletePost(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}
