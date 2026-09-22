"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createPost,
  deletePost,
  estimateReadMinutes,
  getPostByIdAdmin,
  updatePost,
  type PostInput,
} from "@/lib/posts";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

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
    reviewed_role:
      String(formData.get("reviewed_role") ?? "").trim() || null,
  };
}

export async function createPostAction(formData: FormData) {
  const supabase = await createClient();
  const input = readPostInput(formData);
  await createPost(supabase, input);
  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin");
}

export async function updatePostAction(id: string, formData: FormData) {
  const supabase = await createClient();
  const existing = await getPostByIdAdmin(id);
  const input = readPostInput(formData);
  await updatePost(supabase, id, input, existing?.published ?? false);
  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath(`/blog/${input.slug}`);
  revalidatePath("/");
  redirect("/admin");
}

export async function deletePostAction(id: string) {
  const supabase = await createClient();
  await deletePost(supabase, id);
  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath("/");
}
