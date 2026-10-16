"use client";

import { useMemo, useState } from "react";
import PostCard from "@/components/PostCard";
import type { Post } from "@/lib/posts";

const pill = "rounded-full border px-4 py-2 text-sm transition-colors";

export default function BlogFilters({
  posts,
  fallbackCover,
}: {
  posts: Post[];
  fallbackCover?: string;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(posts.map((post) => post.category))),
    [posts],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = !category || post.category === category;
      const matchesSearch =
        !term ||
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [posts, search, category]);

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`${pill} ${
              category === null
                ? "border-forest bg-forest text-white"
                : "border-rule-strong hover:border-forest"
            }`}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`${pill} ${
                category === c
                  ? "border-forest bg-forest text-white"
                  : "border-rule-strong hover:border-forest"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <label className="block w-full sm:max-w-xs">
          <span className="sr-only">Buscar nas matérias</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar: autismo, hipoterapia…"
            className="field rounded-full px-5"
          />
        </label>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <PostCard key={post.id} post={post} fallbackCover={fallbackCover} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-8 text-sm">Nenhuma matéria encontrada para essa busca.</p>
      )}
    </div>
  );
}
