"use client";

import { useMemo, useState } from "react";
import PostCard from "@/components/PostCard";
import type { Post } from "@/lib/posts";

export default function BlogFilters({ posts }: { posts: Post[] }) {
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
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`rounded-full px-4 py-2 font-display text-sm font-medium transition-colors ${
            category === null
              ? "bg-azul text-white"
              : "border border-tinta/15 text-tinta/70 hover:border-azul"
          }`}
        >
          Todos
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-2 font-display text-sm font-medium transition-colors ${
              category === c
                ? "bg-azul text-white"
                : "border border-tinta/15 text-tinta/70 hover:border-azul"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <label className="relative block max-w-sm">
          <span className="sr-only">Buscar no blog</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ex.: autismo, hipoterapia…"
            className="w-full rounded-full border border-tinta/15 bg-white px-5 py-2.5 text-sm outline-none focus:border-azul"
          />
        </label>
      </div>

      <div className="mt-8 flex flex-col">
        {filtered.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-sm text-tinta/60">
            Nenhum artigo encontrado para essa busca.
          </p>
        )}
      </div>
    </div>
  );
}
