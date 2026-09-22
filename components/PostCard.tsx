import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="flex flex-col gap-3 border-b border-ink/10 py-8 first:pt-0">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-green">
        {post.category}
      </span>
      <h3 className="font-display text-xl font-semibold leading-snug">
        {post.title}
      </h3>
      <p className="text-sm text-muted">{post.excerpt}</p>
      <Link
        href={`/blog/${post.slug}`}
        className="font-display text-sm font-medium text-ink underline decoration-lime decoration-2 underline-offset-4"
      >
        {post.read_minutes} min de leitura &middot; Ler artigo ↗
      </Link>
    </article>
  );
}
