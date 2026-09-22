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
};

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

export async function createPost(
  supabase: SupabaseClient,
  input: PostInput,
) {
  const { error } = await supabase.from("posts").insert({
    ...input,
    published_at: input.published ? new Date().toISOString() : null,
  });
  if (error) throw error;
}

export async function updatePost(
  supabase: SupabaseClient,
  id: string,
  input: PostInput,
  wasPublished: boolean,
) {
  const { error } = await supabase
    .from("posts")
    .update({
      ...input,
      published_at:
        input.published && !wasPublished
          ? new Date().toISOString()
          : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
}

export async function deletePost(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}
