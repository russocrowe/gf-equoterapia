import type { Post } from "@/lib/posts";
import { tagKey } from "@/lib/tags";

const defaultCategories = [
  "Acolhimento",
  "Família",
  "Vínculos",
  "Equoterapia",
  "Saúde e bem-estar",
  "Novidades",
];

// Categorias e tags já usadas (as mais frequentes primeiro), para o editor
// sugerir em vez de a pessoa digitar de novo e criar variações.
export function buildSuggestions(posts: Pick<Post, "category" | "tags">[]) {
  const categories = new Map<string, string>();
  for (const c of [...posts.map((p) => p.category), ...defaultCategories]) {
    const name = c?.trim();
    if (name && !categories.has(tagKey(name))) categories.set(tagKey(name), name);
  }

  const counts = new Map<string, { tag: string; n: number }>();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      const key = tagKey(tag);
      const current = counts.get(key);
      if (current) current.n += 1;
      else counts.set(key, { tag, n: 1 });
    }
  }
  const tags = [...counts.values()]
    .sort((a, b) => b.n - a.n || a.tag.localeCompare(b.tag, "pt-BR"))
    .map((entry) => entry.tag);

  return { categories: [...categories.values()], tags };
}
